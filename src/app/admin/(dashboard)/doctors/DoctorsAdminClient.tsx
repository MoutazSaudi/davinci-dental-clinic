"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { DoctorAdmin, STATUS_LABEL } from "./types";
import DoctorForm from "./DoctorForm";

export default function DoctorsAdminClient({
  initial,
}: {
  initial: DoctorAdmin[];
}) {
  const [items, setItems] = useState<DoctorAdmin[]>(initial || []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DoctorAdmin | null>(null);

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!confirm("Delete this doctor?")) return;
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
            Doctors
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            Manage the medical team shown on the website.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="shrink-0 py-2 px-4 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          + New Doctor
        </button>
      </div>

      <AdminTable<DoctorAdmin>
        items={items}
        pageSize={8}
        emptyMessage="No doctors yet. Add your first doctor to get started."
        headers={
          <tr>
            <th className="p-3 text-left">Photo</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Specialty</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
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
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="py-1.5 px-3 border border-red-200 text-red-600 rounded-md text-xs font-medium hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </>
        )}
      />

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
  const styles: Record<DoctorAdmin["status"], string> = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    ARCHIVED: "bg-gray-200 text-gray-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}