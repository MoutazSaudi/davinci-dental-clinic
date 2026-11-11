"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { DoctorAdmin } from "./types";
import DoctorForm from "./DoctorForm";
import { useAdminT } from "@/app/hooks/useAdminT";

export default function DoctorsAdminClient() {
  const [items, setItems] = useState<DoctorAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DoctorAdmin | null>(null);
  const { t } = useAdminT();

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
    const res = await fetch("/api/admin/doctors");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: DoctorAdmin) {
    setEditing(item);
    setOpen(true);
  }

  async function handleSaved() {
    setOpen(false);
    setEditing(null);
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm(t.doctors.deleteConfirm)) return;
    await fetch(`/api/admin/doctors?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-primary)" }}
          >
            {t.doctors.title}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            {t.doctors.description}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="shrink-0 py-2 px-4 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {t.doctors.newDoctor}
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-[var(--color-foreground-muted)]">
          {t.doctors.loading}
        </div>
      ) : (
        <AdminTable<DoctorAdmin>
          items={items}
          pageSize={8}
          emptyMessage={t.doctors.empty}
          headers={
            <tr>
              <th className="p-3 text-start">{t.doctors.photo}</th>
              <th className="p-3 text-start">{t.doctors.name}</th>
              <th className="p-3 text-start">{t.doctors.specialty}</th>
              <th className="p-3 text-start">{t.common.status}</th>
              <th className="p-3 text-start">{t.common.actions}</th>
            </tr>
          }
          renderRow={(item) => (
            <>
              <td className="p-3 align-middle">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name.en}
                    className="w-12 h-12 object-cover rounded-full border"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full border flex items-center justify-center text-xs"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-foreground-muted)",
                    }}
                  >
                    —
                  </div>
                )}
              </td>
              <td className="p-3 align-middle">
                <div
                  className="font-medium text-sm"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {item.name.en}
                </div>
                <div
                  className="text-xs mt-0.5"
                  dir="rtl"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {item.name.ar}
                </div>
              </td>
              <td
                className="p-3 align-middle text-sm"
                style={{ color: "var(--color-foreground-muted)" }}
              >
                {item.specialization.en || "—"}
              </td>
              <td className="p-3 align-middle">
                <StatusBadge status={item.status} />
              </td>
              <td className="p-3 align-middle">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="py-1.5 px-3 border rounded-md text-xs font-medium hover:bg-[var(--color-background-soft)] transition-colors"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-foreground)",
                    }}
                  >
                    {t.common.edit}
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
          )}
        />
      )}

      <DoctorForm
        open={open}
        editing={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: DoctorAdmin["status"] }) {
  const { t } = useAdminT();
  const styles: Record<DoctorAdmin["status"], string> = {
    PUBLISHED:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    DRAFT:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    ARCHIVED:
      "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {t.status[status]}
    </span>
  );
}