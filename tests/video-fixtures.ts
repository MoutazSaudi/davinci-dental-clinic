import { readFileSync } from "node:fs";

// showcase.webm is a 64x64 canvas recorded locally with Chrome MediaRecorder
// (VP8, 10 fps, alternating solid colors, 1.5 seconds); no third-party content.
// The audio-only variant below is a structural rejection fixture.
function element(id: number[], data: Buffer) {
  if (data.length >= 127) throw new Error("Fixture element too large");
  return Buffer.concat([Buffer.from([...id, 0x80 | data.length]), data]);
}
export function webmFixture(video = true) {
  if (video) return readFileSync(new URL("./fixtures/showcase.webm", import.meta.url));
  const header = element([0x1a, 0x45, 0xdf, 0xa3], element([0x42, 0x82], Buffer.from("webm")));
  const track = element([0xae], Buffer.concat([
    element([0x83], Buffer.from([video ? 1 : 2])),
    element([0x86], Buffer.from(video ? "V_VP8" : "A_OPUS")),
  ]));
  const segment = element([0x18, 0x53, 0x80, 0x67], Buffer.concat([
    element([0x16, 0x54, 0xae, 0x6b], track),
    element([0x1f, 0x43, 0xb6, 0x75], Buffer.from([0xe7, 0x81, 0])),
  ]));
  return Buffer.concat([header, segment]);
}
