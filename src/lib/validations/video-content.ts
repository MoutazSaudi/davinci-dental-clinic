import "server-only";

// Container validation, not a codec decoder. Require a video track as well as
// the container signature, so renaming an image/audio file is insufficient.
type Box = { type: string; start: number; end: number };
function mp4Boxes(data: Buffer, start = 0, end = data.length): Box[] {
  const boxes: Box[] = [];
  while (start < end) {
    if (start + 8 > end) throw new Error("Truncated MP4 box");
    let size = data.readUInt32BE(start);
    const type = data.toString("ascii", start + 4, start + 8);
    let header = 8;
    if (size === 1) {
      if (start + 16 > end) throw new Error("Truncated MP4 size");
      size = Number(data.readBigUInt64BE(start + 8));
      header = 16;
    } else if (size === 0) size = end - start;
    if (!Number.isSafeInteger(size) || size < header || start + size > end) throw new Error("Invalid MP4 box");
    boxes.push({ type, start: start + header, end: start + size });
    start += size;
  }
  return boxes;
}

function isMp4Video(data: Buffer) {
  const boxes = mp4Boxes(data);
  const ftyp = boxes.find(b => b.type === "ftyp");
  const moov = boxes.find(b => b.type === "moov");
  if (!ftyp || !moov || ftyp.end - ftyp.start < 8 || !boxes.some(b => b.type === "mdat" && b.end > b.start)) return false;
  const brands = [data.toString("ascii", ftyp.start, ftyp.start + 4)];
  for (let i = ftyp.start + 8; i + 4 <= ftyp.end; i += 4) brands.push(data.toString("ascii", i, i + 4));
  if (!brands.some(b => /^(isom|iso[2-9]|mp4[12]|avc1|dash|M4V )$/.test(b))) return false;
  return mp4Boxes(data, moov.start, moov.end).filter(b => b.type === "trak").some(track =>
    mp4Boxes(data, track.start, track.end).filter(b => b.type === "mdia").some(media =>
      mp4Boxes(data, media.start, media.end).some(b => b.type === "hdlr" && b.end - b.start >= 12 && data.toString("ascii", b.start + 8, b.start + 12) === "vide")
    )
  );
}

type Element = { id: number; start: number; end: number };
function vint(data: Buffer, offset: number, keepMarker: boolean) {
  const first = data[offset];
  if (!first) throw new Error("Invalid EBML integer");
  let width = 1;
  while (width <= 8 && !(first & (0x80 >> (width - 1)))) width++;
  if (width > (keepMarker ? 4 : 8) || offset + width > data.length) throw new Error("Invalid EBML width");
  let value = keepMarker ? first : first & (0xff >> width);
  let unknown = !keepMarker && value === (0xff >> width);
  for (let i = 1; i < width; i++) {
    value = value * 256 + data[offset + i];
    unknown = unknown && data[offset + i] === 255;
  }
  return { value, width, unknown };
}
function ebmlElements(data: Buffer, start: number, end: number): Element[] {
  const elements: Element[] = [];
  while (start < end) {
    const id = vint(data, start, true);
    const size = vint(data, start + id.width, false);
    const body = start + id.width + size.width;
    const next = size.unknown ? end : body + size.value;
    if (!Number.isSafeInteger(next) || next > end || next < body) throw new Error("Truncated EBML element");
    elements.push({ id: id.value, start: body, end: next });
    start = next;
  }
  return elements;
}
function isWebmVideo(data: Buffer) {
  const root = ebmlElements(data, 0, data.length);
  if (root[0]?.id !== 0x1a45dfa3) return false;
  const header = root[0];
  const docType = ebmlElements(data, header.start, header.end).find(e => e.id === 0x4282);
  const segment = root.find(e => e.id === 0x18538067);
  if (!docType || data.toString("ascii", docType.start, docType.end) !== "webm" || !segment) return false;
  const children = ebmlElements(data, segment.start, segment.end);
  const tracks = children.find(e => e.id === 0x1654ae6b);
  if (!tracks || !children.some(e => e.id === 0x1f43b675 && e.end > e.start)) return false;
  return ebmlElements(data, tracks.start, tracks.end).filter(e => e.id === 0xae).some(track => {
    const fields = ebmlElements(data, track.start, track.end);
    const type = fields.find(e => e.id === 0x83);
    const codec = fields.find(e => e.id === 0x86);
    return type && type.end - type.start === 1 && data[type.start] === 1 && codec &&
      ["V_VP8", "V_VP9", "V_AV1"].includes(data.toString("ascii", codec.start, codec.end));
  });
}

export function validVideoContent(data: Buffer, mimeType: string): boolean {
  try {
    return mimeType === "video/mp4" ? isMp4Video(data) : mimeType === "video/webm" && isWebmVideo(data);
  } catch {
    return false;
  }
}
