import React from "react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-border">
      <div className="p-6">
        <div className="mb-6">
          <div className="text-xl font-bold text-primary">Clinic Admin</div>
          <div className="text-sm text-foreground-muted">Dashboard</div>
        </div>

        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 px-3 rounded text-foreground hover:bg-background-soft">
            Overview
          </Link>
          <Link href="/admin/appointments" className="block py-2 px-3 rounded text-foreground hover:bg-background-soft">
            Appointments
          </Link>
          <Link href="/admin/services" className="block py-2 px-3 rounded text-foreground hover:bg-background-soft">
            Services
          </Link>
          <Link href="/admin/doctors" className="block py-2 px-3 rounded text-foreground hover:bg-background-soft">
            Doctors
          </Link>
          <Link href="/admin/blog" className="block py-2 px-3 rounded text-foreground hover:bg-background-soft">
            Blog
          </Link>
          <Link href="/admin/settings" className="block py-2 px-3 rounded text-foreground hover:bg-background-soft">
            Settings
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;