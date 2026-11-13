import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { MAX_VIDEO_BYTES, VideoUploadError, videoMetadataError } from "../src/lib/validations/video";
import { validVideoContent } from "../src/lib/validations/video-content";
import { ensureVideoStorageDirectory, readVideoUpload, storeVideo, deleteManagedVideo, videoStorageDirectory } from "../src/lib/services/video-storage";
import { serveVideo, videoByteRange } from "../src/lib/services/video-delivery";
import { webmFixture } from "./video-fixtures";

test("extensions, matching MIME and exact 20 MiB limit", () => {
  assert.equal(videoMetadataError("tour.MP4", "video/mp4", MAX_VIDEO_BYTES), null);
  assert.equal(videoMetadataError("tour.webm", "video/webm", 10), null);
  for (const [name, mime] of [["tour.exe", "video/mp4"], ["tour.mp4", "video/webm"], ["tour.mp4", "image/png"]]) assert.equal(videoMetadataError(name, mime, 10), "invalidType");
  assert.equal(videoMetadataError("../tour.mp4", "video/mp4", 10), "invalidName");
  assert.equal(videoMetadataError("tour.mp4", "video/mp4", MAX_VIDEO_BYTES + 1), "tooLarge");
  assert.equal(videoMetadataError("tour.webm", "video/webm", 0), "empty");
});

test("content validation detects real MP4 and WebM tracks; rejects renamed files, audio-only and truncation", async () => {
  const mp4 = await readFile("public/video/v.mp4");
  assert.ok(validVideoContent(mp4, "video/mp4"));
  assert.ok(validVideoContent(webmFixture(), "video/webm"));
  assert.equal(validVideoContent(webmFixture(false), "video/webm"), false);
  for (const mime of ["video/mp4", "video/webm"]) {
    for (const bytes of [Buffer.from("<script>bad</script>"), Buffer.from("\x89PNG"), mp4.subarray(0, 32)]) assert.equal(validVideoContent(bytes, mime), false);
  }
  assert.equal(validVideoContent(mp4, "video/webm"), false);
  assert.equal(validVideoContent(webmFixture(), "video/mp4"), false);
});

function streamed(chunks: Uint8Array[], headers?: HeadersInit) {
  return new Request("http://localhost/upload", {
    method: "POST", headers, duplex: "half",
    body: new ReadableStream({ start(controller) { for (const chunk of chunks) controller.enqueue(chunk); controller.close(); } }),
  } as RequestInit & { duplex: string });
}
test("server bounds actual streamed size even with absent or forged Content-Length", async () => {
  const max = Buffer.alloc(MAX_VIDEO_BYTES);
  assert.equal((await readVideoUpload(streamed([max]))).length, MAX_VIDEO_BYTES);
  for (const headers of [undefined, { "content-length": "1" }, { "content-length": String(MAX_VIDEO_BYTES + 1) }]) {
    await assert.rejects(readVideoUpload(streamed([max, Buffer.alloc(1)], headers)), { code: "tooLarge", status: 413 });
  }
  await assert.rejects(readVideoUpload(streamed([Buffer.alloc(2)], { "content-length": "3" })), { code: "invalidRequest" });
  await assert.rejects(readVideoUpload(streamed([])), { code: "empty" });
});

test("range parsing covers seeking, suffixes, open ranges and invalid ranges", () => {
  assert.deepEqual(videoByteRange("bytes=2-4", 10), { start: 2, end: 4 });
  assert.deepEqual(videoByteRange("bytes=2-", 10), { start: 2, end: 9 });
  assert.deepEqual(videoByteRange("bytes=-3", 10), { start: 7, end: 9 });
  assert.deepEqual(videoByteRange("bytes=0-999", 10), { start: 0, end: 9 });
  for (const range of ["bytes=10-", "bytes=-0", "bytes=5-2", "bytes=0-1,3-4", "bytes=-", "bytes=999999999999999999999-"]) assert.equal(videoByteRange(range, 10), null);
});

test("UUID storage, GET/HEAD/ranges, symlink/path isolation, original fallback protection", async () => {
  const directory = await mkdtemp(join(tmpdir(), "davinci-video-"));
  const previous = process.env.VIDEO_UPLOAD_DIR;
  process.env.VIDEO_UPLOAD_DIR = join(directory, "uploads", "videos");
  try {
    const bytes = await readFile("public/video/v.mp4");
    const path = await storeVideo(bytes, "mp4");
    const filename = path.split("/").pop()!;
    const req = (headers?: HeadersInit) => new Request("http://localhost/media/videos/test", { headers });
    const full = await serveVideo(req(), filename);
    assert.equal(full.status, 200);
    assert.equal(full.headers.get("content-type"), "video/mp4");
    assert.deepEqual(Buffer.from(await full.arrayBuffer()), bytes);
    for (const [range, start, end] of [["bytes=10-99", 10, 99], ["bytes=-10", bytes.length - 10, bytes.length - 1], [`bytes=${bytes.length - 5}-`, bytes.length - 5, bytes.length - 1]] as const) {
      const response = await serveVideo(req({ range }), filename);
      assert.equal(response.status, 206);
      assert.equal(response.headers.get("content-range"), `bytes ${start}-${end}/${bytes.length}`);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(start, end + 1));
    }
    const head = await serveVideo(req(), filename, true);
    assert.equal(head.headers.get("content-length"), String(bytes.length));
    assert.equal((await head.arrayBuffer()).byteLength, 0);
    assert.equal((await serveVideo(req({ "if-none-match": head.headers.get("etag")! }), filename)).status, 304);
    const unmatched = await serveVideo(req({ range: "bytes=0-9", "if-range": '"old"' }), filename);
    assert.equal(unmatched.status, 200);
    await unmatched.body?.cancel();
    assert.equal((await serveVideo(req({ range: `bytes=${bytes.length}-` }), filename)).status, 416);
    for (const invalid of ["../v.mp4", "v.mp4", "../../.env", `${randomUUID()}.html`]) assert.equal((await serveVideo(req(), invalid)).status, 404);
    const link = `${randomUUID()}.mp4`;
    await symlink(join(process.cwd(), "public/video/v.mp4"), join(process.env.VIDEO_UPLOAD_DIR, link));
    assert.equal((await serveVideo(req(), link)).status, 404);
    await deleteManagedVideo("public/video/v.mp4");
    assert.deepEqual(await readFile("public/video/v.mp4"), bytes);
    const webmPath = await storeVideo(webmFixture(), "webm");
    const webm = await serveVideo(req(), webmPath.split("/").pop()!);
    assert.equal(webm.headers.get("content-type"), "video/webm");
    await webm.arrayBuffer();
    await deleteManagedVideo(path);
    assert.equal((await readdir(process.env.VIDEO_UPLOAD_DIR)).includes(filename), false);
    const oversized = `${randomUUID()}.mp4`;
    await writeFile(join(process.env.VIDEO_UPLOAD_DIR, oversized), Buffer.alloc(MAX_VIDEO_BYTES + 1));
    assert.equal((await serveVideo(req(), oversized)).status, 404);
  } finally {
    if (previous === undefined) delete process.env.VIDEO_UPLOAD_DIR; else process.env.VIDEO_UPLOAD_DIR = previous;
    await rm(directory, { recursive: true, force: true });
  }
});

test("storage distinguishes missing production config, invalid paths and ephemeral runtimes", t => {
  const keys = ["VIDEO_UPLOAD_DIR", "NODE_ENV", "VERCEL", "NETLIFY", "AWS_LAMBDA_FUNCTION_NAME"];
  const previous = new Map(keys.map(key => [key, process.env[key]]));
  const log = t.mock.method(console, "error", () => undefined);
  try {
    for (const key of keys) delete process.env[key];
    assert.equal(videoStorageDirectory(), join(process.cwd(), "uploads", "videos"));
    Object.assign(process.env, { NODE_ENV: "production" });
    assert.throws(videoStorageDirectory, { code: "storageNotConfigured", status: 503 });
    process.env.VIDEO_UPLOAD_DIR = "uploads/videos";
    assert.equal(videoStorageDirectory(), join(process.cwd(), "uploads", "videos"));
    process.env.VIDEO_UPLOAD_DIR = "./uploads/./videos";
    assert.equal(videoStorageDirectory(), join(process.cwd(), "uploads", "videos"));
    // Node truncates null bytes assigned to its native environment object.
    // Use an ordinary object to exercise the invalid-character defense.
    const runtimeEnvironment = process.env;
    try {
      process.env = { ...runtimeEnvironment, VIDEO_UPLOAD_DIR: "uploads/videos\0invalid" };
      assert.throws(videoStorageDirectory, { code: "storageInvalidPath", status: 503 });
    } finally { process.env = runtimeEnvironment; }
    const absolute = `${tmpdir()}/uploads/./videos/../videos`;
    process.env.VIDEO_UPLOAD_DIR = absolute;
    assert.equal(videoStorageDirectory(), absolute, "Absolute configuration is preserved verbatim");
    process.env.VERCEL = "1";
    assert.throws(videoStorageDirectory, { code: "storageUnavailable" });
    assert.deepEqual(log.mock.calls.map(call => call.arguments[1]), [
      { code: "MISSING_VIDEO_UPLOAD_DIR" }, { code: "INVALID_VIDEO_UPLOAD_DIR" }, { code: "UNSUPPORTED_RUNTIME" },
    ]);
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test("storage creates missing nested directories without manual setup", async t => {
  const directory = await mkdtemp(join(tmpdir(), "davinci-storage-create-"));
  const previous = process.env.VIDEO_UPLOAD_DIR;
  const absoluteDirectory = join(directory, "missing", "uploads", "videos");
  process.env.VIDEO_UPLOAD_DIR = relative(process.cwd(), absoluteDirectory);
  t.after(async () => {
    if (previous === undefined) delete process.env.VIDEO_UPLOAD_DIR; else process.env.VIDEO_UPLOAD_DIR = previous;
    await rm(directory, { recursive: true, force: true });
  });
  assert.equal(await ensureVideoStorageDirectory(), absoluteDirectory);
  assert.ok((await fs.stat(absoluteDirectory)).isDirectory());
  assert.equal(await ensureVideoStorageDirectory(), absoluteDirectory);
});

test("storage classifies filesystem errors and logs the real errno without raw messages", async t => {
  const directory = await mkdtemp(join(tmpdir(), "davinci-storage-errors-"));
  const previous = process.env.VIDEO_UPLOAD_DIR;
  process.env.VIDEO_UPLOAD_DIR = directory;
  t.after(async () => {
    if (previous === undefined) delete process.env.VIDEO_UPLOAD_DIR; else process.env.VIDEO_UPLOAD_DIR = previous;
    await rm(directory, { recursive: true, force: true });
  });
  for (const [operation, errno, code, status] of [
    ["mkdir", "EACCES", "storagePermissionDenied", 503],
    ["mkdir", "EPERM", "storagePermissionDenied", 503],
    ["mkdir", "EROFS", "storageReadOnly", 503],
    ["mkdir", "ENOTDIR", "storageDirectoryFailed", 500],
    ["writeFile", "EACCES", "storagePermissionDenied", 503],
    ["writeFile", "EROFS", "storageReadOnly", 503],
    ["writeFile", "ENOSPC", "storageError", 500],
  ] as const) {
    await t.test(`${operation}: ${errno}`, async child => {
      const log = child.mock.method(console, "error", () => undefined);
      child.mock.method(fs, operation, async () => { throw Object.assign(new Error("Sensitive native message /private/server/path"), { code: errno }); });
      await assert.rejects(storeVideo(Buffer.from("test"), "mp4"), error => {
        assert.ok(error instanceof VideoUploadError);
        assert.equal(error.code, code);
        assert.equal(error.status, status);
        assert.ok(!error.message.includes("/private"));
        return true;
      });
      assert.deepEqual(log.mock.calls[0].arguments[1], { operation: operation === "mkdir" ? "createDirectory" : "write", code: errno });
      assert.ok(!JSON.stringify(log.mock.calls[0].arguments).includes("Sensitive native message"));
    });
  }
});
