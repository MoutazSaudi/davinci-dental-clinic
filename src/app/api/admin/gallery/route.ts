export const dynamic = "force-dynamic";
export const revalidate = 0;

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

const gallerySchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
  title: z.object({
    en: z.string().trim().min(1, "English title is required"),
    ar: z.string().trim().min(1, "Arabic title is required"),
  }),
  category: z.object({
    en: z.string().trim().min(1, "English category is required"),
    ar: z.string().trim().min(1, "Arabic category is required"),
  }),
  description: z.object({
    en: z.string().trim().optional(),
    ar: z.string().trim().optional(),
  }),
  images: z.array(z.string().trim().min(1)).min(1, "At least one image is required"),
  sortOrder: z.number().int().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

type AlbumWithRelations = {
  id: string;
  slug: string;
  sortOrder: number;
  status: string;
  translations: Array<{
    locale: string;
    title: string;
    category: string;
    description: string | null;
  }>;
  images: Array<{ url: string; sortOrder: number }>;
};

function serialize(album: AlbumWithRelations) {
  const en = album.translations.find((t) => t.locale === "en");
  const ar = album.translations.find((t) => t.locale === "ar");
  return {
    id: album.id,
    slug: album.slug,
    title: { en: en?.title ?? "", ar: ar?.title ?? "" },
    category: { en: en?.category ?? "", ar: ar?.category ?? "" },
    description: { en: en?.description ?? "", ar: ar?.description ?? "" },
    images: [...album.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((i) => i.url),
    sortOrder: album.sortOrder,
    status: album.status,
  };
}

const includeAll = {
  translations: true,
  images: { orderBy: { sortOrder: "asc" as const } },
};

function revalidateGallery() {
  revalidatePath("/gallery");
  revalidatePath("/ar/gallery");
  revalidatePath("/en/gallery");
}

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const albums = await prisma.galleryAlbum.findMany({
    include: includeAll,
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(albums.map(serialize));
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const payload = gallerySchema.parse(body);

    const album = await prisma.galleryAlbum.create({
      data: {
        slug: payload.slug,
        sortOrder: payload.sortOrder ?? 0,
        status: payload.status ?? "PUBLISHED",
        translations: {
          create: [
            {
              locale: "en",
              title: payload.title.en,
              category: payload.category.en,
              description: payload.description.en || null,
            },
            {
              locale: "ar",
              title: payload.title.ar,
              category: payload.category.ar,
              description: payload.description.ar || null,
            },
          ],
        },
        images: {
          create: payload.images.map((url, i) => ({ url, sortOrder: i })),
        },
      },
      include: includeAll,
    });

    revalidateGallery();
    return NextResponse.json(serialize(album), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to create gallery album" },
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

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const body = await req.json();
    const payload = gallerySchema.parse(body);

    // Replace images entirely to honor the new order and removals.
    await prisma.galleryImage.deleteMany({ where: { albumId: id } });

    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: {
        slug: payload.slug,
        sortOrder: payload.sortOrder ?? 0,
        status: payload.status ?? "PUBLISHED",
        translations: {
          upsert: [
            {
              where: { albumId_locale: { albumId: id, locale: "en" } },
              update: {
                title: payload.title.en,
                category: payload.category.en,
                description: payload.description.en || null,
              },
              create: {
                locale: "en",
                title: payload.title.en,
                category: payload.category.en,
                description: payload.description.en || null,
              },
            },
            {
              where: { albumId_locale: { albumId: id, locale: "ar" } },
              update: {
                title: payload.title.ar,
                category: payload.category.ar,
                description: payload.description.ar || null,
              },
              create: {
                locale: "ar",
                title: payload.title.ar,
                category: payload.category.ar,
                description: payload.description.ar || null,
              },
            },
          ],
        },
        images: {
          create: payload.images.map((url, i) => ({ url, sortOrder: i })),
        },
      },
      include: includeAll,
    });

    revalidateGallery();
    return NextResponse.json(serialize(album));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to update gallery album" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.galleryAlbum.delete({ where: { id } }).catch(() => null);
  revalidateGallery();
  return NextResponse.json({ ok: true });
}