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
    <div className="flex items-center justify-between bg-white p-4 border-b">
      <div className="text-lg font-semibold" style={{ color: "#0B3B5A" }}>
        {title || "Admin"}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="py-1 px-3 rounded bg-[#2B7A78] text-white hover:opacity-95 text-sm"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Topbar;
