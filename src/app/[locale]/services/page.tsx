import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { ServicesGrid } from "@/components/website/ServicesGrid";
import {
  clinicContactData,
  getAlternateUrl,
  getCategories,
  getCategorySlug,
  serviceCatalog,
  siteConfig,
} from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  const title = isArabic
    ? `الخدمات | ${siteConfig.siteName.ar}`
    : `Services | ${siteConfig.siteName.en}`;

  const description = isArabic
    ? "اكتشف مجموعة خدماتنا الشاملة في طب الأسنان، تقويم الأسنان، التجميل، والجراحة في دمشق."
    : "Explore our comprehensive dental services including orthodontics, cosmetic dentistry, surgery, and more in Damascus.";

  const path = "/services";
  const alternates = getAlternateUrl(safeLocale as Locale, path);
  const canonicalUrl = `${siteConfig.baseUrl}/${safeLocale}${path}`;
  const ogImage = serviceCatalog[0]?.image ?? "/og-default.jpg";

  return {
    title,
    description,
    keywords: isArabic
      ? [
          "خدمات أسنان",
          "تقويم الأسنان",
          "زراعة الأسنان",
          "تجميل الأسنان",
          "دمشق",
        ]
      : [
          "dental services",
          "orthodontics",
          "dental implants",
          "cosmetic dentistry",
          "Damascus",
        ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [siteConfig.hreflang.ar]: alternates.ar,
        [siteConfig.hreflang.en]: alternates.en,
        "x-default": alternates.en,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.siteName[safeLocale as Locale],
      locale: siteConfig.ogLocale[safeLocale as Locale],
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    other: {
      "geo.region": siteConfig.geo.region,
      "geo.placename": siteConfig.geo.placename[safeLocale as Locale],
      "geo.position": siteConfig.geo.position,
      ICBM: siteConfig.geo.ICBM,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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

  const messages = getMessages(safeLocale as Locale);
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isArabic
      ? "خدمات عيادة سعودي لطب الأسنان"
      : "Saudi Dental Clinic Services",
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `${siteConfig.baseUrl}/${safeLocale}/services/${s.slug}`,
    })),
  };

  return (
    <main
      className="min-h-screen bg-background-soft text-foreground"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


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