"use client";

import { ADMIN_I18N, type AdminLocale } from "@/lib/admin-i18n";
import { useDashboardSettings } from "./useDashboardSettings";

export type { AdminLocale };

export function useAdminT() {
  const { locale, theme, setSettings, toggleLocale, toggleTheme } =
    useDashboardSettings();

  const t = ADMIN_I18N[locale];
  const isRtl = locale === "ar";

  return {
    locale,
    theme,
    t,
    isRtl,
    dir: isRtl ? ("rtl" as const) : ("ltr" as const),
    setSettings,
    toggleLocale,
    toggleTheme,
  };
}