"use client";

import React, { useEffect, useState } from "react";
import type { ServiceItem } from "../../../../data/mock/services";
import AdminTable from "../../../../components/admin/AdminTable";
import AdminModal from "../../../../components/admin/AdminModal";
import {
  DynamicForm,
  FormFieldConfig,
} from "../../../../components/admin/DynamicForm";
import { z } from "zod";
import { useAdminT } from "@/app/hooks/useAdminT";

export type ServiceFormValues = {
  slug: string;
  title: { en: string; ar?: string };
  category: { en: string; ar?: string };
  image: string;
};

export default function ServicesAdminClient() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ServiceItem | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState("");
  const { t } = useAdminT();

  // Schema built inside the component so messages use the active locale
  const serviceSchema = z.object({
    slug: z.string().min(2, t.services.errorSlug),
    title: z.object({
      en: z.string().min(2, t.services.errorTitleEn),
      ar: z.string().optional(),
    }),
    category: z.object({
      en: z.string().min(2, t.services.errorCategoryEn),
      ar: z.string().optional(),
    }),
    image: z.string().min(1, t.services.errorImageUrl),
  });

  const serviceFields: FormFieldConfig<ServiceFormValues>[] = [
    {
      name: "slug",
      label: t.services.slugLabel,
      type: "text",
      placeholder: t.services.slugPlaceholder,
    },
    {
      name: "title.en",
      label: t.services.titleEnLabel,
      type: "text",
      placeholder: t.services.titleEnPlaceholder,
    },
    {
      name: "category.en",
      label: t.services.categoryEnLabel,
      type: "text",
      placeholder: t.services.categoryEnPlaceholder,
    },
    {
      name: "image",
      label: t.services.imageUrlLabel,
      type: "text",
      placeholder: t.services.imageUrlPlaceholder,
    },
  ];

  useEffect(() => {
    void bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPendingImage(selected?.image || "");
  }, [selected, open]);

  async function bootstrap() {
    setLoading(true);
    await refresh();
    setLoading(false);
  }

  async function refresh() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
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
      alert(t.services.imageUploadFailed);
      return;
    }

    const data = await res.json();
    setPendingImage(data.url || "");
  }

  async function handleCreate(data: ServiceFormValues) {
    await fetch("/api/admin/services", {
      method: "POST",
      body: JSON.stringify({ ...data, image: pendingImage || data.image }),
      headers: { "Content-Type": "application/json" },
    });
    setOpen(false);
    setSelected(null);
    setPendingImage("");
    await refresh();
  }

  async function handleUpdate(data: ServiceFormValues) {
    await fetch(
      `/api/admin/services?slug=${encodeURIComponent(selected?.slug || "")}`,
      {
        method: "PUT",
        body: JSON.stringify({ ...data, image: pendingImage || data.image }),
        headers: { "Content-Type": "application/json" },
      }
    );
    setSelected(null);
    setOpen(false);
    setPendingImage("");
    await refresh();
  }

  async function handleDelete(slug: string) {
    if (!confirm(t.services.deleteConfirm)) return;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-foreground)]">
            {t.services.title}
          </h2>
          <p className="text-sm text-[var(--color-foreground-muted)]">
            {t.services.totalServices}: {items.length}
          </p>
        </div>
        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="py-2 px-4 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {t.services.newService}
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-[var(--color-foreground-muted)]">
          {t.services.loading}
        </div>
      ) : (
        <AdminTable<ServiceItem>
          items={items}
          pageSize={8}
          emptyMessage={t.services.empty}
          headers={
            <tr>
              <th className="p-3 text-start">{t.common.slug}</th>
              <th className="p-3 text-start">{t.services.categoryEnLabel}</th>
              <th className="p-3 text-start">{t.services.titleEnLabel}</th>
              <th className="p-3 text-start">{t.services.image}</th>
              <th className="p-3 text-start">{t.common.actions}</th>
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
                  className="w-20 h-12 object-cover rounded border border-[var(--color-border)]"
                />
              </td>
              <td className="p-3 align-middle">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelected(s);
                      setOpen(true);
                    }}
                    className="py-1.5 px-3 border rounded-md text-xs font-medium hover:bg-[var(--color-background-soft)] transition-colors"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-foreground)",
                    }}
                  >
                    {t.common.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(s.slug)}
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

      <AdminModal
        open={open}
        title={selected ? t.services.formTitleEdit : t.services.formTitleNew}
        onClose={() => {
          setOpen(false);
          setSelected(null);
          setPendingImage("");
        }}
      >
        <div className="space-y-4 mb-4">
          <label className="block font-medium text-sm text-[var(--color-foreground)]">
            {t.services.uploadImage}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => uploadImage(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-[var(--color-foreground-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--color-primary-soft)] file:text-[var(--color-primary)]"
          />
          {pendingImage && (
            <img
              src={pendingImage}
              alt={t.services.imageAlt}
              className="h-24 w-32 object-cover rounded-lg border border-[var(--color-border)]"
            />
          )}
        </div>

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
          submitLabel={
            selected ? t.services.submitEdit : t.services.submitNew
          }
        />
      </AdminModal>
    </div>
  );
}