"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { useDashboardSettings } from "@/app/hooks/useDashboardSettings";
import type { AdminPermission, AdminUserPublic } from "@/lib/auth";

type NavIconName =
  | "overview"
  | "appointments"
  | "messages"
  | "doctors"
  | "gallery"
  | "faq"
  | "services"
  | "settings"
  | "accounts";

type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
  permission: AdminPermission | null;
  adminOnly?: boolean;
};

const translations = {
  en: {
    brand: "Clinic Admin",
    subtitle: "Dashboard Management",
    nav: [
      { href: "/admin/", label: "Overview", icon: "overview", permission: "OVERVIEW" },
      { href: "/admin/appointments", label: "Appointments", icon: "appointments", permission: "APPOINTMENTS" },
      { href: "/admin/messages", label: "Messages", icon: "messages", permission: "MESSAGES" },
      { href: "/admin/doctors", label: "Doctors", icon: "doctors", permission: "DOCTORS" },
      { href: "/admin/gallery", label: "Gallery", icon: "gallery", permission: "GALLERY" },
      { href: "/admin/faq", label: "FAQ", icon: "faq", permission: "FAQ" },
      { href: "/admin/services", label: "Services", icon: "services", permission: "SERVICES" },
      { href: "/admin/accounts", label: "Accounts", icon: "accounts", permission: null, adminOnly: true },
      { href: "/admin/settings", label: "Settings", icon: "settings", permission: null },
    ] as NavItem[],
    themeLight: "Light",
    themeDark: "Dark",
    language: "AR",
  },
  ar: {
    brand: "إدارة العيادة",
    subtitle: "لوحة التحكم",
    nav: [
      { href: "/admin/", label: "نظرة عامة", icon: "overview", permission: "OVERVIEW" },
      { href: "/admin/appointments", label: "المواعيد", icon: "appointments", permission: "APPOINTMENTS" },
      { href: "/admin/messages", label: "الرسائل", icon: "messages", permission: "MESSAGES" },
      { href: "/admin/doctors", label: "الأطباء", icon: "doctors", permission: "DOCTORS" },
      { href: "/admin/gallery", label: "المعرض", icon: "gallery", permission: "GALLERY" },
      { href: "/admin/faq", label: "الأسئلة الشائعة", icon: "faq", permission: "FAQ" },
      { href: "/admin/services", label: "الخدمات", icon: "services", permission: "SERVICES" },
      { href: "/admin/accounts", label: "الحسابات", icon: "accounts", permission: null, adminOnly: true },
      { href: "/admin/settings", label: "الإعدادات", icon: "settings", permission: null },
    ] as NavItem[],
    themeLight: "فاتح",
    themeDark: "داكن",
    language: "EN",
  },
} as const;

function NavIcon({
  name,
  className = "h-[18px] w-[18px]",
}: {
  name: NavIconName;
  className?: string;
}) {
  const paths: Record<NavIconName, React.ReactNode> = {
    overview: (
      <>
        <path d="M3 12 12 3l9 9" />
        <path d="M5 10v10h14V10" />
      </>
    ),
    appointments: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    messages: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
    doctors: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      </>
    ),
    gallery: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-5-5L5 21" />
      </>
    ),
    faq: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    services: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    accounts: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function SunIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function GlobeIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function Sidebar({ user }: { user: AdminUserPublic }) {
  const { locale, theme, toggleLocale, toggleTheme } = useDashboardSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const copy = translations[locale];
  const menuButtonLabel = locale === "ar" ? "فتح القائمة" : "Open menu";
  const closeLabel = locale === "ar" ? "إغلاق القائمة" : "Close menu";

  const visibleNav = useMemo<NavItem[]>(() => {
    return copy.nav.filter((item) => {
      if (item.adminOnly && user.role !== "ADMIN") return false;
      if (item.permission === null) return true;
      if (user.role === "ADMIN") return true;
      return user.permissions.includes(item.permission);
    });
  }, [copy.nav, user]);

  function isActive(href: string): boolean {
    if (!pathname) return false;
    if (href === "/admin/" || href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const isDark = theme === "dark";

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={menuButtonLabel}
        className="fixed left-3 top-3 z-50 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-[var(--shadow-sm)] transition md:hidden"
        style={{ insetInlineStart: "0.75rem" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/35 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 ${
          locale === "ar" ? "right-0" : "left-0"
        } z-50 flex h-full w-[84vw] max-w-[280px] flex-col border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] transition-transform duration-200 md:static md:z-auto md:w-[260px] md:max-w-none md:translate-x-0 md:border-r md:shadow-[var(--shadow-sm)] ${
          mobileOpen
            ? "translate-x-0"
            : locale === "ar"
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
        style={{ borderInlineEnd: "1px solid var(--color-border)" }}
      >
        <div className="flex min-h-0 flex-1 flex-col p-5">
          <div className="mb-8 flex items-start justify-between gap-3">
            <Link href="/admin" className="group min-w-0 flex-1" aria-label={copy.brand}>
              <div className="relative h-14 w-full max-w-[180px]">
                <Image
                  src="/logo.png"
                  alt={copy.brand}
                  fill
                  sizes="180px"
                  priority
                  className="object-contain object-left rtl:object-right transition-opacity group-hover:opacity-90"
                />
              </div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
                {copy.subtitle}
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label={closeLabel}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] md:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {visibleNav.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "text-[var(--color-foreground)] hover:bg-[var(--color-background-soft)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  <span
                    className={`shrink-0 transition-colors ${
                      active
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-foreground-muted)] group-hover:text-[var(--color-primary)]"
                    }`}
                  >
                    <NavIcon name={link.icon} />
                  </span>
                  <span className="truncate">{link.label}</span>
                  {active && (
                    <span
                      className="ms-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 space-y-3 border-t border-[var(--color-border)] pt-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={toggleLocale}
                aria-label={
                  locale === "ar" ? "Switch to English" : "التبديل إلى العربية"
                }
                title={
                  locale === "ar" ? "Switch to English" : "التبديل إلى العربية"
                }
                className="group inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
              >
                <GlobeIcon className="h-4 w-4 text-[var(--color-foreground-muted)] transition-colors group-hover:text-[var(--color-primary)]" />
                <span>{copy.language}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  isDark ? "Switch to light mode" : "التبديل إلى الوضع الداكن"
                }
                title={
                  isDark
                    ? locale === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to light mode"
                    : locale === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to dark mode"
                }
                className="group inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
              >
                {isDark ? (
                  <SunIcon className="h-4 w-4 text-[var(--color-foreground-muted)] transition-colors group-hover:text-[var(--color-primary)]" />
                ) : (
                  <MoonIcon className="h-4 w-4 text-[var(--color-foreground-muted)] transition-colors group-hover:text-[var(--color-primary)]" />
                )}
                <span>{isDark ? copy.themeLight : copy.themeDark}</span>
              </button>
            </div>

            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;