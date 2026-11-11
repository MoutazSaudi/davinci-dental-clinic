"use client";

import { useAdminT } from "@/app/hooks/useAdminT";
import React, { useEffect } from "react";

interface AdminModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AdminModal({
  open,
  title,
  onClose,
  children,
}: AdminModalProps) {
  const { t } = useAdminT();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3
            id="admin-modal-title"
            className="text-lg font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.modal.closeLabel}
            className="p-1 rounded-lg text-sm transition-colors hover:bg-[var(--color-background-soft)]"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}