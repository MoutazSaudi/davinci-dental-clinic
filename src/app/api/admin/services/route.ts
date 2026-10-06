export const dynamic = "force-dynamic";
export const revalidate = 0;

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

const localeTextSchema = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
});

const servicePayloadSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
  image: z.string().trim().min(1, "Image URL is required"),
  category: z.object({
    en: z.string().trim().min(1, "English category is required"),
    ar: z.string().trim().optional(),
  }),
  title: z.object({
    en: z.string().trim().min(1, "English title is required"),
    ar: z.string().trim().optional(),
  }),
  shortDescription: localeTextSchema.optional(),
  description: localeTextSchema.optional(),
  highlight: z.object({
    en: z.array(z.string()).optional(),
    ar: z.array(z.string()).optional(),
  }).optional(),
  sourceUrl: z.string().trim().optional(),
  sourceUrlEn: z.string().trim().optional(),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "service";

const getLocaleText = <T extends { locale: string; name?: string }>(items: T[], locale: string) =>
  items.find((entry) => entry.locale === locale)?.name ?? items[0]?.name ?? "";

const getServiceTranslation = <T extends { locale: string }>(items: T[], locale: string) =>
  items.find((entry) => entry.locale === locale) ?? items[0] ?? null;

const serializeService = (service: {
  slug: string;
  image: string;
  sourceUrl: string | null;
  sourceUrlEn: string | null;
  category: { translations: { locale: string; name: string }[] };
  translations: Array<{
    locale: string;
    title: string;
    shortDescription: string | null;
    description: string | null;
    highlights: string[];
  }>;
}) => {
  const categoryEn = getLocaleText(service.category.translations, "en");
  const categoryAr = getLocaleText(service.category.translations, "ar");

  const enTranslation = getServiceTranslation(service.translations, "en") as
    | { locale: string; title: string; shortDescription: string | null; description: string | null; highlights: string[] }
    | null;
  const arTranslation = getServiceTranslation(service.translations, "ar") as
    | { locale: string; title: string; shortDescription: string | null; description: string | null; highlights: string[] }
    | null;

  return {
    slug: service.slug,
    category: {
      en: categoryEn,
      ar: categoryAr,
    },
    title: {
      en: enTranslation?.title ?? "",
      ar: arTranslation?.title ?? "",
    },
    shortDescription: {
      en: enTranslation?.shortDescription ?? "",
      ar: arTranslation?.shortDescription ?? "",
    },
    description: {
      en: enTranslation?.description ?? "",
      ar: arTranslation?.description ?? "",
    },
    image: service.image,
    sourceUrl: service.sourceUrl ?? "",
    sourceUrlEn: service.sourceUrlEn ?? "",
    highlight: {
      en: enTranslation?.highlights ?? [],
      ar: arTranslation?.highlights ?? [],
    },
  };
};

async function ensureCategory(categoryName: string, localeName?: string) {
  const safeName = categoryName.trim() || "General";
  const slug = slugify(safeName);

  const category = await prisma.serviceCategory.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      translations: {
        create: [
          { locale: "en", name: safeName },
          ...(localeName && localeName.trim() ? [{ locale: "ar", name: localeName.trim() }] : []),
        ],
      },
    },
    include: { translations: true },
  });

  const texts = [
    { locale: "en", name: safeName },
    ...(localeName && localeName.trim() ? [{ locale: "ar", name: localeName.trim() }] : []),
  ];

  for (const text of texts) {
    await prisma.serviceCategoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: category.id, locale: text.locale } },
      update: { name: text.name },
      create: { categoryId: category.id, locale: text.locale, name: text.name },
    });
  }

  return category;
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const services = await prisma.service.findMany({
    include: {
      category: { include: { translations: true } },
      translations: true,
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(services.map(serializeService));
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const payload = servicePayloadSchema.parse(body);
    const category = await ensureCategory(payload.category.en, payload.category.ar);
    const titleEn = payload.title.en.trim();
    const titleAr = payload.title.ar?.trim() || titleEn;
    const descriptionEn = payload.description?.en?.trim() ?? titleEn;
    const descriptionAr = payload.description?.ar?.trim() ?? titleAr;
    const shortDescriptionEn = payload.shortDescription?.en?.trim() ?? descriptionEn;
    const shortDescriptionAr = payload.shortDescription?.ar?.trim() ?? descriptionAr;
    const slug = payload.slug.trim() || slugify(titleEn);

    const service = await prisma.service.create({
      data: {
        slug,
        categoryId: category.id,
        image: payload.image,
        sourceUrl: payload.sourceUrl || null,
        sourceUrlEn: payload.sourceUrlEn || payload.sourceUrl || null,
        translations: {
          create: [
            {
              locale: "en",
              title: titleEn,
              shortDescription: shortDescriptionEn,
              description: descriptionEn,
              highlights: payload.highlight?.en ?? [],
              rich: payload.highlight ? { en: payload.highlight.en ?? [], ar: payload.highlight.ar ?? [] } : null,
            },
            {
              locale: "ar",
              title: titleAr,
              shortDescription: shortDescriptionAr,
              description: descriptionAr,
              highlights: payload.highlight?.ar ?? payload.highlight?.en ?? [],
              rich: payload.highlight ? { en: payload.highlight.en ?? [], ar: payload.highlight.ar ?? [] } : null,
            },
          ],
        },
      },
      include: {
        category: { include: { translations: true } },
        translations: true,
      },
    });

    revalidatePath("/services");
    revalidatePath("/");
    return NextResponse.json(serializeService(service), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create service" }, { status: 500 });
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
    const slug = url.searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Missing service slug" }, { status: 400 });

    const body = await req.json();
    const payload = servicePayloadSchema.parse(body);
    const category = await ensureCategory(payload.category.en, payload.category.ar);
    const titleEn = payload.title.en.trim();
    const titleAr = payload.title.ar?.trim() || titleEn;
    const descriptionEn = payload.description?.en?.trim() ?? titleEn;
    const descriptionAr = payload.description?.ar?.trim() ?? titleAr;
    const shortDescriptionEn = payload.shortDescription?.en?.trim() ?? descriptionEn;
    const shortDescriptionAr = payload.shortDescription?.ar?.trim() ?? descriptionAr;

    const service = await prisma.service.update({
      where: { slug },
      data: {
        categoryId: category.id,
        image: payload.image,
        sourceUrl: payload.sourceUrl || null,
        sourceUrlEn: payload.sourceUrlEn || payload.sourceUrl || null,
        slug: payload.slug.trim() || slug,
        translations: {
          upsert: [
            {
              where: { serviceId_locale: { serviceId: (await prisma.service.findUnique({ where: { slug }, select: { id: true } }))?.id ?? "", locale: "en" } },
              update: {
                title: titleEn,
                shortDescription: shortDescriptionEn,
                description: descriptionEn,
                highlights: payload.highlight?.en ?? [],
                rich: payload.highlight ? { en: payload.highlight.en ?? [], ar: payload.highlight.ar ?? [] } : null,
              },
              create: {
                locale: "en",
                title: titleEn,
                shortDescription: shortDescriptionEn,
                description: descriptionEn,
                highlights: payload.highlight?.en ?? [],
                rich: payload.highlight ? { en: payload.highlight.en ?? [], ar: payload.highlight.ar ?? [] } : null,
              },
            },
            {
              where: { serviceId_locale: { serviceId: (await prisma.service.findUnique({ where: { slug }, select: { id: true } }))?.id ?? "", locale: "ar" } },
              update: {
                title: titleAr,
                shortDescription: shortDescriptionAr,
                description: descriptionAr,
                highlights: payload.highlight?.ar ?? payload.highlight?.en ?? [],
                rich: payload.highlight ? { en: payload.highlight.en ?? [], ar: payload.highlight.ar ?? [] } : null,
              },
              create: {
                locale: "ar",
                title: titleAr,
                shortDescription: shortDescriptionAr,
                description: descriptionAr,
                highlights: payload.highlight?.ar ?? payload.highlight?.en ?? [],
                rich: payload.highlight ? { en: payload.highlight.en ?? [], ar: payload.highlight.ar ?? [] } : null,
              },
            },
          ],
        },
      },
      include: {
        category: { include: { translations: true } },
        translations: true,
      },
    });

    revalidatePath("/services");
    revalidatePath("/");
    return NextResponse.json(serializeService(service));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to update service" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing service slug" }, { status: 400 });

  await prisma.service.delete({ where: { slug } }).catch(() => null);
  revalidatePath("/services");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
