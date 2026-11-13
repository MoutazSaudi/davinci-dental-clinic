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

// These messages are safe to return to clients: no native error messages or paths.
export const VIDEO_STORAGE_ERROR_MESSAGES = {
  storageUnavailable: "This hosting runtime does not support persistent local video storage. Ask the server owner to configure a supported persistent filesystem.",
  storageNotConfigured: "Video storage is not configured. Ask the server owner to set VIDEO_UPLOAD_DIR to a writable persistent directory.",
  storageInvalidPath: "The video storage configuration is invalid. VIDEO_UPLOAD_DIR must be an absolute directory path.",
  storageDirectoryFailed: "The application could not create the video upload directory. Ask the server owner to check the configured directory and its parent directories.",
  storagePermissionDenied: "The server denied access to video storage. Ask the server owner to grant the application read and write permissions.",
  storageReadOnly: "Video storage is on a read-only filesystem. Ask the server owner to provide a writable persistent volume.",
  storageError: "A video storage operation failed. Ask the server owner to check the storage capacity and server logs.",
} as const;

export function isVideoStorageErrorCode(code: string): code is keyof typeof VIDEO_STORAGE_ERROR_MESSAGES {
  return Object.hasOwn(VIDEO_STORAGE_ERROR_MESSAGES, code);
}

export type VideoErrorCode = "tooLarge" | "empty" | "invalidType" | "invalidName" |
  "invalidContent" | "invalidRequest" | "uploadFailed" | keyof typeof VIDEO_STORAGE_ERROR_MESSAGES;

export class VideoUploadError extends Error {
  constructor(public code: VideoErrorCode, public status = 400) {
    super(code);
  }
}
