"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/admin/PasswordInput";
import { useAdminT } from "@/app/hooks/useAdminT";

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 200;

type ErrorField = "currentPassword" | "newPassword" | "confirmPassword";
type Errors = Partial<Record<ErrorField, string>>;
type Touched = Partial<Record<ErrorField, boolean>>;

interface Props {
  username: string;
  redirectTo: string;
}

/* Strength score: 0=empty, 1=weak, 2=medium, 3=strong */
function getStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= PASSWORD_MIN) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score >= 4) return 3;
  if (score >= 2) return 2;
  return 1;
}

export default function FirstLoginClient({ username, redirectTo }: Props) {
  const router = useRouter();
  const { t } = useAdminT();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ─────────── Validators ─────────── */

  const validateCurrent = useCallback(
    (value: string): string | null => {
      if (!value) return t.password.errorInvalidInput;
      return null;
    },
    [t]
  );

  const validateNew = useCallback(
    (value: string): string | null => {
      if (!value) return t.password.errorInvalidInput;
      if (value.length < PASSWORD_MIN) return t.password.errorMinLength;
      if (value.length > PASSWORD_MAX) return t.accounts.errorPasswordMax;
      if (value === currentPassword) return t.password.errorSamePassword;
      return null;
    },
    [t, currentPassword]
  );

  const validateConfirm = useCallback(
    (value: string): string | null => {
      if (!value) return t.password.errorMismatch;
      if (value !== newPassword) return t.password.errorMismatch;
      return null;
    },
    [t, newPassword]
  );

  /* ─────────── Error helpers ─────────── */

  function setFieldError(field: ErrorField, message: string | null) {
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function markTouched(field: ErrorField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  /* ─────────── Handlers ─────────── */

  function handleCurrentChange(value: string) {
    setCurrentPassword(value);
    if (touched.currentPassword)
      setFieldError("currentPassword", validateCurrent(value));
    // Re-check new password if it was touched (same-as-current rule)
    if (touched.newPassword && newPassword)
      setFieldError("newPassword", validateNew(newPassword));
  }

  function handleNewChange(value: string) {
    setNewPassword(value);
    if (touched.newPassword) setFieldError("newPassword", validateNew(value));
    // Re-check confirm if it was touched
    if (touched.confirmPassword && confirmPassword)
      setFieldError("confirmPassword", validateConfirm(confirmPassword));
  }

  function handleConfirmChange(value: string) {
    setConfirmPassword(value);
    if (touched.confirmPassword)
      setFieldError("confirmPassword", validateConfirm(value));
  }

  /* ─────────── Submit ─────────── */

  function runFullValidation(): boolean {
    const nextErrors: Errors = {};

    const c = validateCurrent(currentPassword);
    if (c) nextErrors.currentPassword = c;

    const n = validateNew(newPassword);
    if (n) nextErrors.newPassword = n;

    const cf = validateConfirm(confirmPassword);
    if (cf) nextErrors.confirmPassword = cf;

    setErrors(nextErrors);
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!runFullValidation()) return;

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
        switch (key) {
          case "wrong_current_password":
            setFieldError("currentPassword", t.password.errorWrongCurrent);
            markTouched("currentPassword");
            break;
          case "same_password":
            setFieldError("newPassword", t.password.errorSamePassword);
            markTouched("newPassword");
            break;
          case "invalid_input":
            setFieldError("newPassword", t.password.errorInvalidInput);
            markTouched("newPassword");
            break;
          case "unauthorized":
            setServerError(t.password.errorUnauthorized);
            break;
          default:
            setServerError(t.password.errorFailed);
        }
        return;
      }

      // Success — redirect to the user's default landing page
      router.push(redirectTo);
      router.refresh();
    } catch {
      setServerError(t.common.networkError);
    } finally {
      setLoading(false);
    }
  }

  /* ─────────── UI helpers ─────────── */

  function fieldClass(hasError: boolean): string {
    return [
      "w-full p-2 border rounded text-sm transition-colors outline-none",
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-red-700 dark:focus:ring-red-950/40"
        : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]",
    ].join(" ");
  }

  function showError(field: ErrorField): string | undefined {
    return touched[field] ? errors[field] : undefined;
  }

  const strength = getStrength(newPassword);
  const strengthLabel =
    strength === 3
      ? t.firstLogin.strengthStrong
      : strength === 2
      ? t.firstLogin.strengthMedium
      : t.firstLogin.strengthWeak;
  const strengthColor =
    strength === 3
      ? "bg-green-500"
      : strength === 2
      ? "bg-yellow-500"
      : "bg-red-500";

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === newPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-md bg-[var(--color-surface)] rounded-lg p-8 shadow">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl font-semibold mb-2"
            style={{ color: "var(--color-primary)" }}
          >
            {t.firstLogin.title}
          </h1>
          <p className="text-sm text-[var(--color-foreground-muted)]">
            {t.firstLogin.description}
          </p>
        </div>

        {/* User chip */}
        <div className="mb-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-soft)] px-3 py-2 text-xs">
          <span className="text-[var(--color-foreground-muted)]">
            {t.firstLogin.loggedAs}:
          </span>{" "}
          <span
            className="font-mono font-semibold"
            style={{ color: "var(--color-foreground)" }}
          >
            {username}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Current password */}
          <Field
            label={t.password.currentPassword}
            hint={t.firstLogin.hintCurrent}
            error={showError("currentPassword")}
            htmlFor="first-login-current"
          >
            <PasswordInput
              id="first-login-current"
              className={fieldClass(Boolean(showError("currentPassword")))}
              value={currentPassword}
              onChange={(e) => handleCurrentChange(e.target.value)}
              onBlur={() => {
                markTouched("currentPassword");
                setFieldError("currentPassword", validateCurrent(currentPassword));
              }}
              autoComplete="current-password"
              showLabel={t.login.showPassword}
              hideLabel={t.login.hidePassword}
              aria-invalid={Boolean(showError("currentPassword"))}
            />
          </Field>

          {/* New password */}
          <Field
            label={t.password.newPassword}
            error={showError("newPassword")}
            htmlFor="first-login-new"
          >
            <PasswordInput
              id="first-login-new"
              className={fieldClass(Boolean(showError("newPassword")))}
              value={newPassword}
              onChange={(e) => handleNewChange(e.target.value)}
              onBlur={() => {
                markTouched("newPassword");
                setFieldError("newPassword", validateNew(newPassword));
              }}
              autoComplete="new-password"
              showLabel={t.login.showPassword}
              hideLabel={t.login.hidePassword}
              aria-invalid={Boolean(showError("newPassword"))}
            />
            {/* Strength meter */}
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strength >= level
                            ? strengthColor
                            : "bg-[var(--color-border)]"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      strength === 3
                        ? "text-green-600 dark:text-green-400"
                        : strength === 2
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {strengthLabel}
                  </span>
                </div>
              </div>
            )}
          </Field>

          {/* Confirm password */}
          <Field
            label={t.password.confirmPassword}
            error={showError("confirmPassword")}
            htmlFor="first-login-confirm"
          >
            <PasswordInput
              id="first-login-confirm"
              className={fieldClass(Boolean(showError("confirmPassword")))}
              value={confirmPassword}
              onChange={(e) => handleConfirmChange(e.target.value)}
              onBlur={() => {
                markTouched("confirmPassword");
                setFieldError("confirmPassword", validateConfirm(confirmPassword));
              }}
              autoComplete="new-password"
              showLabel={t.login.showPassword}
              hideLabel={t.login.hidePassword}
              aria-invalid={Boolean(showError("confirmPassword"))}
            />
            {passwordsMatch && !showError("confirmPassword") && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t.firstLogin.passwordsMatch}
              </p>
            )}
          </Field>

          {serverError && (
            <div
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/50"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white rounded-lg hover:opacity-95 disabled:opacity-60 font-medium"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? t.password.submitting : t.password.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────── Helpers ─────────── */

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block mb-1 text-sm font-medium text-[var(--color-foreground)]"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-[var(--color-foreground-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}