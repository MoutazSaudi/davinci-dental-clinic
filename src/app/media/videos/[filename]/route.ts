import { serveVideo } from "@/lib/services/video-delivery";
import { VideoUploadError } from "@/lib/validations/video";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ filename: string }> };
async function respond(request: Request, context: Context, head: boolean) {
  const { filename } = await context.params;
  try {
    return await serveVideo(request, filename, head);
  } catch (error) {
    console.error("Video delivery failed", error instanceof VideoUploadError ? error.code : "storage error");
    return new Response(null, { status: 503 });
  }
}
export function GET(request: Request, context: Context) { return respond(request, context, false); }
export function HEAD(request: Request, context: Context) { return respond(request, context, true); }
