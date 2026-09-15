import { NextResponse } from "next/server";
import { sessionCookieName, isAdminAuthEnabled } from "@/lib/auth";

export async function POST() {
  if (!isAdminAuthEnabled()) {
    return NextResponse.json({ error: "auth_not_enabled" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: sessionCookieName(), value: "", path: "/", maxAge: 0 });
  return res;
}
