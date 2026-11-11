"use client";

import React, { useEffect, useState } from "react";
import type { BilingualFAQItem } from "@/data/mock/faq";
import { useAdminT } from "@/app/hooks/useAdminT";

type FAQListItem = BilingualFAQItem & { id?: string };

interface FAQFormProps {
  open: boolean;
  editing: FAQListItem | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

export default function FAQForm({
  open,
  editing,
  onClose,
  onSaved,
}: FAQFormProps) {
  const [question, setQuestion] = useState({ en: "", ar: "" });
  const [answer, setAnswer] = useState({ en: "", ar: "" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { t, isRtl } = useAdminT();

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setQuestion({ ...editing.question });
      setAnswer({ ...editing.answer });
    } else {
      setQuestion({ en: "", ar: "" });
      setAnswer({ en: "", ar: "" });
    }
    setError(null);
  }, [open, editing]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    if (!question.en.trim() || !question.ar.trim())
      return setError(t.faq.errorQuestionRequired);
    if (!answer.en.trim() || !answer.ar.trim())
      return setError(t.faq.errorAnswerRequired);

    setSaving(true);
    try {
      const url = editing?.id
        ? `/api/admin/faq?id=${encodeURIComponent(editing.id)}`
        : "/api/admin/faq";
      const method = editing?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      if (!res.ok) {
        setError(t.faq.errorSaveFailed);
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
              {editing ? t.faq.formTitleEdit : t.faq.formTitleNew}
            </h3>
            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
              {editing ? t.faq.formDescEdit : t.faq.formDescNew}
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
          id="faq-form"
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto"
        >
          <Section
            title={t.faq.sectionQuestion}
            description={t.faq.sectionQuestionDesc}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label={t.faq.questionEn}>
                <input
                  className="w-full p-2 border rounded text-sm"
                  value={question.en}
                  onChange={(e) =>
                    setQuestion({ ...question, en: e.target.value })
                  }
                  placeholder={t.faq.placeholderQuestionEn}
                />
              </Field>
              <Field label={t.faq.questionAr}>
                <input
                  className="w-full p-2 border rounded text-sm"
                  dir="rtl"
                  value={question.ar}
                  onChange={(e) =>
                    setQuestion({ ...question, ar: e.target.value })
                  }
                />
              </Field>
            </div>
          </Section>

          <Section
            title={t.faq.sectionAnswer}
            description={t.faq.sectionAnswerDesc}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label={t.faq.answerEn}>
                <textarea
                  className="w-full p-2 border rounded text-sm"
                  rows={5}
                  value={answer.en}
                  onChange={(e) =>
                    setAnswer({ ...answer, en: e.target.value })
                  }
                />
              </Field>
              <Field label={t.faq.answerAr}>
                <textarea
                  className="w-full p-2 border rounded text-sm"
                  dir="rtl"
                  rows={5}
                  value={answer.ar}
                  onChange={(e) =>
                    setAnswer({ ...answer, ar: e.target.value })
                  }
                />
              </Field>
            </div>
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
            form="faq-form"
            disabled={saving}
            className="py-2 px-4 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving
              ? t.common.saving
              : editing
              ? t.faq.submitEdit
              : t.faq.submitNew}
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
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wide text-[var(--color-foreground-muted)] mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}