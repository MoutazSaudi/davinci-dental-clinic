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
  username: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .refine((value) => !value.includes("@"), {
      message: "Username must not be an email address",
    }),
  password: z.string().min(1).max(200),
});

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;
const fails = new Map<string, { count: number; first: number }>();

function throttleKey(req: Request, username: string) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `${ip}|${username}`;
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

const DUMMY_HASH =
  "00000000000000000000000000000000:AAAAAAAA";

export async function POST(req: Request) {
  if (!isAdminAuthEnabled()) {
    return NextResponse.json({ error: "auth_not_enabled" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const username = parsed.data.username.toLowerCase();
  const key = throttleKey(req, username);

  if (isBlocked(key)) {
    return NextResponse.json(
      { error: "too_many_attempts" },
      { status: 429 }
    );
  }

  const user = await prisma.adminUser.findUnique({ where: { username } });
  const ok = verifyPasswordRecord(
    parsed.data.password,
    user?.passwordHash ?? DUMMY_HASH
  );

  if (!user || !ok) {
    registerFail(key);
    return NextResponse.json(
      { error: "invalid_credentials" },
      { status: 401 }
    );
  }

  if (!user.isActive) {
    return NextResponse.json(
      { error: "account_disabled" },
      { status: 403 }
    );
  }

  fails.delete(key);

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const res = NextResponse.json({
    ok: true,
    mustChangePassword: user.mustChangePassword,
  });

  res.cookies.set({
    name: sessionCookieName(),
    value: signSession({ uid: user.id, role: user.role }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds(),
  });

  return res;
}