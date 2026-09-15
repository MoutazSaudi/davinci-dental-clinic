import prisma from "../prisma";

export async function getPublishedServices(locale: string) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const services = await prisma.service.findMany({
    where: { status: "PUBLISHED" },
    include: { translations: { where: { locale } } },
    orderBy: { createdAt: "desc" },
  });

  return services.map((s) => ({
    id: s.id,
    slug: s.slug,
    status: s.status,
    title: s.translations[0]?.title ?? null,
    shortDescription: s.translations[0]?.shortDescription ?? null,
  }));
}

export async function getServiceBySlug(slug: string, locale: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const service = await prisma.service.findUnique({
    where: { slug },
    include: { translations: { where: { locale } } },
  });
  if (!service) return null;
  return {
    id: service.id,
    slug: service.slug,
    status: service.status,
    title: service.translations[0]?.title ?? null,
    description: service.translations[0]?.description ?? null,
  };
}
