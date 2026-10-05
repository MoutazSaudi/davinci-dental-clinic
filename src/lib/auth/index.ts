/**
 * Admin authentication (signed cookie session + AdminUser table).
 *
 * - Auth is ALWAYS on in production. In development it is on unless AUTH_ENABLED=false.
 * - Pages/layouts: `await requireAdminServer()`
 * - Route handlers:  const auth = await requireAdminApi(); if (auth instanceof NextResponse) return auth;
 *
 * NOTE: layouts are not re-rendered on client-side navigation, so every admin API
 * route handler must call requireAdminApi() itself. Never rely on the layout alone.
 */
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export { createPasswordRecord, verifyPasswordRecord } from "./password";

const SESSION_COOKIE_NAME = "__adm_sess";

export type AdminRole = "ADMIN" | "EDITOR";

export type AdminSession = {
  uid: string;
  email: string;
  role: AdminRole;
  iat: number;
};

export function isAdminAuthEnabled() {
  if (process.env.NODE_ENV === "production") return true;
  return process.env.AUTH_ENABLED !== "false";
}

export function sessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function sessionMaxAgeSeconds() {
  const n = Number(process.env.AUTH_SESSION_MAX_AGE_SECONDS);
  return Number.isFinite(n) && n > 0 ? n : 60 * 60 * 24;
}

function getAuthSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters long.");
  }
  return s;
}

function sign(raw: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(raw).digest("base64url");
}

export function signSession(payload: Omit<AdminSession, "iat">) {
  const data: AdminSession = { ...payload, iat: Date.now() };
  const raw = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${raw}.${sign(raw)}`;
}

export function verifySession(token: string | undefined): AdminSession | null {
  if (!token) return null;

  try {
    const [raw, sig] = token.split(".");
    if (!raw || !sig) return null;

    const expected = sign(raw);
    if (
      Buffer.byteLength(sig) !== Buffer.byteLength(expected) ||
      !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    ) {
      return null;
    }

    const data = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Partial<AdminSession>;

    if (
      typeof data.uid !== "string" ||
      typeof data.email !== "string" ||
      (data.role !== "ADMIN" && data.role !== "EDITOR") ||
      typeof data.iat !== "number"
    ) {
      return null;
    }

    if (Date.now() - data.iat > sessionMaxAgeSeconds() * 1000) return null;

    return data as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isAdminAuthEnabled()) {
    return { uid: "dev", email: "dev@localhost", role: "ADMIN", iat: Date.now() };
  }

  const ck = await cookies();
  return verifySession(ck.get(SESSION_COOKIE_NAME)?.value);
}

/** For server components / layouts: redirects to the login page when not signed in. */
export async function requireAdminServer(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** For route handlers: returns the session, or a 401 response to return immediately. */
export async function requireAdminApi(): Promise<AdminSession | NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return session;
}
