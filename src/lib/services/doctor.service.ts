import prisma from "../prisma";

export async function getPublishedDoctors(locale: string) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const doctors = await prisma.doctor.findMany({
    where: { status: "PUBLISHED" },
    include: { translations: { where: { locale } } },
    orderBy: { createdAt: "desc" },
  });

  return doctors.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.translations[0]?.name ?? null,
    bio: d.translations[0]?.bio ?? null,
  }));
}

export async function getDoctorBySlug(slug: string, locale: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const doctor = await prisma.doctor.findUnique({
    where: { slug },
    include: { translations: { where: { locale } } },
  });
  if (!doctor) return null;
  return {
    id: doctor.id,
    slug: doctor.slug,
    name: doctor.translations[0]?.name ?? null,
    bio: doctor.translations[0]?.bio ?? null,
  };
}
