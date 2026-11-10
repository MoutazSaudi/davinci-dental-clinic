"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

type DashboardLocale = "en" | "ar";
type DashboardTheme = "light" | "dark";

const translations = {
  en: {
    brand: "Clinic Admin",
    subtitle: "Dashboard Management",
    nav: [
      { href: "/admin/", label: "Overview" },
      { href: "/admin/appointments", label: "Appointments" },
      { href: "/admin/messages", label: "Messages" },
      { href: "/admin/doctors", label: "Doctors" },
      { href: "/admin/gallery", label: "Gallery" },
      { href: "/admin/settings", label: "Settings" },
    ],
    themeLight: "Light",
    themeDark: "Dark",
    language: "AR",
    menu: "Menu",
  },
  ar: {
    brand: "إدارة العيادة",
    subtitle: "لوحة التحكم",
    nav: [
      { href: "/admin/", label: "نظرة عامة" },
      { href: "/admin/appointments", label: "المواعيد" },
      { href: "/admin/messages", label: "الرسائل" },
      { href: "/admin/doctors", label: "الأطباء" },
      { href: "/admin/gallery", label: "المعرض" },
      { href: "/admin/settings", label: "الإعدادات" },
    ],
    themeLight: "فاتح",
    themeDark: "داكن",
    language: "EN",
    menu: "القائمة",
  },
} as const;

function applyDashboardSettings(locale: DashboardLocale, theme: DashboardTheme) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === "ar" ? "rtl" : "ltr";
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  localStorage.setItem("admin-dashboard-locale", locale);
  localStorage.setItem("admin-dashboard-theme", theme);
}

function broadcastDashboardSettings(locale: DashboardLocale, theme: DashboardTheme) {
  applyDashboardSettings(locale, theme);
  window.dispatchEvent(
    new CustomEvent("admin-dashboard-settings", {
      detail: { locale, theme },
    })
  );
}

export function Sidebar() {
  const [locale, setLocale] = useState<DashboardLocale>("en");
  const [theme, setTheme] = useState<DashboardTheme>("light");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin-dashboard-locale") as DashboardLocale | null;
    const savedTheme = localStorage.getItem("admin-dashboard-theme") as DashboardTheme | null;
    const nextLocale = savedLocale === "ar" ? "ar" : "en";
    const nextTheme = savedTheme === "dark" ? "dark" : "light";

    setLocale(nextLocale);
    setTheme(nextTheme);
    applyDashboardSettings(nextLocale, nextTheme);

    const syncSettings = (event: Event) => {
      const detail = (event as CustomEvent).detail as { locale?: DashboardLocale; theme?: DashboardTheme } | undefined;
      const selectedLocale = detail?.locale === "ar" ? "ar" : "en";
      const selectedTheme = detail?.theme === "dark" ? "dark" : "light";
      setLocale(selectedLocale);
      setTheme(selectedTheme);
      applyDashboardSettings(selectedLocale, selectedTheme);
    };

    window.addEventListener("admin-dashboard-settings", syncSettings);
    return () => window.removeEventListener("admin-dashboard-settings", syncSettings);
  }, []);

  const copy = translations[locale];

  const toggleLocale = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    setLocale(nextLocale);
    broadcastDashboardSettings(nextLocale, theme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    broadcastDashboardSettings(locale, nextTheme);
  };

  const menuButtonLabel = locale === "ar" ? "فتح القائمة" : "Open menu";

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((current) => !current)}
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
          aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/35 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 ${locale === "ar" ? "right-0" : "left-0"} z-50 flex h-full w-[84vw] max-w-[280px] flex-col border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] transition-transform duration-200 md:static md:z-auto md:w-[260px] md:max-w-none md:translate-x-0 md:border-r md:shadow-[var(--shadow-sm)] ${mobileOpen ? "translate-x-0" : locale === "ar" ? "translate-x-full" : "-translate-x-full"}`}
        style={{ borderInlineEnd: "1px solid var(--color-border)" }}
      >
        <div className="flex min-h-0 flex-1 flex-col p-5">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-primary)]">{copy.brand}</div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
                {copy.subtitle}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] md:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            {copy.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition-colors duration-200 hover:bg-[var(--color-background-soft)] hover:text-[var(--color-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 space-y-3 border-t border-[var(--color-border)] pt-4">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-soft)] p-2">
              <button
                type="button"
                onClick={toggleLocale}
                aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
                className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-surface)]"
              >
                {copy.language}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "التبديل إلى الوضع الداكن"}
                className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-surface)]"
              >
                {theme === "dark" ? copy.themeLight : copy.themeDark}
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