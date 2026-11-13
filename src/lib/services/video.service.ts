import "server-only";
import prisma from "@/lib/prisma";
import { FALLBACK_VIDEO_URL, MANAGED_VIDEO_FILENAME, MAX_VIDEO_BYTES, videoMetadataError, VideoUploadError } from "@/lib/validations/video";
import { validVideoContent } from "@/lib/validations/video-content";
import { deleteManagedVideo, storeVideo } from "./video-storage";
import type { ActiveVideo } from "@/types/video";

export async function getActiveVideo(): Promise<ActiveVideo> {
  const setting = await prisma.videoSetting.findUnique({ where: { id: "showcase" } });
  const filename = setting?.path.replace(/^uploads\/videos\//, "");
  if (!setting || !filename || setting.path !== `uploads/videos/${filename}` || !MANAGED_VIDEO_FILENAME.test(filename)) {
    return { url: FALLBACK_VIDEO_URL, originalName: null, size: null, updatedAt: null, managed: false };
  }
  return {
    url: `/media/videos/${filename}`,
    originalName: setting.originalName,
    size: setting.size,
    updatedAt: setting.updatedAt.toISOString(),
    managed: true,
  };
}

export async function replaceActiveVideo(bytes: Buffer, name: string, mimeType: string): Promise<ActiveVideo> {
  const error = videoMetadataError(name, mimeType, bytes.length);
  if (error) throw new VideoUploadError(error, bytes.length > MAX_VIDEO_BYTES ? 413 : 400);
  if (!validVideoContent(bytes, mimeType)) throw new VideoUploadError("invalidContent");
  const path = await storeVideo(bytes, mimeType === "video/mp4" ? "mp4" : "webm");
  let previous: string | undefined;
  let updatedAt: Date;
  try {
    // Serialize replacements across workers, including the first upload when no row exists.
    const result = await prisma.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(76430821)`;
      const old = await tx.videoSetting.findUnique({ where: { id: "showcase" } });
      const data = { path, originalName: name, mimeType, size: bytes.length };
      const saved = await tx.videoSetting.upsert({ where: { id: "showcase" }, create: { id: "showcase", ...data }, update: data });
      return { previous: old?.path, updatedAt: saved.updatedAt };
    });
    previous = result.previous;
    updatedAt = result.updatedAt;
  } catch (error) {
    await deleteManagedVideo(path);
    throw error;
  }
  // A cleanup failure must never turn a committed replacement into an upload error.
  if (previous && previous !== path) await deleteManagedVideo(previous).catch(() => console.error("Managed video cleanup failed"));
  return { url: `/media/videos/${path.split("/").pop()}`, originalName: name, size: bytes.length, updatedAt: updatedAt.toISOString(), managed: true };
}
