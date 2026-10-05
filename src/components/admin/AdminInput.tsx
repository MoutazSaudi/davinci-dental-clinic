"use client";
import React from "react";

type Props = {
  label: string;
  name: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
};

export function AdminInput({ label, name, value = "", onChange, type = "text", textarea = false, rows = 3 }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground-muted mb-1">{label}</label>
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full border border-border rounded p-2 text-sm"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full border border-border rounded p-2 text-sm"
        />
      )}
    </div>
  );
}

export default AdminInput;
