"use client";

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
  // إيقاف التمرير في الصفحة الخلفية عند فتح النافذة
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* حاوية النافذة المنبثقة مع تحديد أقصى ارتفاع ومنع خروج المحتوى */}
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* رأس النافذة (ثابت لا يتحرك عند التمرير) */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3 className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-sm transition-colors hover:bg-[var(--color-background-soft)]"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            ✕
          </button>
        </div>

        {/* جسم النافذة (وهو الجزء المسؤول عن الـ Scroll إذا كان المحتوى طويلاً) */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

