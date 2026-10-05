import React from "react";
import { requireAdminServer, isAdminAuthEnabled } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const enabled = isAdminAuthEnabled();

  // الحماية وتحديد السلسلة للوحة التحكم فقط
  if (enabled) {
    requireAdminServer();
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f9f8]">
      {/* الشريط الجانبي سيأخذ الارتفاع كاملاً الآن */}
      <Sidebar />

      {/* حاوية المحتوى تأخذ باقي المساحة مع تفعيل التمرير الداخلي */}
      <div className="flex flex-col flex-1 h-full overflow-y-auto">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}