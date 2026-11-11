"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import {
  MessageAdmin,
  MessageStatus,
} from "./types";
import { useAdminT } from "@/app/hooks/useAdminT";

function formatDate(iso: string, locale: "en" | "ar"): string {
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const MESSAGE_STATUS_STYLES: Record<MessageStatus, string> = {
  NEW: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  READ: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  REPLIED:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  ARCHIVED:
    "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export default function MessagesAdminClient() {
  const [items, setItems] = useState<MessageAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MessageAdmin | null>(null);
  const { t, locale } = useAdminT();

  useEffect(() => {
    void bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function bootstrap() {
    setLoading(true);
    await refresh();
    setLoading(false);
  }

  async function refresh() {
    const res = await fetch("/api/admin/contact");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch(
        `/api/admin/contact?id=${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (res.ok) await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t.messages.deleteConfirm)) return;
    await fetch(`/api/admin/contact?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await refresh();
  }

  const stats = useMemo(
    () => ({
      total: items.length,
      new: items.filter((i) => i.status === "NEW").length,
      replied: items.filter((i) => i.status === "REPLIED").length,
    }),
    [items]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-primary)" }}
        >
          {t.messages.title}
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-foreground-muted)" }}
        >
          {t.messages.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t.messages.statTotal} value={stats.total} />
        <StatCard label={t.messages.statNew} value={stats.new} />
        <StatCard label={t.messages.statReplied} value={stats.replied} />
      </div>

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-[var(--color-foreground-muted)]">
          {t.messages.loading}
        </div>
      ) : (
        <AdminTable<MessageAdmin>
          items={items}
          pageSize={8}
          emptyMessage={t.messages.empty}
          headers={
            <tr>
              <th className="p-3 text-start">{t.messages.from}</th>
              <th className="p-3 text-start">{t.messages.message}</th>
              <th className="p-3 text-start">{t.common.locale}</th>
              <th className="p-3 text-start">{t.messages.received}</th>
              <th className="p-3 text-start">{t.common.status}</th>
              <th className="p-3 text-start">{t.common.actions}</th>
            </tr>
          }
          renderRow={(item) => {
            const busy = busyId === item.id;
            return (
              <>
                <td className="p-3 align-middle">
                  <div
                    className="font-medium text-sm"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-foreground-muted)" }}
                  >
                    {item.phone || "—"}
                  </div>
                  {item.email && (
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-foreground-muted)" }}
                    >
                      {item.email}
                    </div>
                  )}
                </td>

                <td
                  className="p-3 align-middle text-xs max-w-xs"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  <div className="line-clamp-2">{item.message}</div>
                </td>

                <td
                  className="p-3 align-middle text-xs uppercase"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {item.locale}
                </td>

                <td
                  className="p-3 align-middle text-xs"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {formatDate(item.createdAt, locale)}
                </td>

                <td className="p-3 align-middle">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      patch(item.id, {
                        status: e.target.value as MessageStatus,
                      })
                    }
                    disabled={busy}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold outline-none border-0 ${
                      MESSAGE_STATUS_STYLES[item.status]
                    }`}
                  >
                    {(Object.keys(t.status) as MessageStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {t.status[s]}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-3 align-middle">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDetail(item)}
                      className="py-1.5 px-3 border rounded-md text-xs font-medium hover:bg-[var(--color-background-soft)] transition-colors"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-foreground)",
                      }}
                    >
                      {t.messages.view}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="py-1.5 px-3 border border-red-200 text-red-600 rounded-md text-xs font-medium hover:bg-red-50 transition-colors dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30"
                    >
                      {t.common.delete}
                    </button>
                  </div>
                </td>
              </>
            );
          }}
        />
      )}

      {detail && (
        <MessageDetailModal
          message={detail}
          onClose={() => setDetail(null)}
          onSaved={async () => {
            await refresh();
            setDetail(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="text-xs uppercase tracking-wide"
        style={{ color: "var(--color-foreground-muted)" }}
      >
        {label}
      </div>
      <div
        className="text-2xl font-bold mt-1"
        style={{ color: "var(--color-foreground)" }}
      >
        {value}
      </div>
    </div>
  );
}

function MessageDetailModal({
  message,
  onClose,
  onSaved,
}: {
  message: MessageAdmin;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const [adminNotes, setAdminNotes] = useState(message.adminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const { t, locale, isRtl } = useAdminT();

  async function saveNotes() {
    setSaving(true);
    try {
      await fetch(
        `/api/admin/contact?id=${encodeURIComponent(message.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminNotes }),
        }
      );
      await onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-[var(--color-surface)] rounded-xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-3">
          <h3 className="text-lg font-bold text-[var(--color-foreground)]">
            {t.messages.detailsTitle}
          </h3>
          <button
            onClick={onClose}
            aria-label={t.common.close}
            className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <dl className="space-y-3 text-sm">
          <Row label={t.messages.from} value={message.name} />
          <Row label={t.messages.phone} value={message.phone || "—"} />
          <Row label={t.messages.email} value={message.email || "—"} />
          <Row label={t.common.locale} value={message.locale.toUpperCase()} />
          <Row label={t.messages.source} value={message.source} />
          <Row label={t.messages.service} value={message.serviceSlug || "—"} />
          <Row
            label={t.messages.received}
            value={formatDate(message.createdAt, locale)}
          />
          <Row
            label={t.messages.message}
            value={
              <span className="whitespace-pre-wrap">{message.message}</span>
            }
          />
        </dl>

        <div className="mt-5">
          <label className="block mb-1 text-xs font-medium uppercase tracking-wide text-[var(--color-foreground-muted)]">
            {t.messages.adminNotes}
          </label>
          <textarea
            className="w-full p-2 border rounded text-sm"
            rows={4}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder={t.messages.adminNotesPlaceholder}
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="py-2 px-4 border rounded-lg text-sm font-medium bg-[var(--color-surface)]"
            style={{ borderColor: "var(--color-border)" }}
          >
            {t.common.cancel}
          </button>
          <button
            onClick={saveNotes}
            disabled={saving}
            className="py-2 px-4 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving ? t.common.saving : t.messages.saveNotes}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <dt
        className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide"
        style={{ color: "var(--color-foreground-muted)" }}
      >
        {label}
      </dt>
      <dd className="flex-1" style={{ color: "var(--color-foreground)" }}>
        {value}
      </dd>
    </div>
  );
}