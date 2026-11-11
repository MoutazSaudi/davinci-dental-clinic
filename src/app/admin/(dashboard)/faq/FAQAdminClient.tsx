"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import type { BilingualFAQItem } from "@/data/mock/faq";
import FAQForm from "./FAQForm";
import { useAdminT } from "@/app/hooks/useAdminT";
type FAQListItem = BilingualFAQItem & { id?: string };

export default function FAQAdminClient() {
  const [items, setItems] = useState<FAQListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FAQListItem | null>(null);
  const [open, setOpen] = useState(false);
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
    const res = await fetch("/api/admin/faq");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm(t.faq.deleteConfirm)) return;
    await fetch(`/api/admin/faq?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t.faq.title}
          </h2>
          <p
            className="text-sm"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            {t.faq.totalQuestions}: {items.length}
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
          {t.faq.newQuestion}
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm text-[var(--color-foreground-muted)]">
          {t.faq.loading}
        </div>
      ) : (
        <AdminTable<FAQListItem>
          items={items}
          pageSize={8}
          emptyMessage={t.faq.empty}
          headers={
            <tr>
              <th className="p-3 text-start">{t.faq.questionEn}</th>
              <th className="p-3 text-start">{t.faq.questionAr}</th>
              <th className="p-3 text-start">{t.common.actions}</th>
            </tr>
          }
          renderRow={(item) => (
            <>
              <td
                className="p-3 align-middle font-medium"
                style={{ color: "var(--color-foreground)" }}
              >
                {item.question.en}
              </td>
              <td
                className="p-3 align-middle"
                style={{ color: "var(--color-foreground-muted)" }}
                dir="rtl"
              >
                {item.question.ar}
              </td>
              <td className="p-3 align-middle">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelected(item);
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
                    onClick={() => handleDelete(item.id)}
                    className="py-1.5 px-3 border border-red-200 text-red-600 rounded-md text-xs font-medium hover:bg-red-50 transition-colors"
                  >
                    {t.common.delete}
                  </button>
                </div>
              </td>
            </>
          )}
        />
      )}

      <FAQForm
        open={open}
        editing={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        onSaved={async () => {
          setOpen(false);
          setSelected(null);
          await refresh();
        }}
      />
    </div>
  );
}