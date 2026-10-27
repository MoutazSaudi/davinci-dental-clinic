"use client";

import { useEffect } from "react";

export type ToastVariant = "success" | "error";

interface ToastProps {
  variant: ToastVariant;
  message: string;
  onClose: () => void;
  duration?: number;
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const CONTAINERS: Record<ToastVariant, string> = {
  success:
    "bg-[#16a34a] text-white shadow-[0_18px_40px_rgba(22,163,74,0.35)]",
  error:
    "bg-[#dc2626] text-white shadow-[0_18px_40px_rgba(220,38,38,0.35)]",
};

export function Toast({
  variant,
  message,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed end-4 top-4 z-[100] flex max-w-md items-start gap-3 rounded-2xl px-5 py-4 text-sm font-medium ${CONTAINERS[variant]}`}
      style={{ animation: "toastIn 0.25s ease-out" }}
    >
      <span className="mt-0.5 shrink-0">{ICONS[variant]}</span>
      <span className="flex-1 leading-6">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 ms-2 opacity-80 transition-opacity hover:opacity-100"
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <style jsx global>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;