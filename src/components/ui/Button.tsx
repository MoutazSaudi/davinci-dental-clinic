import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

export function Button({ children, className = "", ...rest }: Props) {
  return (
    <button {...rest} className={`px-4 py-2 rounded bg-blue-600 text-white ${className}`}>
      {children}
    </button>
  );
}
