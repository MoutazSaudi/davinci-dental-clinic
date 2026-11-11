import React from "react";
import { redirect } from "next/navigation";
import { requireAdminServer } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminServer();

  if (session.user.mustChangePassword) {
    redirect("/admin/first-login");
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[var(--color-background)] text-[var(--color-foreground)] md:h-screen">
      <Sidebar user={session.user} />

      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden overflow-y-auto md:h-screen">
        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}