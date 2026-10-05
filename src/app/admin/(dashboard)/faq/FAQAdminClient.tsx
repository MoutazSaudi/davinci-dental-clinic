"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminForm from "@/components/admin/AdminForm";
import type { BilingualFAQItem } from "@/data/mock/faq"; // أو حسب مسار ملف الـ mock لديك

export default function FAQAdminClient({ initial }: { initial: BilingualFAQItem[] }) {
  const [items, setItems] = useState<BilingualFAQItem[]>(initial || []);
  const [selected, setSelected] = useState<BilingualFAQItem | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(initial || []);
  }, [initial]);

  async function refresh() {
    const res = await fetch("/api/admin/faq");
    const data = await res.json();
    setItems(data || []);
  }

  async function handleCreate(data: any) {
    await fetch("/api/admin/faq", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    setOpen(false);
    await refresh();
  }

  async function handleUpdate(data: any) {
    // نفترض الاعتماد على مؤشر العنصر (index) أو معرف فريد إن توفر
    const index = items.indexOf(selected!);
    await fetch(`/api/admin/faq?index=${index}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    setSelected(null);
    setOpen(false);
    await refresh();
  }

  async function handleDelete(index: number) {
    if (!confirm("Delete this FAQ item?")) return;
    await fetch(`/api/admin/faq?index=${index}`, {
      method: "DELETE",
    });
    await refresh();
  }

  // مواءمة بيانات الـ FAQ مع شكل الـ AdminForm
  const formInitialData = selected
    ? {
        slug: `faq-${items.indexOf(selected)}`,
        title: { en: selected.question.en, ar: selected.question.ar },
        category: { en: selected.answer.en, ar: selected.answer.ar }, // استخدام الجانب المؤقت للـ form إن وجد
        image: "",
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>FAQ Management</h2>
          <p className="text-sm" style={{ color: "var(--color-foreground-muted)" }}>Total questions: {items.length}</p>
        </div>
        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="py-2 px-4 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          New Question
        </button>
      </div>

      <AdminTable<BilingualFAQItem>
        items={items}
        pageSize={8}
        emptyMessage="No FAQ items found."
        headers={
          <tr>
            <th className="p-3 text-left">Question (EN)</th>
            <th className="p-3 text-left">Question (AR)</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        }
        renderRow={(item, index) => (
          <>
            <td className="p-3 align-middle font-medium" style={{ color: "var(--color-foreground)" }}>{item.question.en}</td>
            <td className="p-3 align-middle" style={{ color: "var(--color-foreground-muted)" }} dir="rtl">{item.question.ar}</td>
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
                  onClick={() => handleDelete(index!)}
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
        title={selected ? "Edit FAQ Item" : "New FAQ Item"}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
      >
        <AdminForm
          initial={formInitialData as any}
          onCancel={() => {
            setOpen(false);
            setSelected(null);
          }}
          onSubmit={async (formData: any) => {
            const faqPayload = {
              question: {
                en: formData.title?.en || "",
                ar: formData.title?.ar || "",
              },
              answer: {
                en: formData.category?.en || "",
                ar: formData.category?.ar || "",
              },
            };

            if (selected) await handleUpdate(faqPayload);
            else await handleCreate(faqPayload);
          }}
        />
      </AdminModal>
    </div>
  );
}