"use client";

import React, { useEffect, useState } from "react";
import { DoctorAdmin, DoctorDraft, emptyDoctorDraft } from "./types";
import ImageUploader from "@/components/admin/ImageUploader";
import { useAdminT } from "@/app/hooks/useAdminT";

interface DoctorFormProps {
  open: boolean;
  editing: DoctorAdmin | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

export default function DoctorForm({
  open,
  editing,
  onClose,
  onSaved,
}: DoctorFormProps) {
  const [draft, setDraft] = useState<DoctorDraft>(emptyDoctorDraft);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { t, isRtl } = useAdminT();

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setDraft({
        slug: editing.slug,
        name: { ...editing.name },
        specialization: { ...editing.specialization },
        bio: { ...editing.bio },
        image: editing.image,
        instagram: editing.instagram,
        linkedin: editing.linkedin,
        sortOrder: editing.sortOrder,
        status: editing.status,
      });
    } else {
      setDraft(emptyDoctorDraft);
    }
    setError(null);
  }, [open, editing]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    if (!draft.slug.trim()) return setError(t.doctors.errorSlug);
    if (!draft.name.en.trim() || !draft.name.ar.trim())
      return setError(t.doctors.errorNames);

    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/doctors?id=${encodeURIComponent(editing.id)}`
        : "/api/admin/doctors";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!res.ok) {
        setError(t.doctors.errorSaveFailed);
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
              {editing ? t.doctors.formTitleEdit : t.doctors.formTitleNew}
            </h3>
            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
              {editing ? t.doctors.formDescEdit : t.doctors.formDescNew}
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
          id="doctor-form"
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto"
        >
          <Section
            title={t.doctors.sectionBasic}
            description={t.doctors.sectionBasicDesc}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label={t.common.slug} hint={t.doctors.slugHint}>
                <input
                  className="w-full p-2 border rounded text-sm font-mono"
                  value={draft.slug}
                  onChange={(e) =>
                    setDraft({ ...draft, slug: e.target.value })
                  }
                  placeholder="dr-mouhannad-saudi"
                />
              </Field>
              <Field label={t.common.sortOrder} hint={t.doctors.sortOrderHint}>
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
                      status: e.target.value as DoctorAdmin["status"],
                    })
                  }
                >
                  <option value="PUBLISHED">{t.status.PUBLISHED}</option>
                  <option value="DRAFT">{t.status.DRAFT}</option>
                  <option value="ARCHIVED">{t.status.ARCHIVED}</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section
            title={t.doctors.sectionBilingual}
            description={t.doctors.sectionBilingualDesc}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={t.doctors.nameEn}>
                  <input
                    className="w-full p-2 border rounded text-sm"
                    value={draft.name.en}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        name: { ...draft.name, en: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label={t.doctors.nameAr}>
                  <input
                    className="w-full p-2 border rounded text-sm"
                    dir="rtl"
                    value={draft.name.ar}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        name: { ...draft.name, ar: e.target.value },
                      })
                    }
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={t.doctors.specializationEn}>
                  <input
                    className="w-full p-2 border rounded text-sm"
                    value={draft.specialization.en}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        specialization: {
                          ...draft.specialization,
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label={t.doctors.specializationAr}>
                  <input
                    className="w-full p-2 border rounded text-sm"
                    dir="rtl"
                    value={draft.specialization.ar}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        specialization: {
                          ...draft.specialization,
                          ar: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={t.doctors.bioEn}>
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    rows={4}
                    value={draft.bio.en}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        bio: { ...draft.bio, en: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label={t.doctors.bioAr}>
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    dir="rtl"
                    rows={4}
                    value={draft.bio.ar}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        bio: { ...draft.bio, ar: e.target.value },
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          </Section>

          <Section
            title={t.doctors.sectionLinks}
            description={t.doctors.sectionLinksDesc}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label={t.doctors.instagramUrl}>
                <input
                  className="w-full p-2 border rounded text-sm"
                  value={draft.instagram ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, instagram: e.target.value || null })
                  }
                  placeholder="https://instagram.com/..."
                />
              </Field>
              <Field label={t.doctors.linkedinUrl}>
                <input
                  className="w-full p-2 border rounded text-sm"
                  value={draft.linkedin ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, linkedin: e.target.value || null })
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>
            </div>
          </Section>

          <Section
            title={t.doctors.sectionPhoto}
            description={t.doctors.sectionPhotoDesc}
          >
            <ImageUploader
              images={draft.image ? [draft.image] : []}
              onChange={(imgs) =>
                setDraft({ ...draft, image: imgs[0] ?? null })
              }
              maxImages={1}
              maxSizeMB={3}
            />
          </Section>

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
            form="doctor-form"
            disabled={saving}
            className="py-2 px-4 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving
              ? t.common.saving
              : editing
              ? t.doctors.submitEdit
              : t.doctors.submitNew}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
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