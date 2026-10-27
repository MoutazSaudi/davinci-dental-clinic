export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

const patchSchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"])
    .optional(),
  doctorId: z.string().nullable().optional(),
  notes: z.string().optional(),
});

type AppointmentWithDoctor = {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  scheduledAt: Date;
  status: string;
  notes: string | null;
  serviceSlug: string | null;
  createdAt: Date;
  updatedAt: Date;
  doctor: {
    id: string;
    slug: string;
    translations: Array<{ locale: string; name: string }>;
  } | null;
};

function serialize(a: AppointmentWithDoctor) {
  const en = a.doctor?.translations.find((t) => t.locale === "en");
  const ar = a.doctor?.translations.find((t) => t.locale === "ar");

  return {
    id: a.id,
    patientName: a.patientName,
    patientPhone: a.patientPhone,
    patientEmail: a.patientEmail,
    scheduledAt: a.scheduledAt.toISOString(),
    status: a.status,
    notes: a.notes,
    serviceSlug: a.serviceSlug,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    doctor: a.doctor
      ? {
          id: a.doctor.id,
          slug: a.doctor.slug,
          name: {
            en: en?.name ?? ar?.name ?? "",
            ar: ar?.name ?? en?.name ?? "",
          },
        }
      : null,
  };
}

const includeDoctor = {
  doctor: {
    include: { translations: true },
  },
};

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const items = await prisma.appointment.findMany({
    include: includeDoctor,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items.map(serialize));
}

export async function PATCH(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const body = await req.json();
    const payload = patchSchema.parse(body);

    const data: Record<string, unknown> = {};
    if (payload.status !== undefined) data.status = payload.status;
    if (payload.doctorId !== undefined)
      data.doctorId = payload.doctorId || null;
    if (payload.notes !== undefined) data.notes = payload.notes || null;

    const updated = await prisma.appointment.update({
      where: { id },
      data,
      include: includeDoctor,
    });

    return NextResponse.json(serialize(updated));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.appointment.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}