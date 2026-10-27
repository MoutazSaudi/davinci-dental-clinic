import React from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export function Sidebar() {
  const navLinks = [
    { href: "/admin/", label: "Overview" },
    { href: "/admin/appointments", label: "Appointments" },
    { href: "/admin/messages", label: "Messages" },
    // { href: "/admin/services", label: "Services" },
    { href: "/admin/doctors", label: "Doctors" },
    { href: "/admin/gallery", label: "Gallery" },
    // { href: "/admin/faq", label: "FAQ" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <aside
      className="w-64 h-full flex flex-col shadow-sm transition-all"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      <div className="p-6 flex flex-col flex-1 min-h-0">
        {/* Brand / Logo Section */}
        <div className="mb-8">
          <div
            className="text-xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            Clinic Admin
          </div>
          <div
            className="text-xs uppercase tracking-wider mt-1"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            Dashboard Management
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--color-background-soft)]"
              style={{ color: "var(--color-foreground)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button — pinned to bottom */}
        <div
          className="mt-4 pt-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;