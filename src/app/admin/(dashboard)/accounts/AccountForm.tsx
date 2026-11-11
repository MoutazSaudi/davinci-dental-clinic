"use client";

import React, { useCallback, useEffect, useState } from "react";
import PasswordInput from "@/components/admin/PasswordInput";
import { useAdminT } from "@/app/hooks/useAdminT";

export type AccountRow = {
  id: string;
  username: string;
  name: string | null;
  role: "ADMIN" | "EDITOR";
  permissions: string[];
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

const ALL_PERMISSIONS = [
  "OVERVIEW",
  "APPOINTMENTS",
  "MESSAGES",
  "DOCTORS",
  "GALLERY",
  "FAQ",
  "SERVICES",
] as const;

type Permission = (typeof ALL_PERMISSIONS)[number];

type ErrorField =
  | "username"
  | "name"
  | "password"
  | "newPassword"
  | "permissions";

type Errors = Partial<Record<ErrorField, string>>;
type Touched = Partial<Record<ErrorField, boolean>>;

interface Props {
  open: boolean;
  editing: AccountRow | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

const USERNAME_MIN = 3;
const USERNAME_MAX = 50;
const NAME_MAX = 100;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 200;
const USERNAME_PATTERN = /^[a-z0-9_-]+$/i;

export default function AccountForm({ open, editing, onClose, onSaved }: Props) {
  const { t, isRtl } = useAdminT();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "EDITOR">("EDITOR");
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* Reset on open */
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setUsername(editing.username);
      setName(editing.name ?? "");
      setPassword("");
      setNewPassword("");
      setRole(editing.role);
      setPermissions((editing.permissions as Permission[]) ?? []);
    } else {
      setUsername("");
      setName("");
      setPassword("");
      setNewPassword("");
      setRole("EDITOR");
      setPermissions([]);
    }
    setErrors({});
    setTouched({});
    setServerError(null);
  }, [open, editing]);

  /* ─────────────── Validators ─────────────── */

  const validateUsername = useCallback(
    (value: string): string | null => {
      if (editing) return null; // username is read-only when editing
      const trimmed = value.trim();
      if (!trimmed) return t.accounts.errorUsernameRequired;
      if (trimmed.includes("@")) return t.accounts.errorUsernameEmail;
      if (trimmed.length < USERNAME_MIN) return t.accounts.errorUsernameMin;
      if (trimmed.length > USERNAME_MAX) return t.accounts.errorUsernameMax;
      if (!USERNAME_PATTERN.test(trimmed)) return t.accounts.errorUsernameFormat;
      return null;
    },
    [editing, t]
  );

  const validateName = useCallback(
    (value: string): string | null => {
      if (value.length > NAME_MAX) return t.accounts.errorNameMax;
      return null;
    },
    [t]
  );

  const validatePassword = useCallback(
    (value: string, required: boolean): string | null => {
      if (!value) {
        return required ? t.accounts.errorPasswordRequired : null;
      }
      if (value.length < PASSWORD_MIN) return t.accounts.errorPasswordLength;
      if (value.length > PASSWORD_MAX) return t.accounts.errorPasswordMax;
      return null;
    },
    [t]
  );

  const validatePermissions = useCallback(
    (r: "ADMIN" | "EDITOR", perms: Permission[]): string | null => {
      if (r === "EDITOR" && perms.length === 0) {
        return t.accounts.errorPermissionRequired;
      }
      return null;
    },
    [t]
  );

  /* ─────────────── Error helpers ─────────────── */

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

  /* ─────────────── Field handlers ─────────────── */

  function handleUsernameChange(value: string) {
    setUsername(value);
    if (touched.username) setFieldError("username", validateUsername(value));
  }

  function handleUsernameBlur() {
    markTouched("username");
    setFieldError("username", validateUsername(username));
  }

  function handleNameChange(value: string) {
    setName(value);
    if (touched.name) setFieldError("name", validateName(value));
  }

  function handleNameBlur() {
    markTouched("name");
    setFieldError("name", validateName(name));
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (touched.password)
      setFieldError("password", validatePassword(value, true));
  }

  function handlePasswordBlur() {
    markTouched("password");
    setFieldError("password", validatePassword(password, true));
  }

  function handleNewPasswordChange(value: string) {
    setNewPassword(value);
    if (touched.newPassword)
      setFieldError("newPassword", validatePassword(value, false));
  }

  function handleNewPasswordBlur() {
    markTouched("newPassword");
    setFieldError("newPassword", validatePassword(newPassword, false));
  }

  function handleRoleChange(next: "ADMIN" | "EDITOR") {
    setRole(next);
    // Re-validate permissions whenever the role changes
    if (touched.permissions) {
      setFieldError(
        "permissions",
        validatePermissions(next, permissions)
      );
    }
  }

  function togglePermission(p: Permission) {
    const next = permissions.includes(p)
      ? permissions.filter((x) => x !== p)
      : [...permissions, p];
    setPermissions(next);
    if (touched.permissions) {
      setFieldError("permissions", validatePermissions(role, next));
    }
  }

  /* ─────────────── Submit ─────────────── */

  function runFullValidation(): boolean {
    const nextErrors: Errors = {};

    if (!editing) {
      const u = validateUsername(username);
      if (u) nextErrors.username = u;

      const p = validatePassword(password, true);
      if (p) nextErrors.password = p;
    } else {
      const np = validatePassword(newPassword, false);
      if (np) nextErrors.newPassword = np;
    }

    const n = validateName(name);
    if (n) nextErrors.name = n;

    const perm = validatePermissions(role, permissions);
    if (perm) nextErrors.permissions = perm;

    setErrors(nextErrors);
    setTouched({
      username: !editing,
      password: !editing,
      newPassword: !!editing,
      name: true,
      permissions: role === "EDITOR",
    });

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setServerError(null);

    if (!runFullValidation()) return;

    setSaving(true);
    try {
      if (!editing) {
        const res = await fetch("/api/admin/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim().toLowerCase(),
            name: name.trim() || undefined,
            password,
            role,
            permissions: role === "ADMIN" ? [] : permissions,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          handleServerError(data, "create");
          return;
        }
      } else {
        const body: Record<string, unknown> = {
          name: name.trim() || undefined,
          role,
          permissions: role === "ADMIN" ? [] : permissions,
        };
        if (newPassword) body.newPassword = newPassword;

        const res = await fetch(
          `/api/admin/accounts?id=${encodeURIComponent(editing.id)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          handleServerError(data, "update");
          return;
        }
      }

      await onSaved();
    } catch {
      setServerError(t.common.networkError);
    } finally {
      setSaving(false);
    }
  }

  function handleServerError(
    data: { error?: string; details?: Record<string, string[]> } | null,
    mode: "create" | "update"
  ) {
    const code = data?.error;

    // Map known server errors to specific fields
    if (code === "username_taken") {
      setFieldError("username", t.accounts.errorUsernameTaken);
      markTouched("username");
      return;
    }

    // ZodError details → per-field messages
    if (data?.details && typeof data.details === "object") {
      const next: Errors = {};
      for (const [field, messages] of Object.entries(data.details)) {
        if (Array.isArray(messages) && messages.length > 0) {
          const key = field as ErrorField;
          if (
            key === "username" ||
            key === "name" ||
            key === "password" ||
            key === "newPassword" ||
            key === "permissions"
          ) {
            next[key] = messages[0];
          }
        }
      }
      if (Object.keys(next).length > 0) {
        setErrors((prev) => ({ ...prev, ...next }));
        setTouched((prev) => {
          const merged = { ...prev };
          for (const k of Object.keys(next) as ErrorField[]) merged[k] = true;
          return merged;
        });
        return;
      }
    }

    // Fallback
    setServerError(
      mode === "create"
        ? t.accounts.errorSaveFailed
        : t.accounts.errorSaveFailed
    );
  }

  /* ─────────────── UI helpers ─────────────── */

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

  if (!open) return null;

  const usernameLen = username.trim().length;
  const nameLen = name.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-[var(--color-surface)] rounded-xl max-w-2xl w-full my-8 shadow-xl relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">
              {editing ? t.accounts.formTitleEdit : t.accounts.formTitleNew}
            </h3>
            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
              {editing ? t.accounts.formDescEdit : t.accounts.formDescNew}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] text-xl font-bold"
            aria-label={t.common.close}
            type="button"
          >
            ✕
          </button>
        </div>

        <form
          id="account-form"
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto"
          noValidate
        >
          {/* ───────── Basic information ───────── */}
          <Section
            title={t.accounts.sectionBasic}
            description={t.accounts.sectionBasicDesc}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label={t.accounts.username}
                hint={t.accounts.hintUsername}
                error={showError("username")}
                counter={`${usernameLen}/${USERNAME_MAX}`}
              >
                <input
                  className={fieldClass(Boolean(showError("username")))}
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  onBlur={handleUsernameBlur}
                  disabled={!!editing}
                  placeholder="editor01"
                  autoComplete="off"
                  spellCheck={false}
                  dir="ltr"
                  maxLength={USERNAME_MAX + 10}
                  aria-invalid={Boolean(showError("username"))}
                  aria-describedby={
                    showError("username") ? "username-error" : undefined
                  }
                />
              </Field>

              <Field
                label={t.accounts.name}
                hint={t.accounts.hintName}
                error={showError("name")}
                counter={`${nameLen}/${NAME_MAX}`}
              >
                <input
                  className={fieldClass(Boolean(showError("name")))}
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={handleNameBlur}
                  placeholder="Ahmed"
                  maxLength={NAME_MAX}
                  aria-invalid={Boolean(showError("name"))}
                />
              </Field>
            </div>

            {!editing ? (
              <Field
                label={t.accounts.password}
                hint={t.accounts.hintPassword}
                error={showError("password")}
                counter={`${password.length}/${PASSWORD_MAX}`}
              >
                <PasswordInput
                  className={fieldClass(Boolean(showError("password")))}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={handlePasswordBlur}
                  autoComplete="new-password"
                  showLabel={t.login.showPassword}
                  hideLabel={t.login.hidePassword}
                  aria-invalid={Boolean(showError("password"))}
                />
              </Field>
            ) : (
              <Field
                label={t.accounts.resetPassword}
                hint={t.accounts.resetPasswordHint}
                error={showError("newPassword")}
                counter={`${newPassword.length}/${PASSWORD_MAX}`}
              >
                <PasswordInput
                  className={fieldClass(Boolean(showError("newPassword")))}
                  value={newPassword}
                  onChange={(e) => handleNewPasswordChange(e.target.value)}
                  onBlur={handleNewPasswordBlur}
                  autoComplete="new-password"
                  showLabel={t.login.showPassword}
                  hideLabel={t.login.hidePassword}
                  aria-invalid={Boolean(showError("newPassword"))}
                />
              </Field>
            )}
          </Section>

          {/* ───────── Role ───────── */}
          <Section
            title={t.accounts.sectionRole}
            description={t.accounts.sectionRoleDesc}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                className={`flex items-start gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                  role === "EDITOR"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : "border-[var(--color-border)]"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === "EDITOR"}
                  onChange={() => handleRoleChange("EDITOR")}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-semibold">
                    {t.accounts.roleEditor}
                  </div>
                  <div className="text-xs text-[var(--color-foreground-muted)]">
                    {t.accounts.roleEditorDesc}
                  </div>
                </div>
              </label>
              <label
                className={`flex items-start gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                  role === "ADMIN"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : "border-[var(--color-border)]"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === "ADMIN"}
                  onChange={() => handleRoleChange("ADMIN")}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-semibold">
                    {t.accounts.roleAdmin}
                  </div>
                  <div className="text-xs text-[var(--color-foreground-muted)]">
                    {t.accounts.roleAdminDesc}
                  </div>
                </div>
              </label>
            </div>
          </Section>

          {/* ───────── Permissions ───────── */}
          {role === "EDITOR" && (
            <Section
              title={t.accounts.sectionPermissions}
              description={t.accounts.sectionPermissionsDesc}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map((p) => {
                  const hasError = Boolean(showError("permissions"));
                  return (
                    <label
                      key={p}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition-colors hover:bg-[var(--color-background-soft)] ${
                        hasError
                          ? "border-red-300 dark:border-red-900/50"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={permissions.includes(p)}
                        onChange={() => togglePermission(p)}
                      />
                      <span className="text-sm">
                        {t.permission[p as keyof typeof t.permission]}
                      </span>
                    </label>
                  );
                })}
              </div>
              {showError("permissions") && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {showError("permissions")}
                </p>
              )}
            </Section>
          )}

          {serverError && (
            <div
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/50"
              role="alert"
            >
              {serverError}
            </div>
          )}
        </form>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-background-soft)] rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border rounded-lg text-sm font-medium bg-[var(--color-surface)]"
            style={{ borderColor: "var(--color-border)" }}
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            form="account-form"
            disabled={saving}
            className="py-2 px-4 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving
              ? t.common.saving
              : editing
              ? t.accounts.submitEdit
              : t.accounts.submitNew}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Helpers ─────────────── */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-[var(--color-foreground)]">
          {title}
        </h4>
        <p className="text-xs text-[var(--color-foreground-muted)]">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  counter,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-foreground-muted)]">
          {label}
        </span>
        {counter && (
          <span
            className={`text-[10px] font-mono ${
              error ? "text-red-500" : "text-[var(--color-foreground-light)]"
            }`}
          >
            {counter}
          </span>
        )}
      </div>
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