import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import {
  isAdminAuthEnabled,
  sessionCookieName,
  sessionMaxAgeSeconds,
  signSession,
  verifyPasswordRecord,
} from "@/lib/auth";

const bodySchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

// Simple in-memory throttle (per server instance): 5 failed attempts / 15 min per IP+email.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;
const fails = new Map<string, { count: number; first: number }>();

function throttleKey(req: Request, email: string) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `${ip}|${email}`;
}

function isBlocked(key: string) {
  const entry = fails.get(key);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    fails.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILS;
}

function registerFail(key: string) {
  const entry = fails.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS) {
    fails.set(key, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
}

// Used to keep response time similar when the email does not exist.
const DUMMY_HASH = "00000000000000000000000000000000:AAAAAAAA";

export async function POST(req: Request) {
  if (!isAdminAuthEnabled()) {
    return NextResponse.json({ error: "auth_not_enabled" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const key = throttleKey(req, email);

  if (isBlocked(key)) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  const ok = verifyPasswordRecord(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !ok) {
    registerFail(key);
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  fails.delete(key);

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: sessionCookieName(),
    value: signSession({ uid: user.id, email: user.email, role: user.role }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds(),
  });
  return res;
}
