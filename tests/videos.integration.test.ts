import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import { MAX_VIDEO_BYTES, VIDEO_STORAGE_ERROR_MESSAGES } from "../src/lib/validations/video";
import { webmFixture } from "./video-fixtures";

declare global { var __videoTestToken: string | undefined; }

test("video upload API and database lifecycle in an isolated PostgreSQL schema", { timeout: 240000 }, async t => {
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required");
  const url = new URL(process.env.DATABASE_URL);
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname), "Only a local test database is allowed");
  const originalUrl = process.env.DATABASE_URL;
  const directory = await mkdtemp(join(tmpdir(), "davinci-video-integration-"));
  const schema = `video_test_${randomUUID().replaceAll("-", "")}`;
  const root = new PrismaClient();
  await root.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);
  url.searchParams.set("schema", schema);
  process.env.DATABASE_URL = url.toString();
  process.env.VIDEO_UPLOAD_DIR = join(directory, "uploads", "videos");
  process.env.AUTH_ENABLED = "true";
  process.env.AUTH_SECRET = "video-test-only-secret-at-least-32-characters";
  process.env.VIDEO_TEST_AUTH = "true";
  try {
    execFileSync(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], { env: process.env, stdio: "pipe" });
    const { default: db } = await import("../src/lib/prisma");
    const { signSession } = await import("../src/lib/auth");
    const route = await import("../src/app/api/admin/video/route");
    const { getActiveVideo, replaceActiveVideo } = await import("../src/lib/services/video.service");
    const { serveVideo } = await import("../src/lib/services/video-delivery");
    const manager = await db.adminUser.create({ data: { username: "video-manager", role: "ADMIN", passwordHash: "unused" } });
    const editor = await db.adminUser.create({ data: { username: "video-editor", role: "EDITOR", permissions: ["GALLERY"], passwordHash: "unused" } });
    const login = (id: string, role: "ADMIN" | "EDITOR") => { globalThis.__videoTestToken = signSession({ uid: id, role }); };
    const mp4 = await readFile("public/video/v.mp4");
    const request = (bytes: Buffer, name = "clinic.mp4", type = "video/mp4", extra: HeadersInit = {}) => new Request("http://localhost/api/admin/video", {
      method: "POST", body: new Uint8Array(bytes), headers: { origin: "http://localhost", "content-type": type, "x-video-name": encodeURIComponent(name), ...extra },
    });
    const files = () => readdir(process.env.VIDEO_UPLOAD_DIR!).catch(() => []);
    await t.test("unauthenticated, editor, disabled and password-setup accounts cannot replace videos", async () => {
      globalThis.__videoTestToken = undefined;
      assert.equal((await route.POST(request(mp4))).status, 401);
      assert.equal((await route.GET()).status, 401);
      login(editor.id, "EDITOR");
      assert.equal((await route.POST(request(mp4))).status, 403);
      assert.equal((await route.GET()).status, 403);
      await db.adminUser.update({ where: { id: manager.id }, data: { isActive: false } });
      login(manager.id, "ADMIN");
      assert.equal((await route.POST(request(mp4))).status, 401);
      await db.adminUser.update({ where: { id: manager.id }, data: { isActive: true, mustChangePassword: true } });
      assert.equal((await route.POST(request(mp4))).status, 403);
      await db.adminUser.update({ where: { id: manager.id }, data: { mustChangePassword: false } });
      assert.equal((await route.POST(request(mp4, "clinic.mp4", "video/mp4", { origin: "https://attacker.example" }))).status, 403);
      assert.equal(await db.videoSetting.count(), 0);
      assert.deepEqual(await files(), []);
    });
    await t.test("fallback remains until an authorized MP4 upload succeeds", async () => {
      assert.equal((await getActiveVideo()).url, "/video/v.mp4");
      const response = await route.POST(request(mp4));
      assert.equal(response.status, 201);
      const active = await response.json();
      assert.ok(active.url.startsWith("/media/videos/"));
      assert.ok(!active.url.includes("clinic"));
      assert.ok(!JSON.stringify(active).includes(directory));
      assert.equal(active.size, mp4.length);
      assert.deepEqual(await (await route.GET()).json(), active);
      const delivered = await serveVideo(new Request("http://localhost", { headers: { range: "bytes=1024-2047" } }), active.url.split("/").pop());
      assert.equal(delivered.status, 206);
      assert.deepEqual(Buffer.from(await delivered.arrayBuffer()), mp4.subarray(1024, 2048));
    });
    await t.test("storage failures return safe actionable responses and preserve the active video", async child => {
      const previous = await getActiveVideo();
      for (const [operation, errno, code, status] of [
        ["mkdir", "EACCES", "storagePermissionDenied", 503],
        ["mkdir", "EROFS", "storageReadOnly", 503],
        ["mkdir", "ENOTDIR", "storageDirectoryFailed", 500],
        ["writeFile", "ENOSPC", "storageError", 500],
      ] as const) {
        await child.test(code, async scenario => {
          const log = scenario.mock.method(console, "error", () => undefined);
          scenario.mock.method(fs, operation, async () => { throw Object.assign(new Error("Sensitive filesystem information /private/server/path"), { code: errno }); });
          const response = await route.POST(request(mp4));
          assert.equal(response.status, status);
          const body = await response.json();
          assert.deepEqual(body, { error: code, message: VIDEO_STORAGE_ERROR_MESSAGES[code] });
          assert.ok(!JSON.stringify(body).includes("/private"));
          assert.ok(!("stack" in body));
          assert.deepEqual(log.mock.calls[0].arguments[1], { operation: operation === "mkdir" ? "createDirectory" : "write", code: errno });
          assert.deepEqual(await getActiveVideo(), previous);
          assert.equal((await files()).length, 1);
        });
      }
    });
    await t.test("oversize, invalid and interrupted uploads preserve previous setting and file", async () => {
      const previous = await getActiveVideo();
      for (const [response, status] of [
        [await route.POST(request(Buffer.alloc(MAX_VIDEO_BYTES + 1))), 413],
        [await route.POST(request(mp4, "file.exe")), 400],
        [await route.POST(request(mp4, "file.webm", "video/webm")), 400],
        [await route.POST(request(Buffer.from("not a video"))), 400],
        [await route.POST(request(mp4, "file.mp4", "video/mp4", { "content-length": String(mp4.length + 1) })), 400],
      ] as const) assert.equal(response.status, status);
      assert.deepEqual(await getActiveVideo(), previous);
      assert.equal((await files()).length, 1);
      await db.$executeRawUnsafe(`ALTER TABLE "VideoSetting" ADD CONSTRAINT "test_failure" CHECK ("originalName" <> 'fail.mp4')`);
      try {
        assert.equal((await route.POST(request(mp4, "fail.mp4"))).status, 500);
        assert.deepEqual(await getActiveVideo(), previous);
        assert.equal((await files()).length, 1, "New file cleaned up after database failure");
      } finally { await db.$executeRawUnsafe(`ALTER TABLE "VideoSetting" DROP CONSTRAINT "test_failure"`); }
    });
    await t.test("WebM replaces MP4 only after commit and the original asset is retained", async () => {
      const previous = await getActiveVideo();
      const webm = process.env.VIDEO_TEST_WEBM ? await readFile(process.env.VIDEO_TEST_WEBM) : webmFixture();
      const response = await route.POST(request(webm, "clinic.webm", "video/webm"));
      assert.equal(response.status, 201);
      const active = await response.json();
      assert.equal(active.url.endsWith(".webm"), true);
      assert.deepEqual(await files(), [active.url.split("/").pop()]);
      assert.equal((await serveVideo(new Request("http://localhost"), previous.url.split("/").pop()!)).status, 404);
      const delivered = await serveVideo(new Request("http://localhost"), active.url.split("/").pop()!);
      assert.equal(delivered.headers.get("content-type"), "video/webm");
      assert.deepEqual(Buffer.from(await delivered.arrayBuffer()), webm);
      assert.deepEqual(await readFile("public/video/v.mp4"), mp4);
    });
    await t.test("concurrent replacements serialize and retain exactly the committed active file", async () => {
      const results = await Promise.all([
        replaceActiveVideo(mp4, "first.mp4", "video/mp4"),
        replaceActiveVideo(mp4, "second.mp4", "video/mp4"),
      ]);
      const active = await getActiveVideo();
      assert.ok(results.some(result => result.url === active.url));
      assert.deepEqual(await files(), [active.url.split("/").pop()]);
      assert.equal(await db.videoSetting.count(), 1);
    });
    if (process.env.VIDEO_TEST_BUILD === "true") {
      await t.test("production build renders both locales with the saved video URL", async () => {
        execFileSync("pnpm", ["run", "build"], { env: process.env, stdio: "inherit", timeout: 180000 });
        const active = await getActiveVideo();
        for (const locale of ["en", "ar"]) {
          const html = await readFile(`.next/server/app/${locale}.html`, "utf8");
          assert.ok(html.includes(active.url), `${locale} homepage includes the saved video`);
        }
      });
    }
    await db.$disconnect();
  } finally {
    await root.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await root.$disconnect();
    process.env.DATABASE_URL = originalUrl;
    delete process.env.VIDEO_TEST_AUTH;
    await rm(directory, { recursive: true, force: true });
  }
});
