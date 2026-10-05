import React from "react";
import { requireAdminServer, isAdminAuthEnabled } from "@/lib/auth";

export default async function SettingsPage() {
  const enabled = isAdminAuthEnabled();
  if (enabled) {
    requireAdminServer();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>
          Settings
        </h2>
        <p className="text-sm" style={{ color: "var(--color-foreground-muted)" }}>
          Manage general website preferences and admin configuration.
        </p>
      </div>

      <div 
        className="p-6 rounded-xl border shadow-sm space-y-4"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <h3 className="text-lg font-medium" style={{ color: "var(--color-foreground)" }}>
          General Preferences
        </h3>
        <p className="text-sm" style={{ color: "var(--color-foreground-muted)" }}>
          System settings and security configurations options go here.
        </p>
      </div>
    </div>
  );
}