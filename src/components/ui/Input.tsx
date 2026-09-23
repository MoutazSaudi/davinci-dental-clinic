import React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="px-3 py-2 border border-border rounded bg-surface text-foreground placeholder:text-foreground-light"
      {...props}
    />
  );
}