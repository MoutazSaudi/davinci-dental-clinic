/**
 * Seeds the database from the existing mock data, unchanged.
 * Safe to re-run: existing rows (and any edits made from the dashboard) are not overwritten.
 *
 *   pnpm db:seed
 *
 * Required env: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD (min 10 chars)
 */
import { Prisma, PrismaClient } from "@prisma/client";
import servicesRichRaw from "../src/data/mock/services-rich.json";
import { doctorCatalog } from "../src/data/mock/doctors";
import { faqCatalog } from "../src/data/mock/faq";
import { galleryServices } from "../src/data/mock/gallery";
import { getCategorySlug, serviceCatalog } from "../src/data/mock/services";
import { createPasswordRecord } from "../src/lib/auth/password";

const prisma = new PrismaClient();
const LOCALES = ["ar", "en"] as const;

type RichByLocale = Record<string, Partial<Record<"ar" | "en", unknown>>>;
const servicesRich = servicesRichRaw as unknown as RichByLocale;

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env before seeding.");
  }
  if (password.length < 10) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 10 characters.");
  }

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, name: "Admin", role: "ADMIN", passwordHash: createPasswordRecord(password) },
  });
  console.log(`Admin user ready: ${email}`);
}

async function seedServices() {
  // Categories, in order of first appearance in the catalog
  const categoryIds = new Map<string, string>();
  let catOrder = 0;

  for (const s of serviceCatalog) {
    const slug = getCategorySlug(s.category.en);
    if (categoryIds.has(slug)) continue;

    const cat = await prisma.serviceCategory.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        sortOrder: catOrder++,
        translations: {
          create: LOCALES.map((locale) => ({ locale, name: s.category[locale] })),
        },
      },
    });
    categoryIds.set(slug, cat.id);
  }

  let order = 0;
  for (const s of serviceCatalog) {
    const rich = servicesRich[s.slug];

    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        categoryId: categoryIds.get(getCategorySlug(s.category.en))!,
        image: s.image,
        sourceUrl: s.sourceUrl || null,
        sourceUrlEn: s.sourceUrlEn || null,
        sortOrder: order++,
        status: "PUBLISHED",
        publishedAt: new Date(),
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            title: s.title[locale],
            shortDescription: s.shortDescription[locale],
            description: s.description[locale],
            highlights: s.highlight[locale],
            rich: rich?.[locale] ? (rich[locale] as Prisma.InputJsonValue) : Prisma.DbNull,
          })),
        },
      },
    });
  }
  console.log(`Services: ${serviceCatalog.length}, categories: ${categoryIds.size}`);
}

async function seedDoctors() {
  let order = 0;
  for (const d of doctorCatalog) {
    await prisma.doctor.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        image: d.image,
        instagram: d.social?.instagram ?? null,
        linkedin: d.social?.linkedin ?? null,
        sortOrder: order++,
        status: "PUBLISHED",
        publishedAt: new Date(),
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            // The mock data only has one (Arabic) name; it is used for both languages
            // until an English name is entered from the dashboard.
            name: d.name,
            specialization: d.specialization[locale],
            bio: d.bio[locale],
          })),
        },
      },
    });
  }
  console.log(`Doctors: ${doctorCatalog.length}`);
}

async function seedFaq() {
  if ((await prisma.fAQ.count()) > 0) {
    console.log("FAQ: already has data, skipped");
    return;
  }

  let order = 0;
  for (const item of faqCatalog) {
    await prisma.fAQ.create({
      data: {
        sortOrder: order++,
        status: "PUBLISHED",
        publishedAt: new Date(),
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            question: item.question[locale],
            answer: item.answer[locale],
          })),
        },
      },
    });
  }
  console.log(`FAQ: ${faqCatalog.length}`);
}

async function seedGallery() {
  let order = 0;
  for (const g of galleryServices) {
    const exists = await prisma.galleryAlbum.findUnique({ where: { slug: g.slug } });
    if (exists) {
      order++;
      continue;
    }

    await prisma.galleryAlbum.create({
      data: {
        slug: g.slug,
        sortOrder: order++,
        status: "PUBLISHED",
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            title: g.title[locale],
            category: g.category[locale],
            description: g.description[locale],
          })),
        },
        images: {
          create: g.images.map((url, i) => ({ url, sortOrder: i })),
        },
      },
    });
  }
  console.log(`Gallery albums: ${galleryServices.length}`);
}

async function main() {
  await seedAdmin();
  await seedServices();
  await seedDoctors();
  await seedFaq();
  await seedGallery();
  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
