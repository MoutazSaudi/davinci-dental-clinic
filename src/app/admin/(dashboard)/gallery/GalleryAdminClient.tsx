"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { GalleryAlbum, STATUS_LABEL } from "./types";
import GalleryForm from "./GalleryForm";

export default function GalleryAdminClient({
  initial,
}: {
  initial: GalleryAlbum[];
}) {
  const [items, setItems] = useState<GalleryAlbum[]>(initial || []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryAlbum | null>(null);

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: GalleryAlbum) {
    setEditing(item);
    setOpen(true);
  }

  async function handleSaved() {
    setOpen(false);
    setEditing(null);
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this album and all its images?")) return;
    await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await refresh();
  }

  const stats = useMemo(
    () => ({
      total: items.length,
      published: items.filter((a) => a.status === "PUBLISHED").length,
      images: items.reduce((sum, a) => sum + a.images.length, 0),
    }),
    [items]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-primary)" }}
          >
            Gallery
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            Manage albums and case images shown on the website.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="shrink-0 py-2 px-4 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          + New Album
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Total Albums" value={stats.total} />
        <StatCard label="Published" value={stats.published} />
        <StatCard label="Total Images" value={stats.images} />
      </div>

      {/* Table */}
      <AdminTable<GalleryAlbum>
        items={items}
        pageSize={8}
        emptyMessage="No gallery albums yet. Create your first album to get started."
        headers={
          <tr>
            <th className="p-3 text-left">Cover</th>
            <th className="p-3 text-left">Album</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Images</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        }
        renderRow={(item) => (
          <>
            <td className="p-3 align-middle">
              {item.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.images[0]}
                  alt={item.title.en}
                  className="w-20 aspect-[4/3] object-cover rounded-md border"
                  style={{ borderColor: "var(--color-border)" }}
                />
              ) : (
                <div
                  className="w-20 aspect-[4/3] rounded-md border flex items-center justify-center text-xs"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground-muted)",
                  }}
                >
                  no image
                </div>
              )}
            </td>
            <td className="p-3 align-middle">
              <div
                className="font-medium text-sm"
                style={{ color: "var(--color-foreground)" }}
              >
                {item.title.en}
              </div>
              <div
                className="font-mono text-xs mt-0.5"
                style={{ color: "var(--color-foreground-muted)" }}
              >
                {item.slug}
              </div>
            </td>
            <td
              className="p-3 align-middle text-sm"
              style={{ color: "var(--color-foreground-muted)" }}
            >
              {item.category.en}
            </td>
            <td
              className="p-3 align-middle text-sm"
              style={{ color: "var(--color-foreground-muted)" }}
            >
              {item.images.length}
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

      {/* Form modal — separate component */}
      <GalleryForm
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

/* ─────────────────────────── Helpers ─────────────────────────── */

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

function StatusBadge({ status }: { status: GalleryAlbum["status"] }) {
  const styles: Record<GalleryAlbum["status"], string> = {
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