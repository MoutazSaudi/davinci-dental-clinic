"use client";

import { useEffect, useRef, useState } from "react";
import { useAdminT } from "@/app/hooks/useAdminT";
import { MAX_VIDEO_BYTES, videoMetadataError } from "@/lib/validations/video";
import type { ActiveVideo } from "@/types/video";

type ErrorCode = keyof ReturnType<typeof useAdminT>["t"]["video"]["errors"];
const card = "min-w-0 space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6";
const button = "rounded-lg px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";

export default function VideoManagement({ initialActive }: { initialActive: ActiveVideo | null }) {
  const { t, locale, dir } = useAdminT();
  const copy = t.video;
  const [active, setActive] = useState<ActiveVideo | null>(initialActive);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<ErrorCode | null>(initialActive ? null : "uploadFailed");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const xhr = useRef<XMLHttpRequest | null>(null);

  async function loadActive() {
    try {
      const response = await fetch("/api/admin/video", { cache: "no-store" });
      if (!response.ok) {
        setLoadError(response.status === 401 ? "unauthorized" : response.status === 403 ? "forbidden" : "uploadFailed");
        return;
      }
      setActive(await response.json());
    } catch {
      setLoadError("network");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    return () => { xhr.current?.abort(); if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); };
  }, []);

  function clearPreview() {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = null;
    setPreview(null);
  }

  function selectFile(selected: File | undefined) {
    setFile(null);
    clearPreview();
    setError(null);
    setSuccess(false);
    setPreviewError(false);
    setProgress(0);
    if (!selected) return;
    const invalid = videoMetadataError(selected.name, selected.type, selected.size);
    if (invalid) {
      setError(invalid);
      if (input.current) input.current.value = "";
      return;
    }
    setFile(selected);
    previewUrl.current = URL.createObjectURL(selected);
    setPreview(previewUrl.current);
  }

  function upload() {
    if (!file || uploading || !active) return;
    if (!window.confirm(copy.replaceConfirm)) return;
    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);
    const request = new XMLHttpRequest();
    xhr.current = request;
    request.open("POST", "/api/admin/video");
    request.setRequestHeader("Content-Type", file.type);
    request.setRequestHeader("X-Video-Name", encodeURIComponent(file.name));
    request.upload.onprogress = event => {
      if (event.lengthComputable) setProgress(Math.round(event.loaded / event.total * 100));
    };
    request.onload = () => {
      try {
        const body = JSON.parse(request.responseText);
        if (request.status === 201) {
          setActive(body);
          setFile(null);
          clearPreview();
          if (input.current) input.current.value = "";
          setSuccess(true);
        } else {
          setError(typeof body.error === "string" && Object.hasOwn(copy.errors, body.error) ? body.error as ErrorCode : "uploadFailed");
        }
      } catch { setError("uploadFailed"); }
    };
    request.onerror = () => setError("network");
    request.onabort = () => setError("network");
    request.onloadend = () => { setUploading(false); xhr.current = null; };
    request.send(file);
  }

  function sizeLabel(bytes: number) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB (${new Intl.NumberFormat(locale).format(bytes)} ${copy.bytes})`;
  }

  return (
    <div className="space-y-6 pt-12 md:pt-0" dir={dir}>
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-primary)]">{copy.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">{copy.description}</p>
      </header>
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <section className={card} aria-labelledby="active-video-title">
          <h2 id="active-video-title" className="text-lg font-semibold">{copy.current}</h2>
          {loading && <p role="status">{copy.loading}</p>}
          {loadError && <p role="alert" className="text-[var(--color-error)]">{copy.errors[loadError]}</p>}
          {active && <>
            <video key={active.url} src={active.url} controls playsInline preload="metadata" aria-label={copy.current} className="aspect-video w-full rounded-lg bg-black" />
            {active.managed ? <div className="space-y-1 text-sm">
              <p className="break-all" dir="auto">{active.originalName}</p>
              {active.size !== null && <p>{sizeLabel(active.size)}</p>}
              {active.updatedAt && <p><time dateTime={active.updatedAt}>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(active.updatedAt))}</time></p>}
            </div> : <p className="text-sm text-[var(--color-foreground-muted)]">{copy.fallback}</p>}
          </>}
          {!loading && <button type="button" onClick={() => { setLoading(true); setLoadError(null); void loadActive(); }} disabled={uploading} className={button} style={{ backgroundColor: "var(--color-primary)" }}>{loadError ? copy.retry : copy.refresh}</button>}
        </section>
        <section className={card} aria-labelledby="select-video-title" aria-busy={uploading}>
          <h2 id="select-video-title" className="text-lg font-semibold">{copy.select}</h2>
          <label htmlFor="showcase-video" className="block text-sm font-medium">{copy.select}</label>
          <input ref={input} id="showcase-video" type="file" accept="video/mp4,video/webm" disabled={uploading}
            aria-describedby="video-file-hint" onChange={event => selectFile(event.target.files?.[0])}
            className="block w-full min-w-0 rounded-lg border border-[var(--color-border)] p-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]" />
          <p id="video-file-hint" className="text-sm text-[var(--color-foreground-muted)]">{copy.hint}</p>
          {file && <>
            <p className="break-all text-sm" dir="auto">{file.name}</p>
            <p className="text-sm">{sizeLabel(file.size)}</p>
            {preview && <video key={preview} src={preview} controls playsInline preload="metadata" aria-label={copy.preview} onError={() => setPreviewError(true)} className="aspect-video w-full rounded-lg bg-black" />}
          </>}
          {previewError && <p role="alert">{copy.errors.playback}</p>}
          <button type="button" onClick={upload} disabled={!file || file.size > MAX_VIDEO_BYTES || uploading || loading || !active || !!loadError}
            className={button} style={{ backgroundColor: "var(--color-primary)" }}>{uploading ? progress < 100 ? copy.uploading : copy.saving : copy.save}</button>
          {uploading && <div role="status" className="space-y-2 text-sm">
            <label htmlFor="video-upload-progress">{progress < 100 ? `${copy.uploading} ${progress}%` : copy.saving}</label>
            <progress id="video-upload-progress" value={progress} max={100} className="block w-full accent-[var(--color-primary)]" />
          </div>}
          {error && <p role="alert" className="text-[var(--color-error)]">{copy.errors[error]}</p>}
          {success && <p role="status" className="text-[var(--color-primary)]">{copy.success}</p>}
        </section>
      </div>
    </div>
  );
}
