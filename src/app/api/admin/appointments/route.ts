export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminFromRequest } from "@/lib/auth";

const appointmentSchema = z.object({
  patientName: z.string().trim().min(2, "اسم المريض مطلوب").optional(),
  patientPhone: z.string().trim().min(7, "رقم الهاتف مطلوب").optional(),
  phone: z.string().trim().min(7, "رقم الهاتف مطلوب").optional(),
  email: z.string().trim().email("البريد غير صحيح").optional().or(z.literal("")),
  notes: z.string().trim().optional(),
  date: z.union([z.string().trim(), z.date()]).optional(),
  scheduledAt: z.union([z.string().trim(), z.date()]).optional(),
  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELLED", "pending", "confirmed", "cancelled"])
    .optional(),
});

const normalizeStatus = (value: string) => value.toUpperCase() as "PENDING" | "CONFIRMED" | "CANCELLED";

const serializeAppointment = (item: {
  id: string;
  patientName: string;
  patientPhone: string;
  scheduledAt: Date;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: item.id,
  patientName: item.patientName,
  phone: item.patientPhone,
  service: null,
  doctor: null,
  date: item.scheduledAt.toISOString(),
  status: item.status.toLowerCase(),
  notes: item.notes,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export async function GET(req: Request) {
  const auth = await requireAdminFromRequest();
  if (auth instanceof NextResponse) return auth;

  const items = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items.map(serializeAppointment));
}

export async function POST(req: Request) {
  const auth = await requireAdminFromRequest();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validatedData = appointmentSchema.parse(body);

    const patientName = validatedData.patientName?.trim() || "Patient";
    const patientPhone = (validatedData.patientPhone ?? validatedData.phone ?? "").trim();
    const reservationDate = validatedData.scheduledAt
      ? new Date(validatedData.scheduledAt)
      : validatedData.date
        ? new Date(validatedData.date)
        : new Date();

    const normalizedStatus = normalizeStatus(validatedData.status ?? "PENDING");

    const data = await prisma.appointment.create({
      data: {
        patientName,
        patientPhone,
        scheduledAt: reservationDate,
        notes: validatedData.notes || null,
        status: normalizedStatus,
      },
    });

    return NextResponse.json(serializeAppointment(data), { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create appointment" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireAdminFromRequest();
  if (auth instanceof NextResponse) return auth;

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing appointment id" }, { status: 400 });

    const body = await req.json();
    const validatedData = appointmentSchema.partial().parse(body);
    const status = validatedData.status;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const normalizedStatus = normalizeStatus(status);

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: normalizedStatus },
    });

    return NextResponse.json(serializeAppointment(appointment));
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to update appointment" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminFromRequest();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing appointment id" }, { status: 400 });

  await prisma.appointment.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
