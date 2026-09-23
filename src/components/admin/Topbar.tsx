"use client";
import React from "react";
import { useRouter } from "next/navigation";

export function Topbar({ title }: { title?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch(`/admin/logout`, { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="flex items-center justify-between bg-surface p-4 border-b border-border">
      <div className="text-lg font-semibold text-primary">
        {title || "Admin"}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="py-1 px-3 rounded bg-teal text-white hover:bg-teal-light text-sm"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Topbar;