"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { useAdminT } from "@/app/hooks/useAdminT";
import AccountForm, { AccountRow } from "./AccountForm";

interface Props {
  currentUserId: string;
}

export default function AccountsAdminClient({ currentUserId }: Props) {
  const [items, setItems] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AccountRow | null>(null);
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
    const res = await fetch("/api/admin/accounts");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: AccountRow) {
    setEditing(item);
    setOpen(true);
  }

  async function handleSaved() {
    setOpen(false);
    setEditing(null);
    await refresh();
  }

  async function handleToggleActive(item: AccountRow) {
    const next = !item.isActive;
    const confirmMsg = next
      ? t.accounts.confirmActivate.replace("{username}", item.username)
      : t.accounts.confirmDeactivate.replace("{username}", item.username);
    if (!confirm(confirmMsg)) return;
    const res = await fetch(
      `/api/admin/accounts?id=${encodeURIComponent(item.id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error || t.common.failedToSave);
      return;
    }
    await refresh();
  }

  async function handleDelete(item: AccountRow) {
    if (!confirm(t.accounts.deleteConfirm.replace("{username}", item.username)))
      return;
    const res = await fetch(
      `/api/admin/accounts?id=${encodeURIComponent(item.id)}`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error || t.common.failedToSave);
      return;
    }
    await refresh();
  }

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((i) => i.isActive).length,
      admins: items.filter((i) => i.role === "ADMIN").length,
    }),
    [items]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-primary)" }}
          >
            {t.accounts.title}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            {t.accounts.description}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="shrink-0 py-2 px-4 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {t.accounts.newAccount}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label={t.accounts.statTotal} value={stats.total} />
        <StatCard label={t.accounts.statActive} value={stats.active} />
        <StatCard label={t.accounts.statAdmins} value={stats.admins} />
      </div>

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-[var(--color-foreground-muted)]">
          {t.accounts.loading}
        </div>
      ) : (
        <AdminTable<AccountRow>
          items={items}
          pageSize={10}
          emptyMessage={t.accounts.empty}
          headers={
            <tr>
              <th className="p-3 text-start">{t.accounts.colUsername}</th>
              <th className="p-3 text-start">{t.accounts.colName}</th>
              <th className="p-3 text-start">{t.accounts.colRole}</th>
              <th className="p-3 text-start">{t.accounts.colPermissions}</th>
              <th className="p-3 text-start">{t.accounts.colStatus}</th>
              <th className="p-3 text-start">{t.common.actions}</th>
            </tr>
          }
          renderRow={(item) => {
            const isSelf = item.id === currentUserId;

            return (
              <>
                {/* Username + "You" badge */}
                <td className="p-3 align-middle">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-medium text-sm font-mono"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {item.username}
                    </span>
                    {isSelf && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold">
                        {t.accounts.you}
                      </span>
                    )}
                  </div>
                  {item.mustChangePassword && (
                    <div className="text-[10px] mt-0.5 text-[var(--color-warning)]">
                      {t.accounts.mustChangeBadge}
                    </div>
                  )}
                </td>

                {/* Name */}
                <td
                  className="p-3 align-middle text-sm"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {item.name || "—"}
                </td>

                {/* Role */}
                <td className="p-3 align-middle">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.role === "ADMIN"
                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                        : "bg-[var(--color-background-soft)] text-[var(--color-foreground-muted)]"
                    }`}
                  >
                    {item.role === "ADMIN"
                      ? t.accounts.roleAdmin
                      : t.accounts.roleEditor}
                  </span>
                </td>

                {/* Permissions */}
                <td
                  className="p-3 align-middle text-xs max-w-[260px]"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {item.role === "ADMIN" ? (
                    <span className="italic">{t.accounts.allPermissions}</span>
                  ) : item.permissions.length === 0 ? (
                    <span className="italic">{t.accounts.noPermissions}</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {item.permissions.map((p) => (
                        <span
                          key={p}
                          className="px-1.5 py-0.5 rounded bg-[var(--color-background-soft)] text-[10px] font-medium"
                        >
                          {t.permission[p as keyof typeof t.permission] ?? p}
                        </span>
                      ))}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="p-3 align-middle">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {item.isActive
                      ? t.accounts.statusActive
                      : t.accounts.statusInactive}
                  </span>
                </td>

                {/* Actions — hidden for self */}
                <td className="p-3 align-middle">
                  <div className="flex items-center gap-2 flex-wrap">
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

                    {!isSelf && (
                      <>
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`py-1.5 px-3 border rounded-md text-xs font-medium transition-colors ${
                            item.isActive
                              ? "border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-900/50 dark:text-orange-300 dark:hover:bg-orange-950/30"
                              : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/50 dark:text-green-300 dark:hover:bg-green-950/30"
                          }`}
                        >
                          {item.isActive
                            ? t.accounts.deactivate
                            : t.accounts.activate}
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="py-1.5 px-3 border border-red-200 text-red-600 rounded-md text-xs font-medium hover:bg-red-50 transition-colors dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30"
                        >
                          {t.common.delete}
                        </button>
                      </>
                    )}

                    {isSelf && (
                      <span
                        className="text-[11px] italic"
                        style={{ color: "var(--color-foreground-muted)" }}
                      >
                        {t.accounts.selfManagedNote}
                      </span>
                    )}
                  </div>
                </td>
              </>
            );
          }}
        />
      )}

      <AccountForm
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