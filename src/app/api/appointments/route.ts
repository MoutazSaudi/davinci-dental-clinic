import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const appointmentSchema = z.object({
  patientName: z.string().trim().min(2, "Name is required."),
  patientPhone: z.string().trim().min(7, "Phone number is required."),
  patientEmail: z.string().trim().email().optional().or(z.literal("")),
  scheduledAt: z.string().trim().min(1, "Preferred date and time is required."),
  doctorId: z.string().trim().optional(),
  serviceSlug: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = appointmentSchema.parse(body);

    const scheduledAt = new Date(payload.scheduledAt);
    if (isNaN(scheduledAt.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid date format." },
        { status: 400 }
      );
    }

    const created = await prisma.appointment.create({
      data: {
        patientName: payload.patientName,
        patientPhone: payload.patientPhone,
        patientEmail: payload.patientEmail || null,
        scheduledAt,
        doctorId: payload.doctorId || null,
        serviceSlug: payload.serviceSlug || null,
        notes: payload.notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment request submitted successfully.",
        data: { id: created.id },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the form values and try again.",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit the appointment request right now.",
      },
      { status: 500 }
    );
  }
}