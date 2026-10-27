"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import {
  AppointmentAdmin,
  AppointmentStatus,
  DoctorOption,
  STATUS_LABEL,
  STATUS_STYLES,
  formatDateTime,
} from "./types";

export default function AppointmentsAdminClient() {
  const [items, setItems] = useState<AppointmentAdmin[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AppointmentAdmin | null>(null);

  useEffect(() => {
    void bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function bootstrap() {
    setLoading(true);
    await Promise.all([refresh(), loadDoctors()]);
    setLoading(false);
  }

  async function refresh() {
    const res = await fetch("/api/admin/appointments");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  async function loadDoctors() {
    const res = await fetch("/api/admin/doctors");
    const data = await res.json();
    if (Array.isArray(data)) {
      setDoctors(
        data.map((d: { id: string; slug: string; name: { en: string; ar: string } }) => ({
          id: d.id,
          slug: d.slug,
          name: d.name,
        }))
      );
    }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch(
        `/api/admin/appointments?id=${encodeURIComponent(id)}`,
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
    if (!confirm("Delete this appointment?")) return;
    await fetch(`/api/admin/appointments?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await refresh();
  }

  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((i) => i.status === "PENDING").length;
    const confirmed = items.filter((i) => i.status === "CONFIRMED").length;
    const today = items.filter((i) => {
      const d = new Date(i.scheduledAt);
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }).length;
    return { total, pending, confirmed, today };
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-primary)" }}
        >
          Appointments
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-foreground-muted)" }}
        >
          Manage patient bookings and assign doctors.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Today" value={stats.today} />
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-gray-500">
          Loading appointments…
        </div>
      ) : (
        <AdminTable<AppointmentAdmin>
          items={items}
          pageSize={8}
          emptyMessage="No appointment requests yet."
          headers={
            <tr>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Scheduled</th>
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
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
                    {item.patientName}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-foreground-muted)" }}
                  >
                    {item.patientPhone}
                  </div>
                  {item.patientEmail && (
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-foreground-muted)" }}
                    >
                      {item.patientEmail}
                    </div>
                  )}
                </td>

                <td
                  className="p-3 align-middle text-xs"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {formatDateTime(item.scheduledAt, "en")}
                </td>

                <td className="p-3 align-middle">
                  <select
                    value={item.doctor?.id ?? ""}
                    onChange={(e) =>
                      patch(item.id, { doctorId: e.target.value || null })
                    }
                    disabled={busy}
                    className="py-1 px-2 border rounded-md text-xs outline-none w-full max-w-[180px]"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-background)",
                      color: "var(--color-foreground)",
                    }}
                  >
                    <option value="">— Unassigned —</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name.en}
                      </option>
                    ))}
                  </select>
                </td>

                <td
                  className="p-3 align-middle text-xs"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {item.serviceSlug || "—"}
                </td>

                <td className="p-3 align-middle">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      patch(item.id, {
                        status: e.target.value as AppointmentStatus,
                      })
                    }
                    disabled={busy}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold outline-none border-0 ${
                      STATUS_STYLES[item.status]
                    }`}
                  >
                    {(Object.keys(STATUS_LABEL) as AppointmentStatus[]).map(
                      (s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      )
                    )}
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
                      View
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
            );
          }}
        />
      )}

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-lg font-bold">Appointment details</h3>
              <button
                onClick={() => setDetail(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <dl className="space-y-3 text-sm">
              <Row label="Patient" value={detail.patientName} />
              <Row label="Phone" value={detail.patientPhone} />
              <Row label="Email" value={detail.patientEmail || "—"} />
              <Row
                label="Scheduled"
                value={formatDateTime(detail.scheduledAt, "en")}
              />
              <Row
                label="Doctor"
                value={detail.doctor?.name.en ?? "Unassigned"}
              />
              <Row label="Service" value={detail.serviceSlug || "—"} />
              <Row
                label="Status"
                value={
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      STATUS_STYLES[detail.status]
                    }`}
                  >
                    {STATUS_LABEL[detail.status]}
                  </span>
                }
              />
              <Row
                label="Notes"
                value={
                  <span className="whitespace-pre-wrap">
                    {detail.notes || "—"}
                  </span>
                }
              />
              <Row
                label="Created"
                value={formatDateTime(detail.createdAt, "en")}
              />
            </dl>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetail(null)}
                className="py-2 px-4 text-white rounded-lg text-sm font-medium"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
      <dd
        className="flex-1"
        style={{ color: "var(--color-foreground)" }}
      >
        {value}
      </dd>
    </div>
  );
}