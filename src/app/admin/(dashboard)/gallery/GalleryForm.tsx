"use client";

import React, { useEffect, useState } from "react";
import { GalleryAlbum, GalleryDraft, emptyDraft } from "./types";
import ImageUploader from "@/components/admin/ImageUploader";
import { useAdminT } from "@/app/hooks/useAdminT";

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
  const { t, isRtl } = useAdminT();

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

    if (!draft.slug.trim()) return setError(t.gallery.errorSlug);
    if (!draft.title.en.trim() || !draft.title.ar.trim())
      return setError(t.gallery.errorTitles);
    if (!draft.category.en.trim() || !draft.category.ar.trim())
      return setError(t.gallery.errorCategories);
    if (draft.images.length === 0) return setError(t.gallery.errorImages);

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
        setError(t.gallery.errorSaveFailed);
        return;
      }

      await onSaved();
    } catch {
      setError(t.common.networkError);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-[var(--color-surface)] rounded-xl max-w-3xl w-full my-8 shadow-xl relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">
              {editing ? t.gallery.formTitleEdit : t.gallery.formTitleNew}
            </h3>
            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
              {editing ? t.gallery.formDescEdit : t.gallery.formDescNew}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] text-xl font-bold"
            aria-label={t.common.close}
            type="button"
          >
            ✕
          </button>
        </div>

        <form
          id="gallery-form"
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto"
        >
          <FormSection
            title={t.gallery.sectionBasic}
            description={t.gallery.sectionBasicDesc}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label={t.common.slug} hint={t.gallery.slugHint}>
                <input
                  className="w-full p-2 border rounded text-sm font-mono"
                  value={draft.slug}
                  onChange={(e) =>
                    setDraft({ ...draft, slug: e.target.value })
                  }
                  placeholder="orthodontics"
                />
              </Field>
              <Field label={t.common.sortOrder} hint={t.gallery.sortOrderHint}>
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
              <Field label={t.common.status}>
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
                  <option value="PUBLISHED">{t.status.PUBLISHED}</option>
                  <option value="DRAFT">{t.status.DRAFT}</option>
                  <option value="ARCHIVED">{t.status.ARCHIVED}</option>
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection
            title={t.gallery.sectionBilingual}
            description={t.gallery.sectionBilingualDesc}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={t.gallery.titleEn}>
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
                <Field label={t.gallery.titleAr}>
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
                <Field label={t.gallery.categoryEn}>
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
                <Field label={t.gallery.categoryAr}>
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
                <Field label={t.gallery.descriptionEn}>
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
                <Field label={t.gallery.descriptionAr}>
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

          <FormSection
            title={t.gallery.sectionImages}
            description={t.gallery.sectionImagesDesc}
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
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/50"
              role="alert"
            >
              {error}
            </div>
          )}
        </form>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-background-soft)] rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border rounded-lg text-sm font-medium bg-[var(--color-surface)]"
            style={{ borderColor: "var(--color-border)" }}
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            form="gallery-form"
            disabled={saving}
            className="py-2 px-4 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving
              ? t.common.saving
              : editing
              ? t.gallery.submitEdit
              : t.gallery.submitNew}
          </button>
        </div>
      </div>
    </div>
  );
}

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
        <h4 className="text-sm font-semibold text-[var(--color-foreground)]">
          {title}
        </h4>
        <p className="text-xs text-[var(--color-foreground-muted)]">
          {description}
        </p>
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
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-foreground-muted)]">
          {label}
        </span>
        {hint && (
          <span className="text-[10px] text-[var(--color-foreground-light)]">
            {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}