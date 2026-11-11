"use client";

import React from "react";
import Link from "next/link";
import { useAdminT } from "@/app/hooks/useAdminT";
import type { AdminUserPublic } from "@/lib/auth";

interface Props {
  user: AdminUserPublic;
}

export default function SettingsClient({ user }: Props) {
  const { t, locale, theme, setSettings } = useAdminT();
  const isDark = theme === "dark";
  const isAr = locale === "ar";

  /** High-contrast text color when a segmented option is selected. */
  const selectedTextColor = isDark
    ? "var(--color-background)"
    : "#ffffff";

  return (
    <div className="space-y-10 pb-10">
      {/* ───────────────── Header ───────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: "var(--color-foreground)" }}
            >
              {t.settings.title}
            </h1>

            {/* User status pill */}
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border shadow-xs"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  user.isActive ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span className="font-mono">{user.username}</span>
              <span className="opacity-30">•</span>
              <span style={{ color: "var(--color-primary)" }}>
                {user.role === "ADMIN"
                  ? t.accounts.roleAdmin
                  : t.accounts.roleEditor}
              </span>
            </div>
          </div>

          <p
            className="text-sm"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            {t.settings.description}
          </p>
        </div>
      </div>

      {/* ───────────────── Permissions (EDITOR only) ───────────────── */}
      {user.role === "EDITOR" && (
        <div
          className="rounded-3xl p-6 border shadow-sm"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--color-foreground-muted)" }}
            >
              {t.settings.yourPermissions}
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--color-primary-soft)",
                color: "var(--color-primary)",
              }}
            >
              {user.permissions.length}
            </span>
          </div>

          {user.permissions.length === 0 ? (
            <p
              className="text-sm italic"
              style={{ color: "var(--color-foreground-muted)" }}
            >
              {t.accounts.noPermissions}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.permissions.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 rounded-xl bg-[var(--color-background-soft)] text-xs font-semibold border border-[var(--color-border)]"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {t.permission[p as keyof typeof t.permission] ?? p}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───────────────── Security Section ───────────────── */}
      <section className="space-y-5">
        <SectionHeader
          title={t.settings.account}
          description={t.settings.accountDesc}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ══════════ Change Password — Hero card (no hover) ══════════ */}
          <Link
            href="/admin/settings/password"
            className="lg:col-span-2 relative overflow-hidden rounded-3xl border p-7"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            {/* Static glow blob */}
            <div
              className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ backgroundColor: "var(--color-primary)" }}
            />

            {/* Dotted pattern */}
            <svg
              className="absolute top-5 right-5 w-24 h-24 opacity-[0.08] pointer-events-none"
              viewBox="0 0 96 96"
              fill="none"
              aria-hidden="true"
            >
              {Array.from({ length: 5 }).map((_, row) =>
                Array.from({ length: 5 }).map((_, col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={10 + col * 19}
                    cy={10 + row * 19}
                    r="1.5"
                    fill="var(--color-primary)"
                  />
                ))
              )}
            </svg>

            <div className="relative flex flex-col h-full">
              {/* Top: icon + text */}
              <div className="flex items-start gap-5">
                <div className="relative shrink-0">
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-40 pointer-events-none"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                  <div
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "#ffffff",
                    }}
                  >
                    <LockIcon className="w-7 h-7" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3
                      className="text-lg font-bold tracking-tight"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {t.settings.changePassword}
                    </h3>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: "var(--color-primary-soft)",
                        color: "var(--color-primary)",
                      }}
                    >
                      <ShieldCheckIcon className="w-3 h-3" />
                      {isAr ? "موصى به" : "Recommended"}
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-foreground-muted)" }}
                  >
                    {t.settings.changePasswordDesc}
                  </p>
                </div>
              </div>

              {/* Bottom: hint + CTA */}
              <div
                className="mt-6 pt-5 border-t flex items-start justify-between gap-4"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <LightbulbIcon
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--color-foreground-muted)" }}
                  >
                    {isAr
                      ? "لأفضل حماية، استخدم 12 حرفًا أو أكثر مع مزيج من الحروف والأرقام والرموز."
                      : "For best security, use 12+ characters with a mix of letters, numbers, and symbols."}
                  </span>
                </div>

                <span
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--color-primary-soft)",
                    color: "var(--color-primary)",
                  }}
                >
                  {isAr ? "تحديث" : "Update"}
                  <ArrowIcon className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </div>
            </div>
          </Link>

          {/* ══════════ Appearance & Language — Secondary (no hover) ══════════ */}
          <div
            className="relative overflow-hidden rounded-3xl border p-6 shadow-sm flex flex-col"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            {/* Static ambient glow */}
            <div
              className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{ backgroundColor: "var(--color-primary)" }}
            />

            {/* Header */}
            <div className="relative flex items-start gap-3.5 mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{
                  backgroundColor: "var(--color-background-soft)",
                  color: "var(--color-primary)",
                }}
              >
                <GlobeIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-bold tracking-tight leading-tight"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {isAr ? "المظهر واللغة" : "Appearance & Language"}
                </h3>
                <p
                  className="text-xs leading-relaxed mt-0.5"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {isAr ? "خصّص تجربة لوحة التحكم" : "Customize your dashboard"}
                </p>
              </div>
            </div>

            {/* ───── Language ───── */}
            <div className="relative mb-5">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {isAr ? "اللغة" : "Language"}
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--color-primary-soft)",
                    color: "var(--color-primary)",
                  }}
                >
                  {isAr ? "AR" : "EN"}
                </span>
              </div>

              <div
                className="grid grid-cols-2 gap-1 p-1 rounded-xl"
                style={{ backgroundColor: "var(--color-background-soft)" }}
              >
                <button
                  type="button"
                  onClick={() => setSettings("ar", theme)}
                  aria-pressed={isAr}
                  aria-label="التبديل إلى العربية"
                  className="relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors duration-150"
                  style={{
                    backgroundColor: isAr
                      ? "var(--color-primary)"
                      : "transparent",
                    color: isAr
                      ? selectedTextColor
                      : "var(--color-foreground-muted)",
                  }}
                >
                  {isAr && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: selectedTextColor }}
                    />
                  )}
                  العربية
                </button>

                <button
                  type="button"
                  onClick={() => setSettings("en", theme)}
                  aria-pressed={!isAr}
                  aria-label="Switch to English"
                  className="relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors duration-150"
                  style={{
                    backgroundColor: !isAr
                      ? "var(--color-primary)"
                      : "transparent",
                    color: !isAr
                      ? selectedTextColor
                      : "var(--color-foreground-muted)",
                  }}
                >
                  {!isAr && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: selectedTextColor }}
                    />
                  )}
                  English
                </button>
              </div>
            </div>

            {/* ───── Theme ───── */}
            <div className="relative mt-auto">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {isAr ? "المظهر" : "Theme"}
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--color-primary-soft)",
                    color: "var(--color-primary)",
                  }}
                >
                  {isDark ? "🌙" : "☀️"}
                </span>
              </div>

              <div
                className="grid grid-cols-2 gap-1 p-1 rounded-xl"
                style={{ backgroundColor: "var(--color-background-soft)" }}
              >
                <button
                  type="button"
                  onClick={() => setSettings(locale, "light")}
                  aria-pressed={!isDark}
                  aria-label={isAr ? "الوضع الفاتح" : "Light mode"}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors duration-150"
                  style={{
                    backgroundColor: !isDark
                      ? "var(--color-primary)"
                      : "transparent",
                    color: !isDark
                      ? selectedTextColor
                      : "var(--color-foreground-muted)",
                  }}
                >
                  <SunIcon className="h-3.5 w-3.5" />
                  {isAr ? "فاتح" : "Light"}
                </button>

                <button
                  type="button"
                  onClick={() => setSettings(locale, "dark")}
                  aria-pressed={isDark}
                  aria-label={isAr ? "الوضع الداكن" : "Dark mode"}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors duration-150"
                  style={{
                    backgroundColor: isDark
                      ? "var(--color-primary)"
                      : "transparent",
                    color: isDark
                      ? selectedTextColor
                      : "var(--color-foreground-muted)",
                  }}
                >
                  <MoonIcon className="h-3.5 w-3.5" />
                  {isAr ? "داكن" : "Dark"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────── Sub-components ─────────── */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-1 h-10 rounded-full shrink-0"
        style={{ backgroundColor: "var(--color-primary)" }}
      />
      <div>
        <h2
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--color-foreground)" }}
        >
          {title}
        </h2>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--color-foreground-muted)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─────────── Icons ─────────── */

function LockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function LightbulbIcon({
  className = "h-4 w-4",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2 1 4 2 5.5V17h10v-2.5C18 13 19 11 19 9a7 7 0 0 0-7-7z" />
    </svg>
  );
}

function SunIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function GlobeIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}