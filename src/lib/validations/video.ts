export const MAX_VIDEO_BYTES = 20 * 1024 * 1024;
export const FALLBACK_VIDEO_URL = "/video/v.mp4";
export const MANAGED_VIDEO_FILENAME = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(mp4|webm)$/;

export function videoMetadataError(name: string, type: string, size: number) {
  if (size > MAX_VIDEO_BYTES) return "tooLarge";
  if (size <= 0) return "empty";
  const extension = name.split(".").pop()?.toLowerCase();
  if (!((extension === "mp4" && type === "video/mp4") ||
    (extension === "webm" && type === "video/webm"))) return "invalidType";
  if (name.length > 255 || /[\u0000-\u001f\u007f/\\]/.test(name)) return "invalidName";
  return null;
}

export type VideoErrorCode = "tooLarge" | "empty" | "invalidType" | "invalidName" |
  "invalidContent" | "invalidRequest" | "storageUnavailable" | "uploadFailed";

export class VideoUploadError extends Error {
  constructor(public code: VideoErrorCode, public status = 400) {
    super(code);
  }
}
