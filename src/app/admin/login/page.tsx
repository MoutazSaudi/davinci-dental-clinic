"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/admin/PasswordInput";
import { useAdminT } from "@/app/hooks/useAdminT";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [errorFallback, setErrorFallback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t, locale, toggleLocale } = useAdminT();

  function resolveError(key: string | undefined): void {
    if (!key) {
      setErrorFallback(t.login.loginFailed);
      setErrorKey(null);
      return;
    }
    if (key === "invalid_credentials") {
      setErrorKey(t.login.invalidCredentials);
    } else if (key === "too_many_attempts") {
      setErrorKey(t.login.tooManyAttempts);
    } else if (key === "invalid_input") {
      setErrorKey(t.login.invalidInput);
    } else {
      setErrorFallback(t.login.loginFailed);
      setErrorKey(null);
    }
  }

  const error = errorKey ?? errorFallback;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorKey(null);
    setErrorFallback(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        resolveError(data?.error);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorFallback(t.login.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-md bg-[var(--color-surface)] rounded-lg p-8 shadow relative">
        <button
          type="button"
          onClick={toggleLocale}
          className="absolute top-3 right-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-surface)]"
          aria-label={
            locale === "ar"
              ? t.login.switchToEnglish
              : t.login.switchToArabic
          }
        >
          {locale === "ar" ? "EN" : "ع"}
        </button>

        <h2
          className="text-2xl font-semibold mb-2"
          style={{ color: "var(--color-primary)" }}
        >
          {t.login.title}
        </h2>
        <p className="text-sm text-[var(--color-foreground-muted)] mb-6">
          {t.login.subtitle}
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="admin-username"
            className="block mb-2 text-sm font-medium"
          >
            {t.login.username}
          </label>
          <input
            id="admin-username"
            className="w-full mb-4 p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            autoComplete="username"
            inputMode="text"
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "admin-login-error" : undefined}
          />

          <label
            htmlFor="admin-password"
            className="block mb-2 text-sm font-medium"
          >
            {t.login.password}
          </label>
          <PasswordInput
            id="admin-password"
            wrapperClassName="mb-4"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "admin-login-error" : undefined}
            showLabel={t.login.showPassword}
            hideLabel={t.login.hidePassword}
          />

          {error && (
            <div
              id="admin-login-error"
              className="text-sm text-red-600 mb-3"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 rounded text-white hover:opacity-95 disabled:opacity-60"
            style={{ backgroundColor: "var(--color-primary)" }}
            disabled={loading}
          >
            {loading ? t.login.submitting : t.login.submit}
          </button>
        </form>
      </div>
    </div>
  );
}