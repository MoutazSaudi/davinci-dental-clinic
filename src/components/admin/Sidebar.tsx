import React from "react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r" style={{ borderRightColor: "#e6efee" }}>
      <div className="p-6">
        <div className="mb-6">
          <div className="text-xl font-bold" style={{ color: "#0B3B5A" }}>Clinic Admin</div>
          <div className="text-sm text-gray-500">Dashboard</div>
        </div>

        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 px-3 rounded hover:bg-[#f3f7f6]">
            Overview
          </Link>
          <Link href="/admin/appointments" className="block py-2 px-3 rounded hover:bg-[#f3f7f6]">
            Appointments
          </Link>
          <Link href="/admin/services" className="block py-2 px-3 rounded hover:bg-[#f3f7f6]">
            Services
          </Link>
          <Link href="/admin/doctors" className="block py-2 px-3 rounded hover:bg-[#f3f7f6]">
            Doctors
          </Link>
          <Link href="/admin/blog" className="block py-2 px-3 rounded hover:bg-[#f3f7f6]">
            Blog
          </Link>
          <Link href="/admin/settings" className="block py-2 px-3 rounded hover:bg-[#f3f7f6]">
            Settings
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
