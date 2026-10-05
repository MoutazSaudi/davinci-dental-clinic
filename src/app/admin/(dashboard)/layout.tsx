import React from "react";
import { requireAdminServer } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Redirects to /admin/login when there is no valid session.
  await requireAdminServer();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f9f8]">
      <Sidebar />

      <div className="flex flex-col flex-1 h-full overflow-y-auto">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
