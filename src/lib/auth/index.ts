/**
 * Admin authentication (signed cookie session + AdminUser table).
 */
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { APPOINTMENT_PERMISSIONS } from "@/lib/appointments/policy";

export { createPasswordRecord, verifyPasswordRecord } from "./password";

const SESSION_COOKIE_NAME = "__adm_sess";

export type AdminRole = "ADMIN" | "EDITOR";

export type AdminPermission =
  | "OVERVIEW"
  | (typeof APPOINTMENT_PERMISSIONS)[number]
  | "APPOINTMENTS"
  | "MESSAGES"
  | "DOCTORS"
  | "GALLERY"
  | "FAQ"
  | "SERVICES";

export const ALL_PERMISSIONS: AdminPermission[] = [
  "OVERVIEW",
  "APPOINTMENTS",
  ...APPOINTMENT_PERMISSIONS,
  "MESSAGES",
  "DOCTORS",
  "GALLERY",
  "FAQ",
  "SERVICES",
];

export type AdminSession = {
  uid: string;
  role: AdminRole;
  iat: number;
};

export type AdminUserPublic = {
  id: string;
  username: string;
  doctorId: string | null;
  name: string | null;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
  mustChangePassword: boolean;
};

export type AdminSessionWithUser = AdminSession & { user: AdminUserPublic };

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
  return crypto
    .createHmac("sha256", getAuthSecret())
    .update(raw)
    .digest("base64url");
}

export function signSession(payload: Omit<AdminSession, "iat">) {
  const data: AdminSession = { ...payload, iat: Date.now() };
  const raw = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${raw}.${sign(raw)}`;
}

export function verifySession(
  token: string | undefined
): AdminSession | null {
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

    const data = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8")
    ) as Partial<AdminSession>;

    if (
      typeof data.uid !== "string" ||
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
    return { uid: "dev", role: "ADMIN", iat: Date.now() };
  }
  const ck = await cookies();
  return verifySession(ck.get(SESSION_COOKIE_NAME)?.value);
}

/* ───────────────────────── User loading ───────────────────────── */

function devUser(): AdminUserPublic {
  return {
    id: "dev",
    username: "dev",
    doctorId: null,
    name: "Dev Admin",
    role: "ADMIN",
    permissions: ALL_PERMISSIONS,
    isActive: true,
    mustChangePassword: false,
  };
}

export async function getAdminUser(): Promise<AdminUserPublic | null> {
  if (!isAdminAuthEnabled()) return devUser();

  const session = await getAdminSession();
  if (!session) return null;

  const user = await prisma.adminUser.findUnique({
    where: { id: session.uid },
  });
  if (!user || !user.isActive) return null;

  return {
    id: user.id,
    username: user.username,
    doctorId: user.doctorId,
    name: user.name,
    role: user.role as AdminRole,
    permissions: user.permissions as AdminPermission[],
    isActive: user.isActive,
    mustChangePassword: user.mustChangePassword,
  };
}

/* ───────────────────────── Permission helpers ───────────────────────── */

export function hasPermission(
  user: AdminUserPublic,
  permission: AdminPermission
): boolean {
  if (user.role === "ADMIN") return true;
  return user.permissions.includes(permission);
}

export function getDefaultAdminRoute(user: AdminUserPublic): string {
  if (user.role === "ADMIN") return "/admin";
  const order: AdminPermission[] = [
    "OVERVIEW",
    "APPOINTMENTS",
    "MESSAGES",
    "DOCTORS",
    "GALLERY",
    "FAQ",
    "SERVICES",
  ];
  for (const p of order) {
    if (user.permissions.includes(p)) {
      return p === "OVERVIEW" ? "/admin" : `/admin/${p.toLowerCase()}`;
    }
  }
  return "/admin/settings";
}

/* ───────────────────────── Server components ───────────────────────── */

export async function requireAdminServer(): Promise<AdminSessionWithUser> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const user = await getAdminUser();
  if (!user) redirect("/admin/login?reason=disabled");

  return { ...session, user };
}

export async function requirePermissionServer(
  permission: AdminPermission
): Promise<AdminSessionWithUser> {
  const s = await requireAdminServer();
  if (!hasPermission(s.user, permission)) {
    redirect("/admin/forbidden");
  }
  return s;
}

export async function requireAdminRoleServer(): Promise<AdminSessionWithUser> {
  const s = await requireAdminServer();
  if (s.user.role !== "ADMIN") redirect("/admin/forbidden");
  return s;
}

/* ───────────────────────── Route handlers ───────────────────────── */

export async function requireAdminApi(): Promise<
  AdminSessionWithUser | NextResponse
> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { error: "account_disabled" },
      { status: 401 }
    );
  }

  return { ...session, user };
}

export async function requirePermissionApi(
  permission: AdminPermission
): Promise<AdminSessionWithUser | NextResponse> {
  const s = await requireAdminApi();
  if (s instanceof NextResponse) return s;
  if (!hasPermission(s.user, permission)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return s;
}

export async function requireAdminRoleApi(): Promise<
  AdminSessionWithUser | NextResponse
> {
  const s = await requireAdminApi();
  if (s instanceof NextResponse) return s;
  if (s.user.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return s;
}

export async function requireAdminFromRequest() {
  return requireAdminApi();
}