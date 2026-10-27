import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import {
  requireAdminApi,
  createPasswordRecord,
  verifyPasswordRecord,
} from "@/lib/auth";

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.adminUser.findUnique({ where: { id: auth.uid } });
  if (!user) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  if (!verifyPasswordRecord(currentPassword, user.passwordHash)) {
    return NextResponse.json({ error: "wrong_current_password" }, { status: 400 });
  }

  if (verifyPasswordRecord(newPassword, user.passwordHash)) {
    return NextResponse.json({ error: "same_password" }, { status: 400 });
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: createPasswordRecord(newPassword) },
  });

  return NextResponse.json({ ok: true });
}