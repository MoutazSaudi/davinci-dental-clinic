import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { GalleryGrid } from "@/components/website/GalleryGrid";
import { clinicContactData } from "@/data/mock/services";
import { galleryServices } from "@/data/mock/gallery";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  return {
    title: isArabic ? "المعرض | عيادة دمشق" : "Gallery | Damascus Dental Clinic",
    description: isArabic
      ? "تصفح أمثلة على نتائج علاجات التقويم والابتسامة في العيادة."
      : "Explore representative orthodontic and smile treatment results.",
    alternates: {
      languages: { en: "/en/gallery", ar: "/ar/gallery" },
    },
    openGraph: {
      title: isArabic ? "المعرض" : "Gallery",
      description: isArabic
        ? "أمثلة على العلاجات التقويمية والتجميلية."
        : "Representative orthodontic and cosmetic treatment examples.",
      url: `/${safeLocale}/gallery`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  if (!locales.includes(safeLocale as Locale)) {
    notFound();
  }

  const messages = getMessages(safeLocale as Locale);
  const isArabic = safeLocale === "ar";

  return (
    <main
      className="min-h-screen bg-[#f6f9f8] text-[#172b36]"
      dir={isArabic ? "rtl" : "ltr"}
    >
 
      <div className="pt-28">
        <Breadcrumbs
          locale={safeLocale as Locale}
          items={[{ label: isArabic ? "المعرض" : "Gallery" }]}
        />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "المعرض" : "Gallery"}
          title={
            isArabic
              ? "أمثلة على الحالات وتجارب الابتسامة."
              : "Representative cases and smile transformations."
          }
          description={
            isArabic
              ? "مجموعة من الصور التوضيحية لنتائج العلاج في العيادة. اضغط على أي صورة لعرضها بحجم أكبر."
              : "A curated collection of treatment results from the clinic. Click any image to enlarge it."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <GalleryGrid
            services={galleryServices}
            locale={safeLocale as "ar" | "en"}
          />
        </section>
      </div>

 
    </main>
  );
}