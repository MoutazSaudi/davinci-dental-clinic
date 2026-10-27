"use client";

import React, { useEffect, useState } from "react";
import { GalleryAlbum, GalleryDraft, emptyDraft } from "./types";
import ImageUploader from "@/components/admin/ImageUploader";

interface GalleryFormProps {
  open: boolean;
  editing: GalleryAlbum | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

export default function GalleryForm({
  open,
  editing,
  onClose,
  onSaved,
}: GalleryFormProps) {
  const [draft, setDraft] = useState<GalleryDraft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setDraft({
        slug: editing.slug,
        title: { ...editing.title },
        category: { ...editing.category },
        description: { ...editing.description },
        images: [...editing.images],
        sortOrder: editing.sortOrder,
        status: editing.status,
      });
    } else {
      setDraft(emptyDraft);
    }
    setError(null);
  }, [open, editing]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    if (!draft.slug.trim()) return setError("Slug is required.");
    if (!draft.title.en.trim() || !draft.title.ar.trim())
      return setError("Both English and Arabic titles are required.");
    if (!draft.category.en.trim() || !draft.category.ar.trim())
      return setError("Both English and Arabic categories are required.");
    if (draft.images.length === 0)
      return setError("Add at least one image.");

    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/gallery?id=${encodeURIComponent(editing.id)}`
        : "/api/admin/gallery";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(
          typeof data?.error === "string" ? data.error : "Failed to save album."
        );
        return;
      }

      await onSaved();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full my-8 shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold">
              {editing ? "Edit Album" : "New Album"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {editing
                ? "Update album details and images."
                : "Create a new album with bilingual content."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form
          id="gallery-form"
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto"
        >
          {/* Section: Basics */}
          <FormSection
            title="Basic Information"
            description="Identifiers and visibility"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Slug" hint="URL-safe identifier">
                <input
                  className="w-full p-2 border rounded text-sm font-mono"
                  value={draft.slug}
                  onChange={(e) =>
                    setDraft({ ...draft, slug: e.target.value })
                  }
                  placeholder="orthodontics"
                />
              </Field>
              <Field label="Sort order" hint="Lower = first">
                <input
                  type="number"
                  className="w-full p-2 border rounded text-sm"
                  value={draft.sortOrder}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sortOrder: Number(e.target.value) || 0,
                    })
                  }
                />
              </Field>
              <Field label="Status">
                <select
                  className="w-full p-2 border rounded text-sm"
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      status: e.target.value as GalleryAlbum["status"],
                    })
                  }
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </Field>
            </div>
          </FormSection>

          {/* Section: Bilingual content */}
          <FormSection
            title="Bilingual Content"
            description="Titles, categories, and descriptions"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Title (EN)">
                  <input
                    className="w-full p-2 border rounded text-sm"
                    value={draft.title.en}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        title: { ...draft.title, en: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="Title (AR)">
                  <input
                    className="w-full p-2 border rounded text-sm"
                    dir="rtl"
                    value={draft.title.ar}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        title: { ...draft.title, ar: e.target.value },
                      })
                    }
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Category (EN)">
                  <input
                    className="w-full p-2 border rounded text-sm"
                    value={draft.category.en}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        category: { ...draft.category, en: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="Category (AR)">
                  <input
                    className="w-full p-2 border rounded text-sm"
                    dir="rtl"
                    value={draft.category.ar}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        category: { ...draft.category, ar: e.target.value },
                      })
                    }
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Description (EN)">
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    rows={3}
                    value={draft.description.en}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        description: {
                          ...draft.description,
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Description (AR)">
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    dir="rtl"
                    rows={3}
                    value={draft.description.ar}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        description: {
                          ...draft.description,
                          ar: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          </FormSection>

          {/* Section: Images */}
          <FormSection
            title="Images"
            description="Drag & drop to upload, or add by URL. Order defines display order."
          >
            <ImageUploader
              images={draft.images}
              onChange={(imgs) => setDraft({ ...draft, images: imgs })}
              maxImages={50}
              maxSizeMB={5}
            />
          </FormSection>

          {error && (
            <div
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
              role="alert"
            >
              {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border rounded-lg text-sm font-medium bg-white"
            style={{ borderColor: "var(--color-border)" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="gallery-form"
            disabled={saving}
            className="py-2 px-4 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Create album"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-600">
          {label}
        </span>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </label>
  );
}