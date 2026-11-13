import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminRoleApi } from "@/lib/auth";
import { getActiveVideo, replaceActiveVideo } from "@/lib/services/video.service";
import { readVideoUpload, videoStorageDirectory } from "@/lib/services/video-storage";
import { videoMetadataError, VideoUploadError } from "@/lib/validations/video";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown) {
  if (error instanceof VideoUploadError) return NextResponse.json({ error: error.code }, { status: error.status });
  console.error("Video management failed");
  return NextResponse.json({ error: "uploadFailed" }, { status: 500 });
}

export async function GET() {
  try {
    const auth = await requireAdminRoleApi();
    if (auth instanceof NextResponse) return auth;
    return NextResponse.json(await getActiveVideo(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}

// Raw file body allows bounded reads and real XMLHttpRequest upload progress,
// without buffering an unbounded multipart form or raising Server Action limits.
export async function POST(request: Request) {
  try {
    const auth = await requireAdminRoleApi();
    if (auth instanceof NextResponse) return auth;
    if (auth.user.mustChangePassword) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const origin = request.headers.get("origin");
    // Use the original Host, including its port, so TLS-terminating VPS proxies
    // work even when the internal Node request URL uses http://localhost.
    let originUrl: URL;
    try { originUrl = new URL(origin || ""); }
    catch { return NextResponse.json({ error: "forbidden" }, { status: 403 }); }
    const host = request.headers.get("host") || new URL(request.url).host;
    if (originUrl.host !== host || !["http:", "https:"].includes(originUrl.protocol) || request.headers.get("sec-fetch-site") === "cross-site") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    let name: string;
    try { name = decodeURIComponent(request.headers.get("x-video-name") || ""); }
    catch { throw new VideoUploadError("invalidName"); }
    const mimeType = request.headers.get("content-type") || "";
    const metadataError = videoMetadataError(name, mimeType, 1);
    if (metadataError) throw new VideoUploadError(metadataError);
    videoStorageDirectory();
    const bytes = await readVideoUpload(request);
    const active = await replaceActiveVideo(bytes, name, mimeType);
    // Commit is complete; a cache failure must not report a failed upload.
    try {
      revalidatePath("/ar");
      revalidatePath("/en");
      revalidatePath("/admin/videos");
    } catch { console.error("Video saved, but page revalidation failed"); }
    return NextResponse.json(active, { status: 201 });
  } catch (error) { return failure(error); }
}
