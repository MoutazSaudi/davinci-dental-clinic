import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { PageHeader } from "@/components/website/PageHeader";
import { GalleryGrid } from "@/components/website/GalleryGrid";
import { galleryServices } from "@/data/mock/gallery";
import { locales, type Locale } from "@/lib/i18n";
import {
  buildMetadata,
  buildPageJsonLd,
  buildBreadcrumbSchema,
} from "@/data/seo";

/* ═══════════════════════════════════════════════════
   SEO — كل شيء من src/data/seo.ts
   ═══════════════════════════════════════════════════ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  return buildMetadata("gallery", safeLocale);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* ═══════════════════════════════════════════════════
   الصفحة
   ═══════════════════════════════════════════════════ */

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

  const isArabic = safeLocale === "ar";

  /* ═══════════════════════════════════════════════════
     JSON-LD — Auto (Organization/WebSite/CollectionPage) + Breadcrumb
     ═══════════════════════════════════════════════════ */

  const breadcrumbLd = buildBreadcrumbSchema(safeLocale, [
    { name: isArabic ? "الرئيسية" : "Home", path: "" },
    { name: isArabic ? "المعرض" : "Gallery", path: "gallery" },
  ]);

  const jsonLdBlocks = buildPageJsonLd("gallery", safeLocale, [breadcrumbLd]);

  return (
    <main
      className="min-h-screen bg-[#f6f9f8] text-[#172b36]"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {jsonLdBlocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

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