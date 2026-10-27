import React from "react";
import Link from "next/link";
import { requireAdminServer, isAdminAuthEnabled } from "@/lib/auth";

export default async function SettingsPage() {
  const enabled = isAdminAuthEnabled();
  if (enabled) {
    await requireAdminServer();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-primary)" }}
        >
          Settings
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-foreground-muted)" }}
        >
          Manage your admin account security.
        </p>
      </div>

      {/* Section: Account */}
      <section className="space-y-4">
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--color-foreground)" }}
          >
            Account
          </h2>
          <p
            className="text-xs"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            Security and personal access settings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsCard
            href="/admin/settings/password"
            icon={<LockIcon />}
            title="Change Password"
            description="Update your admin account password."
            accent
          />
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

function SettingsCard({
  href,
  icon,
  title,
  description,
  accent = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
          style={{
            backgroundColor: accent
              ? "var(--color-primary)"
              : "var(--color-background-soft)",
            color: accent ? "#ffffff" : "var(--color-foreground-muted)",
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--color-foreground)" }}
            >
              {title}
            </h3>
            <ArrowIcon />
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
      style={{ color: "var(--color-foreground-muted)" }}
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}