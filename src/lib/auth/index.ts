/**
 * Authentication abstraction placeholder.
 *
 * This file intentionally does not implement production authentication.
 * It exposes a small helper used by the admin layout to enforce an
 * authorization boundary until a real provider is configured.
 */

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "__adm_sess";

export function isAdminAuthEnabled() {
  return process.env.AUTH_ENABLED === "true";
}

function getAuthSecret() {
  const s = process.env.AUTH_SECRET;

  if (!s) {
    throw new Error(
      "AUTH_SECRET environment variable is required when AUTH_ENABLED=true",
    );
  }

  return s;
}

export function hashPassword(password: string, salt: string) {
  const key = crypto.scryptSync(password, salt, 64);
  return key.toString("base64");
}

export function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
) {
  try {
    const h = hashPassword(password, salt);

    return crypto.timingSafeEqual(
      Buffer.from(h),
      Buffer.from(expectedHash),
    );
  } catch {
    return false;
  }
}

export function signSession(payload: Record<string, unknown>) {
  const secret = getAuthSecret();

  const data = {
    ...payload,
    iat: Date.now(),
  };

  const raw = Buffer.from(JSON.stringify(data)).toString("base64url");

  const sig = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("base64url");

  return `${raw}.${sig}`;
}

export function verifySession(token: string | undefined) {
  if (!token) return null;

  try {
    const secret = getAuthSecret();
    const [raw, sig] = token.split(".");

    if (!raw || !sig) {
      return null;
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(raw)
      .digest("base64url");

    if (
      Buffer.byteLength(sig) !== Buffer.byteLength(expected) ||
      !crypto.timingSafeEqual(
        Buffer.from(sig),
        Buffer.from(expected),
      )
    ) {
      return null;
    }

    const data: unknown = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8"),
    );

    if (!data || typeof data !== "object") {
      return null;
    }

    const session = data as Record<string, unknown>;

    const issuedAt =
      typeof session.iat === "number" ? session.iat : 0;

    const maxAge = Number(
      process.env.AUTH_SESSION_MAX_AGE_SECONDS || 60 * 60 * 24,
    );

    if (Date.now() - issuedAt > maxAge * 1000) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function requireAdminServer() {
  // Use inside server components / layouts to guard the admin area.
  if (!isAdminAuthEnabled()) return;

  const ck = await cookies();
  const token = ck.get(SESSION_COOKIE_NAME)?.value;

  const session = verifySession(token);

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export function requireAdminFromRequest(req: Request) {
  // For route handlers: read cookie header and verify.
  if (!isAdminAuthEnabled()) return null;

  const cookieHeader = req.headers.get("cookie") || "";

  const match = cookieHeader.match(
    new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`),
  );

  const token = match ? decodeURIComponent(match[1]) : undefined;

  return verifySession(token);
}

export function sessionCookieName() {
  return SESSION_COOKIE_NAME;
}