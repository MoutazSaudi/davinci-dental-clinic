"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function Topbar({ title }: { title?: string }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch(`/admin/logout`, { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <header 
      className="flex items-center justify-between px-6 py-4 shadow-sm"
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
        {title || "Dashboard"}
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="py-1.5 px-4 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 shadow-sm"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Topbar;