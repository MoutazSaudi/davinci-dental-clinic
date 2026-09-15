import React from "react";
import { requireAdminServer, isAdminAuthEnabled } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const enabled = isAdminAuthEnabled();

  // server-side guard: redirects to login when enabled and missing session
  if (enabled) {
    requireAdminServer();
  }

  return (
    <div className="min-h-screen bg-[#f6f9f8]">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-h-screen">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
