export const dynamic = "force-dynamic";
export const revalidate = 0;

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

const doctorSchema = z.object({
  name: z.string().trim().min(1, "Doctor name is required"),
  specialty: z.string().trim().min(1, "Specialty is required").optional(),
  image: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "doctor";

const getLocaleValue = (items: { locale: string; name: string; specialization: string | null }[], locale: string) => {
  const item = items.find((entry) => entry.locale === locale) ?? items[0];
  return item ? { name: item.name, specialization: item.specialization ?? "" } : { name: "", specialization: "" };
};

const serializeDoctor = (doctor: {
  id: string;
  slug: string;
  image: string | null;
  instagram: string | null;
  linkedin: string | null;
  translations: { locale: string; name: string; specialization: string | null }[];
}) => {
  const en = getLocaleValue(doctor.translations, "en");
  const ar = getLocaleValue(doctor.translations, "ar");

  return {
    id: doctor.id,
    slug: doctor.slug,
    name: en.name || ar.name,
    specialty: en.specialization || ar.specialization || "",
    image: doctor.image || "/images/doctors/default-doctor.jpg",
    instagram: doctor.instagram,
    linkedin: doctor.linkedin,
    translations: {
      en: { name: en.name, specialization: en.specialization },
      ar: { name: ar.name, specialization: ar.specialization },
    },
  };
};

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const doctors = await prisma.doctor.findMany({
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(doctors.map(serializeDoctor));
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const payload = doctorSchema.parse(body);
    const doctorName = payload.name.trim();
    const slug = payload.slug?.trim() || slugify(doctorName);
    const specialty = payload.specialty?.trim() || "General Dentist";

    const doctor = await prisma.doctor.create({
      data: {
        slug,
        image: payload.image || null,
        instagram: payload.instagram || null,
        linkedin: payload.linkedin || null,
        translations: {
          create: [
            { locale: "en", name: doctorName, specialization: specialty },
            { locale: "ar", name: doctorName, specialization: specialty },
          ],
        },
      },
      include: { translations: true },
    });

    revalidatePath("/doctors");
    return NextResponse.json(serializeDoctor(doctor), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create doctor" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  return PUT(req);
}

export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing doctor id" }, { status: 400 });

    const body = await req.json();
    const payload = doctorSchema.parse(body);
    const doctorName = payload.name.trim();
    const slug = payload.slug?.trim() || slugify(doctorName);
    const specialty = payload.specialty?.trim() || "General Dentist";

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        slug,
        image: payload.image || null,
        instagram: payload.instagram || null,
        linkedin: payload.linkedin || null,
        translations: {
          upsert: [
            {
              where: { doctorId_locale: { doctorId: id, locale: "en" } },
              update: { name: doctorName, specialization: specialty },
              create: { locale: "en", name: doctorName, specialization: specialty },
            },
            {
              where: { doctorId_locale: { doctorId: id, locale: "ar" } },
              update: { name: doctorName, specialization: specialty },
              create: { locale: "ar", name: doctorName, specialization: specialty },
            },
          ],
        },
      },
      include: { translations: true },
    });

    revalidatePath("/doctors");
    return NextResponse.json(serializeDoctor(doctor));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to update doctor" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing doctor id" }, { status: 400 });

  await prisma.doctor.delete({ where: { id } }).catch(() => null);
  revalidatePath("/doctors");
  return NextResponse.json({ ok: true });
}
