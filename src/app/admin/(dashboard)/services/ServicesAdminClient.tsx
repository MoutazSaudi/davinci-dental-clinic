"use client";

import React, { useEffect, useState } from "react";
import type { ServiceItem } from "../../../../data/mock/services";
import AdminTable from "../../../../components/admin/AdminTable";
import AdminModal from "../../../../components/admin/AdminModal";
import { DynamicForm, FormFieldConfig } from "../../../../components/admin/DynamicForm";
import { z } from "zod";

// 1. Validation Schema for Services
export const serviceSchema = z.object({
  slug: z.string().min(2, "Slug is required"),
  title: z.object({
    en: z.string().min(2, "English title is required"),
    ar: z.string().optional(),
  }),
  category: z.object({
    en: z.string().min(2, "English category is required"),
    ar: z.string().optional(),
  }),
  image: z.string().min(1, "Image URL is required"),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

// 2. Field Configuration for DynamicForm
const serviceFields: FormFieldConfig<ServiceFormValues>[] = [
  { name: "slug", label: "Slug", type: "text", placeholder: "e.g. teeth-whitening" },
  { name: "title.en", label: "Title (EN)", type: "text", placeholder: "e.g. Teeth Whitening" },
  { name: "category.en", label: "Category (EN)", type: "text", placeholder: "e.g. Cosmetic Dentistry" },
  { name: "image", label: "Image URL", type: "text", placeholder: "e.g. /images/services/whitening.jpg" },
];

export default function ServicesAdminClient({ initial }: { initial: ServiceItem[] }) {
  const [items, setItems] = useState<ServiceItem[]>(initial || []);
  const [selected, setSelected] = useState<ServiceItem | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(initial || []);
  }, [initial]);

  async function refresh() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setItems(data || []);
  }

  async function handleCreate(data: ServiceFormValues) {
    await fetch("/api/admin/services", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    setOpen(false);
    setSelected(null);
    await refresh();
  }

  async function handleUpdate(data: ServiceFormValues) {
    await fetch(`/api/admin/services?slug=${encodeURIComponent(selected?.slug || "")}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    setSelected(null);
    setOpen(false);
    await refresh();
  }

  async function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    await fetch(`/api/admin/services?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    await refresh();
  }

  async function handleSubmitForm(data: ServiceFormValues) {
    if (selected) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Services</h2>
          <p className="text-sm text-foreground-muted">Total services: {items.length}</p>
        </div>
        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          New Service
        </button>
      </div>

      {/* AdminTable Component with Pagination */}
      <AdminTable<ServiceItem>
        items={items}
        pageSize={8}
        emptyMessage="No services found."
        headers={
          <tr>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3 text-left">Category (EN)</th>
            <th className="p-3 text-left">Title (EN)</th>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        }
        renderRow={(s) => (
          <>
            <td className="p-3 align-middle font-mono text-xs">{s.slug}</td>
            <td className="p-3 align-middle">{s.category.en}</td>
            <td className="p-3 align-middle font-medium">{s.title.en}</td>
            <td className="p-3 align-middle">
              <img
                src={s.image}
                alt={s.title.en}
                className="w-20 h-12 object-cover rounded border border-border"
              />
            </td>
            <td className="p-3 align-middle">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelected(s);
                    setOpen(true);
                  }}
                  className="py-1.5 px-3 border border-border rounded-md text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.slug)}
                  className="py-1.5 px-3 border border-red-200 text-red-600 rounded-md text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Modal with DynamicForm */}
      <AdminModal
        open={open}
        title={selected ? "Edit Service" : "New Service"}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
      >
        <DynamicForm<ServiceFormValues>
          schema={serviceSchema}
          fields={serviceFields}
          defaultValues={
            selected
              ? {
                  slug: selected.slug,
                  title: { en: selected.title?.en || "" },
                  category: { en: selected.category?.en || "" },
                  image: selected.image || "",
                }
              : {
                  slug: "",
                  title: { en: "" },
                  category: { en: "" },
                  image: "",
                }
          }
          onSubmit={handleSubmitForm}
          submitLabel={selected ? "Save Changes" : "Create Service"}
        />
      </AdminModal>
    </div>
  );
}