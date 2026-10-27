import prisma from "@/lib/prisma";
import type {
  ContactDoctorOption,
  ContactServiceOption,
} from "@/components/website/ContactForm";

export async function getDoctorsForSelect(): Promise<ContactDoctorOption[]> {
  const doctors = await prisma.doctor.findMany({
    where: { status: "PUBLISHED" },
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });

  return doctors.map((d) => {
    const en = d.translations.find((t) => t.locale === "en");
    const ar = d.translations.find((t) => t.locale === "ar");
    return {
      id: d.id,
      slug: d.slug,
      name: {
        en: en?.name ?? ar?.name ?? "",
        ar: ar?.name ?? en?.name ?? "",
      },
    };
  });
}

export async function getServicesForSelect(): Promise<ContactServiceOption[]> {
  const services = await prisma.service.findMany({
    where: { status: "PUBLISHED" },
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });

  return services.map((s) => {
    const en = s.translations.find((t) => t.locale === "en");
    const ar = s.translations.find((t) => t.locale === "ar");
    return {
      slug: s.slug,
      title: {
        en: en?.title ?? ar?.title ?? "",
        ar: ar?.title ?? en?.title ?? "",
      },
    };
  });
}