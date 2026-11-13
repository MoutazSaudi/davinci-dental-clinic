import "server-only";
import { openManagedVideo } from "./video-storage";

export function videoByteRange(header: string, size: number): { start: number; end: number } | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2])) return null;
  const first = match[1] ? Number(match[1]) : null;
  const last = match[2] ? Number(match[2]) : null;
  if ((first !== null && !Number.isSafeInteger(first)) || (last !== null && !Number.isSafeInteger(last))) return null;
  if (first === null) return last && last > 0 ? { start: Math.max(0, size - last), end: size - 1 } : null;
  if (first >= size || (last !== null && last < first)) return null;
  return { start: first, end: last === null ? size - 1 : Math.min(last, size - 1) };
}

export async function serveVideo(request: Request, filename: string, head = false): Promise<Response> {
  const opened = await openManagedVideo(filename);
  if (!opened) return new Response(null, { status: 404 });
  const { file, size } = opened;
  const etag = `"${filename}-${size}"`;
  const headers = new Headers({
    "Content-Type": filename.endsWith(".mp4") ? "video/mp4" : "video/webm",
    "Accept-Ranges": "bytes",
    "Content-Length": String(size),
    "Cache-Control": "public, max-age=0, must-revalidate",
    "X-Content-Type-Options": "nosniff",
    ETag: etag,
  });
  if (request.headers.get("if-none-match") === etag) {
    await file.close();
    headers.delete("Content-Length");
    return new Response(null, { status: 304, headers });
  }
  if (head) {
    await file.close();
    return new Response(null, { headers });
  }
  const rangeHeader = request.headers.get("range");
  const ifRange = request.headers.get("if-range");
  const useRange = rangeHeader && (!ifRange || ifRange === etag);
  const range = useRange ? videoByteRange(rangeHeader, size) : { start: 0, end: size - 1 };
  if (!range) {
    await file.close();
    headers.set("Content-Range", `bytes */${size}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }
  if (useRange) headers.set("Content-Range", `bytes ${range.start}-${range.end}/${size}`);
  headers.set("Content-Length", String(range.end - range.start + 1));
  let position = range.start;
  let closed = false;
  async function close() {
    if (!closed) { closed = true; await file.close(); }
  }
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        if (position > range.end) { await close(); controller.close(); return; }
        const chunk = Buffer.alloc(Math.min(64 * 1024, range.end - position + 1));
        const { bytesRead } = await file.read(chunk, 0, chunk.length, position);
        if (!bytesRead) throw new Error("Unexpected end of video");
        position += bytesRead;
        controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, bytesRead));
      } catch (error) {
        await close();
        controller.error(error);
      }
    },
    async cancel() { await close(); },
  });
  return new Response(stream, { status: useRange ? 206 : 200, headers });
}
