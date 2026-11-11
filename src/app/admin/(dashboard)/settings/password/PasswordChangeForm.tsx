"use client";

import { useState } from "react";
import PasswordInput from "@/components/admin/PasswordInput";
import { useAdminT } from "@/app/hooks/useAdminT";

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useAdminT();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError(t.password.errorMinLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t.password.errorMismatch);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const key = data?.error as string | undefined;
        const map: Record<string, string> = {
          invalid_input: t.password.errorInvalidInput,
          wrong_current_password: t.password.errorWrongCurrent,
          same_password: t.password.errorSamePassword,
          unauthorized: t.password.errorUnauthorized,
        };
        setError(key && map[key] ? map[key] : t.password.errorFailed);
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError(t.common.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {t.password.title}
        </h2>
        <p
          className="text-sm"
          style={{ color: "var(--color-foreground-muted)" }}
        >
          {t.password.description}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl border shadow-sm space-y-4"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div>
          <label className="block mb-1 text-sm font-medium">
            {t.password.currentPassword}
          </label>
          <PasswordInput
            className="w-full p-2 border rounded"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
            showLabel={t.login.showPassword}
            hideLabel={t.login.hidePassword}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            {t.password.newPassword}
          </label>
          <PasswordInput
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            showLabel={t.login.showPassword}
            hideLabel={t.login.hidePassword}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            {t.password.confirmPassword}
          </label>
          <PasswordInput
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            showLabel={t.login.showPassword}
            hideLabel={t.login.hidePassword}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-green-600" role="status">
            {t.password.success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? t.password.submitting : t.password.submit}
        </button>
      </form>
    </div>
  );
}