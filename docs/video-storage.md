# Video upload storage

The repository documents a Node.js VPS deployment (`pnpm build` / `pnpm start`).
`docker-compose.yml` currently runs **only PostgreSQL**; its database volume does
not persist application uploads. No application host or persistent video mount
is configured in this repository. Persistence must be provisioned at deployment.

## Production setup (required)

1. Run `pnpm db:deploy` to apply `20261113120000_video_setting`, then generate the
   Prisma client (`pnpm prisma:generate`) before building the application.
2. Provision persistent server storage outside the code/release directory, e.g.
   `/var/lib/davinci/uploads/videos`. Set `VIDEO_UPLOAD_DIR` to that absolute path
   in the application's runtime environment. The Node.js user must own it and
   have read/write/traverse permission. The application creates the directory
   if its parent is writable. Suggested directory permissions: `0750`.
3. Keep this path and its filesystem across restarts, rollbacks and releases.
   Back up this directory together with PostgreSQL: the database stores relative
   `uploads/videos/<uuid>.<extension>` paths and metadata, not the file bytes.
4. For a containerized application, mount a named persistent volume or host bind
   mount at `/var/lib/davinci/uploads/videos`, and set `VIDEO_UPLOAD_DIR` to that
   same container path. Example addition to the **application** service (which
   is not currently defined in the project's Compose file):

   ```yaml
   environment:
     VIDEO_UPLOAD_DIR: /var/lib/davinci/uploads/videos
   volumes:
     - clinic_videos:/var/lib/davinci/uploads/videos
   ```

   Declare `clinic_videos:` under the top-level `volumes:` mapping. Never remove
   that volume during deployments (`docker compose down -v` destroys volumes).
   Multiple app replicas must share the same durable filesystem and database.
5. With Nginx or another reverse proxy, permit at least 20 MiB request bodies
   (`client_max_body_size 21m;` allows the full application limit). Preserve the
   original Host including its port (`proxy_set_header Host $http_host;`) so
   the upload Origin matches it, even when TLS terminates at the proxy. Forward Range, If-Range and If-None-Match
   headers to Next.js. Allow sufficient upload timeouts for slow connections.

Production uploads fail with `storageUnavailable` unless an absolute
`VIDEO_UPLOAD_DIR` is configured. Setting a path does not itself make the disk
persistent: the operator must provision the mount described above. Known
serverless runtimes (Vercel, Netlify and AWS Lambda) are rejected because their
local filesystems do not satisfy this storage contract. Do not deploy this
feature to an ephemeral/read-only host without a supported persistent volume.
No cloud storage provider is used.

## Behavior

- Development defaults to `<project>/uploads/videos/` (Git ignored); the env
  override is useful for isolated tests and persistent VPS/container mounts.
- `/admin/videos` and `/api/admin/video` require the existing ADMIN role. POST
  additionally checks same-origin requests and completed password setup.
- The POST body is the raw file, with its exact MIME type in `Content-Type` and
  URI-encoded display name in `X-Video-Name`. Both announced and actual streamed
  length are limited to 20 × 1024 × 1024 bytes. MP4/WebM extension, MIME and
  container/video-track structure must agree. This is structural validation,
  not a full codec decode or transcoding service; browser codec support varies.
- A UUID filename is saved exclusively before a serialized database transaction
  replaces the singleton setting. Failed writes/transactions clean up the new
  file and preserve the old setting. Previous managed files are removed only
  after commit. Cleanup failures retain the old file and log a generic message;
  uploads are not reported as failed after commit. A hard process crash between
  file creation and database commit can leave an unreferenced file; inspect
  database references before manually cleaning such files.
- The original `/video/v.mp4` asset is never deleted and remains the fallback
  when there is no uploaded setting. Both homepages are revalidated after save.
  Existing open pages need a reload/navigation to display the replacement.
- `/media/videos/<uuid>.mp4|webm` serves bounded chunks from Node.js with GET,
  HEAD, correct MIME types, byte ranges (206/416), ETag and If-Range support.
  It validates filenames and refuses symbolic links. It never returns absolute
  storage paths. Uploaded videos are intentionally public.

## Verification

`pnpm test:videos` checks file validation, streamed limits, range delivery and
symbolic-link/path rejection using isolated temporary storage.
`pnpm test:videos:integration` requires a
local PostgreSQL database and applies migrations to an isolated disposable
schema. It checks real transactions, concurrency, authorization and MP4 uploads
using the existing clinic video and a small locally recorded WebM fixture.
Tests never replace the live active setting. Set `VIDEO_TEST_BUILD=true` when
running the integration suite to also build against its isolated schema and
assert both generated homepages contain the saved video URL.
