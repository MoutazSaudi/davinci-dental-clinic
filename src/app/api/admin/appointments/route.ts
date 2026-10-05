import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const appointmentSchema = z.object({
  patientName: z.string().trim().min(2, "اسم المريض مطلوب"),
  patientPhone: z.string().trim().min(7, "رقم الهاتف مطلوب"),
  email: z.string().trim().email("البريد غير صحيح").optional().or(z.literal("")),
  notes: z.string().trim().optional(),
  date: z.union([z.string().trim(), z.date()]).optional(),
  scheduledAt: z.union([z.string().trim(), z.date()]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = appointmentSchema.parse(body);

    const reservationDate = validatedData.scheduledAt
      ? new Date(validatedData.scheduledAt)
      : validatedData.date
        ? new Date(validatedData.date)
        : new Date();

    const appointment = await prisma.appointment.create({
      data: {
        patientName: validatedData.patientName,
        patientPhone: validatedData.patientPhone,
        scheduledAt: reservationDate,
        notes: validatedData.notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء حجز الموعد" }, { status: 500 });
  }
}