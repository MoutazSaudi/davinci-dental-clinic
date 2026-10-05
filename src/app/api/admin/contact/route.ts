import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب"),
  email: z.string().trim().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(5, "الرسالة قصيرة جداً"),
  locale: z.string().trim().default("ar"),
  serviceSlug: z.string().trim().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const contact = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
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