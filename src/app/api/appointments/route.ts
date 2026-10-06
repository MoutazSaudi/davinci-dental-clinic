import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").optional(),
  patientName: z.string().trim().min(2, "Name is required.").optional(),
  phone: z.string().trim().min(7, "Phone number is required.").optional().or(z.literal("")),
  patientPhone: z.string().trim().min(7, "Phone number is required.").optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  message: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  date: z.string().trim().optional(),
  scheduledAt: z.union([z.string().trim(), z.date()]).optional(),
  locale: z.string().trim().default("ar"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = appointmentSchema.parse(body);

    const patientName = (payload.patientName ?? payload.name ?? "Patient").trim();
    const patientPhone = (payload.patientPhone ?? payload.phone ?? "").trim();
    const notes = (payload.notes ?? payload.message ?? "").trim();
    const scheduledAt = payload.scheduledAt
      ? new Date(payload.scheduledAt)
      : payload.date
        ? new Date(payload.date)
        : new Date();

    if (!patientName) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid patient name.",
        },
        { status: 400 },
      );
    }

    if (patientPhone && patientPhone.length < 7) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid phone number.",
        },
        { status: 400 },
      );
    }

    const created = await prisma.appointment.create({
      data: {
        patientName,
        patientPhone,
        scheduledAt,
        notes: notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment request submitted successfully.",
        data: { id: created.id },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the form values and try again.",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit the appointment request right now.",
      },
      { status: 500 },
    );
  }
}
