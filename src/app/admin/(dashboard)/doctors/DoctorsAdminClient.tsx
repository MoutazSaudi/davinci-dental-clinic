"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminForm from "@/components/admin/AdminForm";

export interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

export default function DoctorsAdminClient({ initial }: { initial: DoctorItem[] }) {
  const [items, setItems] = useState<DoctorItem[]>(initial || []);
  const [selected, setSelected] = useState<DoctorItem | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState("");

  useEffect(() => {
    setItems(initial || []);
  }, [initial]);

  useEffect(() => {
    setPendingImage(selected?.image || "");
  }, [selected, open]);

  async function refresh() {
    const res = await fetch("/api/admin/doctors");
    const data = await res.json();
    setItems(data || []);
  }

  async function uploadImage(file: File | null) {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Image upload failed");
      return;
    }

    const data = await res.json();
    setPendingImage(data.url || "");
  }

  async function handleCreate(data: any) {
    await fetch("/api/admin/doctors", {
      method: "POST",
      body: JSON.stringify({ ...data, image: pendingImage || data.image }),
      headers: { "Content-Type": "application/json" },
    });
    setOpen(false);
    setPendingImage("");
    await refresh();
  }

  async function handleUpdate(data: any) {
    await fetch(`/api/admin/doctors?id=${encodeURIComponent(selected?.id || "")}`, {
      method: "PUT",
      body: JSON.stringify({ ...data, image: pendingImage || data.image }),
      headers: { "Content-Type": "application/json" },
    });
    setSelected(null);
    setOpen(false);
    setPendingImage("");
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this doctor?")) return;
    await fetch(`/api/admin/doctors?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await refresh();
  }

  const formInitialData = selected
    ? {
        slug: selected.id,
        title: { en: selected.name },
        category: { en: selected.specialty },
        image: selected.image,
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>Doctors</h2>
          <p className="text-sm" style={{ color: "var(--color-foreground-muted)" }}>Total doctors: {items.length}</p>
        </div>
        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="py-2 px-4 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          New Doctor
        </button>
      </div>

      <AdminTable<DoctorItem>
        items={items}
        pageSize={8}
        emptyMessage="No doctors found."
        headers={
          <tr>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Specialty</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        }
        renderRow={(item) => (
          <>
            <td className="p-3 align-middle">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-full border"
                style={{ borderColor: "var(--color-border)" }}
              />
            </td>
            <td className="p-3 align-middle font-medium" style={{ color: "var(--color-foreground)" }}>{item.name}</td>
            <td className="p-3 align-middle" style={{ color: "var(--color-foreground-muted)" }}>{item.specialty}</td>
            <td className="p-3 align-middle">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelected(item);
                    setOpen(true);
                  }}
                  className="py-1.5 px-3 border rounded-md text-xs font-medium hover:bg-[var(--color-background-soft)] transition-colors"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-foreground)" }}
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

      <AdminModal
        open={open}
        title={selected ? "Edit Doctor" : "New Doctor"}
        onClose={() => {
          setOpen(false);
          setSelected(null);
          setPendingImage("");
        }}
      >
        <div className="space-y-4 mb-4">
          <label className="block font-medium text-sm text-gray-700">Upload image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => uploadImage(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700"
          />
          {pendingImage && (
            <img src={pendingImage} alt="Selected doctor" className="h-24 w-24 object-cover rounded-full border" />
          )}
        </div>

        <AdminForm
          initial={formInitialData as any}
          onCancel={() => {
            setOpen(false);
            setSelected(null);
            setPendingImage("");
          }}
          onSubmit={async (formData: any) => {
            const doctorPayload = {
              name: formData.title?.en || formData.title,
              specialty: formData.category?.en || formData.category,
              image: pendingImage || formData.image,
            };

            if (selected) await handleUpdate(doctorPayload);
            else await handleCreate(doctorPayload);
          }}
        />
      </AdminModal>
    </div>
  );
}