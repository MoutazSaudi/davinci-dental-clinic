import React from "react";
import { requireAdminServer } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminServer();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-background)] text-[var(--color-foreground)]">
      <Sidebar />

      <div className="flex h-full flex-1 flex-col overflow-y-auto">
        <main className="flex-1 p-3 sm:p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
