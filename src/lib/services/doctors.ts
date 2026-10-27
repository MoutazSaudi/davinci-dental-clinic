import prisma from "@/lib/prisma";

export type PublicDoctor = {
  slug: string;
  name: { ar: string; en: string };
  specialization: { ar: string; en: string };
  bio: { ar: string; en: string };
  image: string | null;
  instagram: string | null;
  linkedin: string | null;
};

export async function getPublishedDoctors(): Promise<PublicDoctor[]> {
  const doctors = await prisma.doctor.findMany({
    where: { status: "PUBLISHED" },
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });

  return doctors.map((d) => {
    const en = d.translations.find((t) => t.locale === "en");
    const ar = d.translations.find((t) => t.locale === "ar");
    return {
      slug: d.slug,
      name: { en: en?.name ?? ar?.name ?? "", ar: ar?.name ?? en?.name ?? "" },
      specialization: {
        en: en?.specialization ?? ar?.specialization ?? "",
        ar: ar?.specialization ?? en?.specialization ?? "",
      },
      bio: { en: en?.bio ?? ar?.bio ?? "", ar: ar?.bio ?? en?.bio ?? "" },
      image: d.image,
      instagram: d.instagram,
      linkedin: d.linkedin,
    };
  });
}