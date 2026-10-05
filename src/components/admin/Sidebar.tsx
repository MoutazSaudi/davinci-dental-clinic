import React from "react";
import Link from "next/link";

export function Sidebar() {
  const navLinks = [
    { href: "/admin/", label: "Overview" },
    { href: "/admin/appointments", label: "Appointments" },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/doctors", label: "Doctors" },
    { href: "/admin/gallery", label: "Gallery" },
    { href: "/admin/faq", label: "FAQ" },
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
      <div className="p-6">
        {/* Brand / Logo Section */}
        <div className="mb-8">
          <div className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>
            Clinic Admin
          </div>
          <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--color-foreground-muted)" }}>
            Dashboard Management
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
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
      </div>
    </aside>
  );
}

export default Sidebar;