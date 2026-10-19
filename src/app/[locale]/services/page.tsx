import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { PageHeader } from "@/components/website/PageHeader";
import { ServicesGrid } from "@/components/website/ServicesGrid";
import {
  getCategories,
  getCategorySlug,
  serviceCatalog,
} from "@/data/mock/services";
import { locales, type Locale } from "@/lib/i18n";
import {
  buildMetadata,
  buildPageJsonLd,
  buildBreadcrumbSchema,
  buildPageUrl,
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
  return buildMetadata("services", safeLocale);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* ═══════════════════════════════════════════════════
   الصفحة
   ═══════════════════════════════════════════════════ */

export default async function ServicesPage({
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
  const L = safeLocale as "ar" | "en";

  const services = serviceCatalog.map((s) => ({
    slug: s.slug,
    title: s.title[L],
    shortDescription: s.shortDescription[L],
    category: s.category[L],
    categoryKey: getCategorySlug(s.category.en),
    image: s.image,
  }));

  const categories = getCategories(L).map((c) => ({
    slug: c.slug,
    label: c.label,
    count: c.count,
  }));

  /* ═══════════════════════════════════════════════════
     JSON-LD — Auto (Organization/WebSite/CollectionPage) + ItemList + Breadcrumb
     ═══════════════════════════════════════════════════ */

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isArabic
      ? "خدمات عيادة دافينشي لطب الأسنان"
      : "Davinci Dental Clinic Services",
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: buildPageUrl(safeLocale, `services/${s.slug}`),
    })),
  };

  const breadcrumbLd = buildBreadcrumbSchema(safeLocale, [
    { name: isArabic ? "الرئيسية" : "Home", path: "" },
    { name: isArabic ? "الخدمات" : "Services", path: "services" },
  ]);

  const jsonLdBlocks = buildPageJsonLd("services", safeLocale, [
    itemListLd,
    breadcrumbLd,
  ]);

  return (
    <main
      className="min-h-screen bg-background-soft text-foreground"
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
          items={[{ label: isArabic ? "الخدمات" : "Services" }]}
        />

        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "خدماتنا" : "Our services"}
          title={
            isArabic
              ? "خطط علاجية متكاملة لأهداف ابتسامة صحية وواثقة."
              : "Integrated treatment plans for healthy, confident smiles."
          }
          description={
            isArabic
              ? "تغطي خدماتنا الرعاية الوقائية، التجميل، والتقويم، مع تركيز على التخطيط الواقعي والراحة في كل مرحلة من مراحل العلاج."
              : "Our services cover preventive, cosmetic, and restorative care, with a focus on realistic planning and comfort at every stage of treatment."
          }
        />

        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-foreground-muted">
              {isArabic ? "جارٍ التحميل..." : "Loading..."}
            </div>
          }
        >
          <ServicesGrid
            locale={safeLocale as Locale}
            services={services}
            categories={categories}
          />
        </Suspense>
      </div>
    </main>
  );
}