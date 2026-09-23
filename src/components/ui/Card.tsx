import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 rounded border border-border bg-surface ${className}`}>{children}</div>;
}