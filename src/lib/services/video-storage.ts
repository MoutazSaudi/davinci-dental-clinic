import "server-only";
import { constants } from "node:fs";
import fs from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { MANAGED_VIDEO_FILENAME, MAX_VIDEO_BYTES, VideoUploadError } from "@/lib/validations/video";

export function videoStorageDirectory() {
  const configured = process.env.VIDEO_UPLOAD_DIR;
  // Serverless filesystems cannot satisfy the required persistent storage contract.
  if (process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    console.error("[video-storage] Persistent local storage is unsupported by this runtime.", { code: "UNSUPPORTED_RUNTIME" });
    throw new VideoUploadError("storageUnavailable", 503);
  }
  if (configured?.includes("\0")) {
    console.error("[video-storage] VIDEO_UPLOAD_DIR contains an invalid path character.", { code: "INVALID_VIDEO_UPLOAD_DIR" });
    throw new VideoUploadError("storageInvalidPath", 503);
  }
  if (process.env.NODE_ENV === "production" && !configured) {
    console.error("[video-storage] Set VIDEO_UPLOAD_DIR to a writable persistent directory in the application runtime environment.", { code: "MISSING_VIDEO_UPLOAD_DIR" });
    throw new VideoUploadError("storageNotConfigured", 503);
  }
  const directory = configured || "uploads/videos";
  return isAbsolute(directory) ? directory : resolve(process.cwd(), directory);
}

type StorageOperation = "createDirectory" | "write" | "read" | "cleanup";

function filesystemErrorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") return error.code;
  return "UNKNOWN";
}

function logStorageError(error: unknown, operation: StorageOperation) {
  const code = filesystemErrorCode(error);
  // Do not log raw error messages/objects: these may contain paths or other data.
  console.error("[video-storage] Filesystem operation failed; check directory ownership, mount write access and available disk space.", { operation, code });
  return code;
}

function storageFailure(error: unknown, operation: StorageOperation) {
  const code = logStorageError(error, operation);
  if (code === "EACCES" || code === "EPERM") return new VideoUploadError("storagePermissionDenied", 503);
  if (code === "EROFS") return new VideoUploadError("storageReadOnly", 503);
  return new VideoUploadError(operation === "createDirectory" ? "storageDirectoryFailed" : "storageError", 500);
}

export async function ensureVideoStorageDirectory() {
  const directory = videoStorageDirectory();
  try {
    await fs.mkdir(/* turbopackIgnore: true */ directory, { recursive: true, mode: 0o750 });
  } catch (error) {
    throw storageFailure(error, "createDirectory");
  }
  return directory;
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
  const directory = await ensureVideoStorageDirectory();
  const filename = `${randomUUID()}.${extension}`;
  const path = `uploads/videos/${filename}`;
  // Files live on a runtime volume; they must not be traced into build output.
  try {
    await fs.writeFile(join(/* turbopackIgnore: true */ directory, filename), bytes, { flag: "wx", mode: 0o640 });
  } catch (error) {
    const failure = storageFailure(error, "write");
    if (filesystemErrorCode(error) !== "EEXIST") {
      await fs.unlink(join(/* turbopackIgnore: true */ directory, filename)).catch(cleanupError => {
        if (filesystemErrorCode(cleanupError) !== "ENOENT") logStorageError(cleanupError, "cleanup");
      });
    }
    throw failure;
  }
  return path;
}

export async function deleteManagedVideo(path: string) {
  const filename = path.replace(/^uploads\/videos\//, "");
  if (path !== `uploads/videos/${filename}` || !MANAGED_VIDEO_FILENAME.test(filename)) return;
  await fs.unlink(join(/* turbopackIgnore: true */ videoStorageDirectory(), filename)).catch(error => {
    if (filesystemErrorCode(error) !== "ENOENT") logStorageError(error, "cleanup");
  });
}

export async function openManagedVideo(filename: string) {
  if (!MANAGED_VIDEO_FILENAME.test(filename)) return null;
  const directory = videoStorageDirectory();
  try {
    const file = await fs.open(/* turbopackIgnore: true */ join(/* turbopackIgnore: true */ directory, filename), constants.O_RDONLY | constants.O_NOFOLLOW);
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
    if (["ENOENT", "ELOOP", "ENOTDIR"].includes(filesystemErrorCode(error))) return null;
    throw storageFailure(error, "read");
  }
}
