export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminFromRequest } from "@/lib/auth";

const contactSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب"),
  email: z.string().trim().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(5, "الرسالة قصيرة جداً"),
  locale: z.string().trim().default("ar"),
  serviceSlug: z.string().trim().optional(),
});

const patchMessageSchema = z.object({
  status: z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]).optional(),
});

export async function GET(req: Request) {
  const auth = await requireAdminFromRequest();
  if (auth instanceof NextResponse) return auth;

  const items = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const auth = await requireAdminFromRequest();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const contact = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || "",
        message: validatedData.message,
        locale: validatedData.locale || "ar",
        serviceSlug: validatedData.serviceSlug || null,
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء حفظ الرسالة" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireAdminFromRequest();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing message id" }, { status: 400 });

  try {
    const body = await req.json();
    const validatedData = patchMessageSchema.parse(body);

    if (!validatedData.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: validatedData.status },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update message" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminFromRequest();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing message id" }, { status: 400 });

  await prisma.contactMessage.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
