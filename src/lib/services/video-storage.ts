import "server-only";
import { constants } from "node:fs";
import { mkdir, open, unlink, writeFile } from "node:fs/promises";
import { isAbsolute, join } from "node:path";
import { randomUUID } from "node:crypto";
import { MANAGED_VIDEO_FILENAME, MAX_VIDEO_BYTES, VideoUploadError } from "@/lib/validations/video";

export function videoStorageDirectory() {
  const configured = process.env.VIDEO_UPLOAD_DIR;
  // Serverless filesystems cannot satisfy the required persistent storage contract.
  if (process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME ||
    (configured && !isAbsolute(configured)) ||
    (process.env.NODE_ENV === "production" && !configured)) {
    throw new VideoUploadError("storageUnavailable", 503);
  }
  return configured || join(process.cwd(), "uploads", "videos");
}

export async function readVideoUpload(request: Request): Promise<Buffer> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || !Number.isSafeInteger(Number(length)))) throw new VideoUploadError("invalidRequest");
  if (length && Number(length) > MAX_VIDEO_BYTES) throw new VideoUploadError("tooLarge", 413);
  if (!request.body) throw new VideoUploadError("empty");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_VIDEO_BYTES) {
        await reader.cancel();
        throw new VideoUploadError("tooLarge", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  if (!total) throw new VideoUploadError("empty");
  if (length && Number(length) !== total) throw new VideoUploadError("invalidRequest");
  return Buffer.concat(chunks, total);
}

export async function storeVideo(bytes: Buffer, extension: "mp4" | "webm") {
  const directory = videoStorageDirectory();
  await mkdir(directory, { recursive: true, mode: 0o750 });
  const filename = `${randomUUID()}.${extension}`;
  const path = `uploads/videos/${filename}`;
  // Files live on a runtime volume; they must not be traced into build output.
  try {
    await writeFile(join(/* turbopackIgnore: true */ directory, filename), bytes, { flag: "wx", mode: 0o640 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") await unlink(join(/* turbopackIgnore: true */ directory, filename)).catch(() => undefined);
    throw error;
  }
  return path;
}

export async function deleteManagedVideo(path: string) {
  const filename = path.replace(/^uploads\/videos\//, "");
  if (path !== `uploads/videos/${filename}` || !MANAGED_VIDEO_FILENAME.test(filename)) return;
  await unlink(join(/* turbopackIgnore: true */ videoStorageDirectory(), filename)).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "ENOENT") console.error("Could not clean up a managed video", error.code);
  });
}

export async function openManagedVideo(filename: string) {
  if (!MANAGED_VIDEO_FILENAME.test(filename)) return null;
  try {
    const file = await open(/* turbopackIgnore: true */ join(/* turbopackIgnore: true */ videoStorageDirectory(), filename), constants.O_RDONLY | constants.O_NOFOLLOW);
    try {
      const stat = await file.stat();
      if (!stat.isFile() || stat.size <= 0 || stat.size > MAX_VIDEO_BYTES) {
        await file.close();
        return null;
      }
      return { file, size: stat.size };
    } catch (error) {
      await file.close();
      throw error;
    }
  } catch (error) {
    if (["ENOENT", "ELOOP", "ENOTDIR"].includes((error as NodeJS.ErrnoException).code || "")) return null;
    throw error;
  }
}
