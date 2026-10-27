export const dynamic = "force-dynamic";
export const revalidate = 0;

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

const doctorSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
  name: z.object({
    en: z.string().trim().min(1, "English name is required"),
    ar: z.string().trim().min(1, "Arabic name is required"),
  }),
  specialization: z.object({
    en: z.string().trim().optional(),
    ar: z.string().trim().optional(),
  }),
  bio: z.object({
    en: z.string().trim().optional(),
    ar: z.string().trim().optional(),
  }),
  image: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  sortOrder: z.number().int().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

type DoctorWithRelations = {
  id: string;
  slug: string;
  image: string | null;
  instagram: string | null;
  linkedin: string | null;
  sortOrder: number;
  status: string;
  translations: Array<{
    locale: string;
    name: string;
    specialization: string | null;
    bio: string | null;
  }>;
};

function serialize(d: DoctorWithRelations) {
  const en = d.translations.find((t) => t.locale === "en");
  const ar = d.translations.find((t) => t.locale === "ar");
  return {
    id: d.id,
    slug: d.slug,
    name: { en: en?.name ?? "", ar: ar?.name ?? "" },
    specialization: {
      en: en?.specialization ?? "",
      ar: ar?.specialization ?? "",
    },
    bio: { en: en?.bio ?? "", ar: ar?.bio ?? "" },
    image: d.image,
    instagram: d.instagram,
    linkedin: d.linkedin,
    sortOrder: d.sortOrder,
    status: d.status,
  };
}

const includeAll = { translations: true };

function revalidateDoctors() {
  revalidatePath("/ar/doctors");
  revalidatePath("/en/doctors");
}

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const doctors = await prisma.doctor.findMany({
    include: includeAll,
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(doctors.map(serialize));
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const p = doctorSchema.parse(body);

    const doctor = await prisma.doctor.create({
      data: {
        slug: p.slug,
        image: p.image || null,
        instagram: p.instagram || null,
        linkedin: p.linkedin || null,
        sortOrder: p.sortOrder ?? 0,
        status: p.status ?? "PUBLISHED",
        translations: {
          create: [
            {
              locale: "en",
              name: p.name.en,
              specialization: p.specialization.en || null,
              bio: p.bio.en || null,
            },
            {
              locale: "ar",
              name: p.name.ar,
              specialization: p.specialization.ar || null,
              bio: p.bio.ar || null,
            },
          ],
        },
      },
      include: includeAll,
    });

    revalidateDoctors();
    return NextResponse.json(serialize(doctor), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to create doctor" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  return PUT(req);
}

export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const body = await req.json();
    const p = doctorSchema.parse(body);

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        slug: p.slug,
        image: p.image || null,
        instagram: p.instagram || null,
        linkedin: p.linkedin || null,
        sortOrder: p.sortOrder ?? 0,
        status: p.status ?? "PUBLISHED",
        translations: {
          upsert: [
            {
              where: { doctorId_locale: { doctorId: id, locale: "en" } },
              update: {
                name: p.name.en,
                specialization: p.specialization.en || null,
                bio: p.bio.en || null,
              },
              create: {
                locale: "en",
                name: p.name.en,
                specialization: p.specialization.en || null,
                bio: p.bio.en || null,
              },
            },
            {
              where: { doctorId_locale: { doctorId: id, locale: "ar" } },
              update: {
                name: p.name.ar,
                specialization: p.specialization.ar || null,
                bio: p.bio.ar || null,
              },
              create: {
                locale: "ar",
                name: p.name.ar,
                specialization: p.specialization.ar || null,
                bio: p.bio.ar || null,
              },
            },
          ],
        },
      },
      include: includeAll,
    });

    revalidateDoctors();
    return NextResponse.json(serialize(doctor));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to update doctor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.doctor.delete({ where: { id } }).catch(() => null);
  revalidateDoctors();
  return NextResponse.json({ ok: true });
}