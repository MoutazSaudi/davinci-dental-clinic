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

  return (
    <aside
      className="flex h-full w-[260px] min-w-[220px] flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-all duration-200"
    >
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="mb-8">
          <div className="text-xl font-bold tracking-tight text-[var(--color-primary)]">{copy.brand}</div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
            {copy.subtitle}
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {copy.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
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
  );
}

export default Sidebar;