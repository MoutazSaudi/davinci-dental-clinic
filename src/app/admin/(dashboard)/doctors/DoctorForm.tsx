"use client";

import React, { useEffect, useState } from "react";
import { DoctorAdmin, DoctorDraft, emptyDoctorDraft } from "./types";
import ImageUploader from "@/components/admin/ImageUploader";

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

    if (!draft.slug.trim()) return setError("Slug is required.");
    if (!draft.name.en.trim() || !draft.name.ar.trim())
      return setError("Both English and Arabic names are required.");

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
        const data = await res.json().catch(() => null);
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to save doctor."
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
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold">
              {editing ? "Edit Doctor" : "New Doctor"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {editing
                ? "Update doctor details."
                : "Add a new doctor to the team."}
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

        <form
          id="doctor-form"
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto"
        >
          {/* Basic */}
          <Section title="Basic Information" description="Identifiers and visibility">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Slug" hint="URL-safe">
                <input
                  className="w-full p-2 border rounded text-sm font-mono"
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  placeholder="dr-mouhannad-saudi"
                />
              </Field>
              <Field label="Sort order" hint="Lower = first">
                <input
                  type="number"
                  className="w-full p-2 border rounded text-sm"
                  value={draft.sortOrder}
                  onChange={(e) =>
                    setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })
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
                      status: e.target.value as DoctorAdmin["status"],
                    })
                  }
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </Field>
            </div>
          </Section>

          {/* Bilingual */}
          <Section title="Bilingual Content" description="Names, specialties, bios">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Name (EN)">
                  <input
                    className="w-full p-2 border rounded text-sm"
                    value={draft.name.en}
                    onChange={(e) =>
                      setDraft({ ...draft, name: { ...draft.name, en: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Name (AR)">
                  <input
                    className="w-full p-2 border rounded text-sm"
                    dir="rtl"
                    value={draft.name.ar}
                    onChange={(e) =>
                      setDraft({ ...draft, name: { ...draft.name, ar: e.target.value } })
                    }
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Specialization (EN)">
                  <input
                    className="w-full p-2 border rounded text-sm"
                    value={draft.specialization.en}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        specialization: { ...draft.specialization, en: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="Specialization (AR)">
                  <input
                    className="w-full p-2 border rounded text-sm"
                    dir="rtl"
                    value={draft.specialization.ar}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        specialization: { ...draft.specialization, ar: e.target.value },
                      })
                    }
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Bio (EN)">
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    rows={4}
                    value={draft.bio.en}
                    onChange={(e) =>
                      setDraft({ ...draft, bio: { ...draft.bio, en: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Bio (AR)">
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    dir="rtl"
                    rows={4}
                    value={draft.bio.ar}
                    onChange={(e) =>
                      setDraft({ ...draft, bio: { ...draft.bio, ar: e.target.value } })
                    }
                  />
                </Field>
              </div>
            </div>
          </Section>

          {/* Social */}
          <Section title="Links" description="Optional social and website links">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Instagram URL">
                <input
                  className="w-full p-2 border rounded text-sm"
                  value={draft.instagram ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, instagram: e.target.value || null })
                  }
                  placeholder="https://instagram.com/..."
                />
              </Field>
              <Field label="LinkedIn URL">
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

          {/* Image */}
          <Section title="Photo" description="Doctor profile image (portrait recommended)">
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
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
              role="alert"
            >
              {error}
            </div>
          )}
        </form>

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
            form="doctor-form"
            disabled={saving}
            className="py-2 px-4 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Add doctor"}
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