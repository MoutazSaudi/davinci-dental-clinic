"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

type LanguageSwitchProps = {
  locale: Locale;
  variant?: "desktop" | "mobile";
  shouldBeDark?: boolean;
  onNavigate?: () => void;
};

export function LanguageSwitch({
  locale,
  variant = "desktop",
  shouldBeDark = false,
  onNavigate,
}: LanguageSwitchProps) {
  const pathname = usePathname();
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "";
  const alternateHref = `/${alternateLocale}${pathWithoutLocale}`;

  if (variant === "mobile") {
    return (
      <Link
        href={alternateHref}
        onClick={onNavigate}
        className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
      >
        {alternateLocale === "ar" ? "العربية (AR)" : "English (EN)"}
      </Link>
    );
  }

  return (
    <Link
      href={alternateHref}
      className={`hidden sm:inline-flex items-center justify-center rounded-full text-white backdrop-blur-md transition-all hover:bg-white/20 ${
        shouldBeDark
          ? "bg-white/10 px-2.5 py-1 text-[11px] font-semibold"
          : "bg-white/10 px-3.5 py-2 text-xs font-semibold"
      }`}
    >
      {alternateLocale === "ar" ? "AR" : "EN"}
    </Link>
  );
}