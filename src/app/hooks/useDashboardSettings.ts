"use client";

import { useCallback, useEffect, useState } from "react";

export type DashboardLocale = "en" | "ar";
export type DashboardTheme = "light" | "dark";

export const DASHBOARD_SETTINGS_EVENT = "admin-dashboard-settings";
const LOCALE_KEY = "admin-dashboard-locale";
const THEME_KEY = "admin-dashboard-theme";

function applyToDocument(locale: DashboardLocale, theme: DashboardTheme) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === "ar" ? "rtl" : "ltr";
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function persist(locale: DashboardLocale, theme: DashboardTheme) {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // storage may be unavailable
  }
}

function readPersisted(): { locale: DashboardLocale; theme: DashboardTheme } {
  if (typeof window === "undefined") {
    return { locale: "en", theme: "light" };
  }
  let locale: DashboardLocale = "en";
  let theme: DashboardTheme = "light";
  try {
    const savedLocale = localStorage.getItem(LOCALE_KEY);
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedLocale === "ar" || savedLocale === "en") locale = savedLocale;
    if (savedTheme === "dark" || savedTheme === "light") theme = savedTheme;
  } catch {
    // ignore
  }
  return { locale, theme };
}

export function useDashboardSettings() {
  const [locale, setLocale] = useState<DashboardLocale>("en");
  const [theme, setTheme] = useState<DashboardTheme>("light");

  const setSettings = useCallback(
    (nextLocale: DashboardLocale, nextTheme: DashboardTheme) => {
      setLocale(nextLocale);
      setTheme(nextTheme);
      applyToDocument(nextLocale, nextTheme);
      persist(nextLocale, nextTheme);
      window.dispatchEvent(
        new CustomEvent(DASHBOARD_SETTINGS_EVENT, {
          detail: { locale: nextLocale, theme: nextTheme },
        })
      );
    },
    []
  );

  const toggleLocale = useCallback(() => {
    setSettings(locale === "ar" ? "en" : "ar", theme);
  }, [locale, theme, setSettings]);

  const toggleTheme = useCallback(() => {
    setSettings(locale, theme === "dark" ? "light" : "dark");
  }, [locale, theme, setSettings]);

  useEffect(() => {
    const initial = readPersisted();
    setLocale(initial.locale);
    setTheme(initial.theme);
    applyToDocument(initial.locale, initial.theme);

    const sync = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | { locale?: DashboardLocale; theme?: DashboardTheme }
        | undefined;
      const nextLocale: DashboardLocale = detail?.locale === "ar" ? "ar" : "en";
      const nextTheme: DashboardTheme =
        detail?.theme === "dark" ? "dark" : "light";
      setLocale(nextLocale);
      setTheme(nextTheme);
      applyToDocument(nextLocale, nextTheme);
    };

    window.addEventListener(DASHBOARD_SETTINGS_EVENT, sync);
    return () =>
      window.removeEventListener(DASHBOARD_SETTINGS_EVENT, sync);
  }, []);

  return { locale, theme, setSettings, toggleLocale, toggleTheme };
}