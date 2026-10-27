"use client";

import React, { useRef, useState } from "react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 50,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");

  async function uploadFiles(files: File[]) {
    setError(null);

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      setError("Only image files are allowed.");
      return;
    }

    const tooBig = imageFiles.filter((f) => f.size > maxSizeMB * 1024 * 1024);
    const valid = imageFiles.filter((f) => f.size <= maxSizeMB * 1024 * 1024);
    if (tooBig.length > 0) {
      setError(`${tooBig.length} file(s) exceed ${maxSizeMB}MB and were skipped.`);
    }
    if (valid.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setError(`Maximum of ${maxImages} images reached.`);
      return;
    }

    const toUpload = valid.slice(0, remaining);
    if (valid.length > remaining) {
      setError((prev) =>
        prev
          ? `${prev} Only ${remaining} more image(s) allowed.`
          : `Only ${remaining} more image(s) allowed.`
      );
    }

    setUploading(true);
    setProgress({ done: 0, total: toUpload.length });

    const uploadedUrls: string[] = [];
    for (let i = 0; i < toUpload.length; i++) {
      try {
        const fd = new FormData();
        fd.append("file", toUpload[i]);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error(`Upload failed for ${toUpload[i].name}`);
        const data = await res.json();
        if (data?.url) uploadedUrls.push(data.url);
      } catch (e) {
        setError((prev) => `${prev ? prev + " " : ""}${(e as Error).message}`);
      }
      setProgress({ done: i + 1, total: toUpload.length });
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    }
    setUploading(false);
    setProgress({ done: 0, total: 0 });
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (uploading) return;
    void uploadFiles(Array.from(e.dataTransfer.files));
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (uploading) return;
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length > 0) void uploadFiles(files);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    if (images.length >= maxImages) {
      setError(`Maximum of ${maxImages} images reached.`);
      return;
    }
    onChange([...images, url]);
    setUrlInput("");
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!uploading) fileInputRef.current?.click();
          }
        }}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        } ${uploading ? "opacity-60 cursor-wait" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          {uploading ? (
            <div className="text-sm font-medium text-gray-700">
              Uploading {progress.done}/{progress.total}…
            </div>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-700">
                {isDragging ? "Drop images here" : "Drag & drop images here"}
              </div>
              <div className="text-xs text-gray-500">
                or click to browse • PNG, JPG, WebP • max {maxSizeMB}MB each
              </div>
            </>
          )}
        </div>

        {uploading && progress.total > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-600">
              Images ({images.length})
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {images.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="relative group rounded-md overflow-hidden border bg-gray-50"
                style={{ borderColor: "var(--color-border)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Image ${i + 1}`}
                  className="w-full aspect-[3/4] object-cover"
                />
                <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove image ${i + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add by URL fallback */}
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-1">
          Or add image by URL
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded text-sm font-mono"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="/images/gallary/g01.webp"
          />
          <button
            type="button"
            onClick={addUrl}
            className="py-2 px-3 border rounded text-sm font-medium hover:bg-gray-50"
            style={{ borderColor: "var(--color-border)" }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}