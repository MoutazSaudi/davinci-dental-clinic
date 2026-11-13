# Video upload storage

The repository documents a Node.js VPS deployment (`pnpm build` / `pnpm start`).
`docker-compose.yml` currently runs **only PostgreSQL**; its database volume does
not persist application uploads. No application host or persistent video mount
is configured in this repository. There is no application Dockerfile, GitHub
deployment workflow or hosting-provider manifest identifying the actual production
environment. The documented VPS can use persistent local storage, but this
repository cannot verify the production server's mounts, permissions or release
cleanup policy. Persistence must be provisioned at deployment.

## Production setup (required)

1. Run `pnpm db:deploy` to apply `20261113120000_video_setting`, then generate the
   Prisma client (`pnpm prisma:generate`) before building the application.
2. Set `VIDEO_UPLOAD_DIR=uploads/videos` in the application's runtime environment,
   as required by the production server owner. Relative values are resolved
   against the actual Next.js project working directory (`process.cwd()`).
   Absolute values are also supported and preserved. The Node.js user must
   have read/write/traverse permission. The application automatically creates all
   missing directories recursively at the start of an authorized upload, and
   checks again before writing the file. Manual directory creation is unnecessary
   if the nearest existing parent is writable. Suggested directory permissions: `0750`.
3. Preserve the project's `uploads/videos` directory and its filesystem across
   restarts, rollbacks and releases. The deployment must retain it when updating
   or replacing the application checkout; the relative path alone does not
   provide persistence.
   Back up this directory together with PostgreSQL: the database stores relative
   `uploads/videos/<uuid>.<extension>` paths and metadata, not the file bytes.
4. For a containerized application, mount a named persistent volume or host bind
   mount at the container's actual project working directory plus `/uploads/videos`.
   Keep `VIDEO_UPLOAD_DIR=uploads/videos`. The application service is not currently
   defined in the project's Compose file, so its container working directory
   and mount target must be supplied by the deployment configuration. Never remove
   the upload volume during deployments (`docker compose down -v` destroys volumes).
   Multiple app replicas must share the same durable filesystem and database.
5. With Nginx or another reverse proxy, permit at least 20 MiB request bodies
   (`client_max_body_size 21m;` allows the full application limit). Preserve the
   original Host including its port (`proxy_set_header Host $http_host;`) so
   the upload Origin matches it, even when TLS terminates at the proxy. Forward Range, If-Range and If-None-Match
   headers to Next.js. Allow sufficient upload timeouts for slow connections.

Production uploads fail with `storageNotConfigured` unless `VIDEO_UPLOAD_DIR`
is configured. Relative paths are converted to absolute paths with
`resolve(process.cwd(), directory)`; absolute paths are preserved. A null byte
in the value returns `storageInvalidPath`. Directory creation, writes, cleanup
and delivery all use this same resolved filesystem directory. Public URLs are
generated independently as `/media/videos/<uuid>.<extension>` and never include
the absolute server path.
Setting a path does not itself make the disk
persistent: the operator must provision the mount described above. Known
serverless runtimes (Vercel, Netlify and AWS Lambda) are rejected because their
local filesystems do not satisfy this storage contract. Do not deploy this
feature to an ephemeral/read-only host without a supported persistent volume.
No cloud storage provider is used.

## Troubleshooting without a production terminal

The previous `storageUnavailable` code combined missing configuration, relative
paths and unsupported serverless runtimes. It was thrown **before** directory
creation, so that error alone did not identify a filesystem permission problem.
The upload API now returns a safe English `message` alongside the specific
`error` code; the dashboard displays the corresponding Arabic/English message.

| Error | Meaning / server-owner action |
| --- | --- |
| `storageNotConfigured` | Set `VIDEO_UPLOAD_DIR` in the **running application's** environment. |
| `storageInvalidPath` | Remove invalid path characters (null bytes). Relative and absolute paths are accepted. |
| `storageUnavailable` | A known unsupported serverless runtime was detected; persistent filesystem hosting is required. |
| `storageDirectoryFailed` | Recursive directory creation failed; check that every existing path component is a directory and the configured location is valid. |
| `storagePermissionDenied` | The operation failed with `EACCES`/`EPERM`; grant the Node.js process access to the target/parent directory. |
| `storageReadOnly` | The operation failed with `EROFS`; provide a writable persistent mount. |
| `storageError` | Another file operation failed; check available disk space and server logs. |

Server logs include `[video-storage]`, the operation and actual filesystem errno
(e.g. `ENOSPC`), or a specific configuration diagnostic. Native error messages,
absolute paths and stack traces are never included in upload error responses.

Changing `.env.example` or your local Git-ignored `.env` does not configure a
GitHub deployment's runtime. If the deployment platform exposes environment
settings, the required path can be set there without a terminal. Otherwise your
friend must configure the application's environment/deployment once and confirm
that the target storage survives releases. The app cannot grant itself missing
filesystem permissions, make a read-only disk writable, or make an ephemeral
filesystem persistent. It does not fall back to `/tmp`; the production directory
must be explicitly configured and preserved by deployment. Do not change an existing storage path
without preserving/moving its managed files to the new location.

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
