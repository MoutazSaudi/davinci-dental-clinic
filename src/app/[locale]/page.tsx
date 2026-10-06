import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutAndTeamSection } from "@/components/website/AboutAndTeamSection";
import { BlogAndNewsSection } from "@/components/website/BlogAndNewsSection";
import { FeaturesSection } from "@/components/website/FeaturesSection";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { HeroSection } from "@/components/website/HeroSection";
import { ServicesOverviewAndWhyUs } from "@/components/website/ServicesOverviewAndWhyUs";
import { SignatureServicesSection } from "@/components/website/SignatureServicesSection";
import { TestimonialsAndFAQ } from "@/components/website/TestimonialsAndFAQ";
import { VideoShowcase } from "@/components/website/VideoShowcase";
import { clinicContactData, getAlternateUrl, getCategories, getPageContent, siteConfig } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";
import { WhatsAppFloat } from "@/components/website/WhatsAppFloat";
import { ClinicSelector } from "@/components/website/ClinicSelector";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";
  const canonicalPath = "/";
  const canonicalUrl = `${siteConfig.baseUrl}/${safeLocale}`;
  const imageUrl = `${siteConfig.baseUrl}/images/doctors/DrMuhanad.jpeg`;

  const title = isArabic
    ? "عيادة أسنان في دمشق | دافينشي لطب الأسنان"
    : "Dental clinic in Damascus | Da Vinci Dental Clinic";

  const description = isArabic
    ? "دافينشي لطب الأسنان في دمشق تقدم رعاية متخصصة في تقويم الأسنان، علاج المفصل الصدغي، الأسنان التجميلية، ورعاية الأسنان العائلية ببيئة مريحة واحترافية."
    : "Da Vinci Dental Clinic in Damascus provides specialist orthodontics, TMJ treatment, cosmetic dentistry, and family dental care in a comfortable, professional environment.";

  const alternates = getAlternateUrl(safeLocale as Locale, canonicalPath);

  return {
    title,
    description,
    keywords: isArabic
      ? [
          "عيادة أسنان في دمشق",
          "طبيب أسنان في دمشق",
          "تقويم أسنان",
          "علاج المفصل الصدغي",
          "د. مهند سعودي",
          "دافينشي لطب الأسنان",
          "عيادة اسنان دمشق",
        ]
      : [
          "dental clinic in Damascus",
          "dentist in Damascus",
          "dental clinic Damascus Syria",
          "orthodontic treatment Damascus",
          "TMJ treatment Damascus",
          "Dr. Muhanad Saudi",
          "Da Vinci Dental Clinic",
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
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.siteName[safeLocale as Locale],
      locale: siteConfig.ogLocale[safeLocale as Locale],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
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

export default async function LocaleHomePage({
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
  const content = getPageContent(safeLocale as Locale);
  const isArabic = safeLocale === "ar";

  const homepageLd = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalBusiness", "LocalBusiness"],
    name: siteConfig.siteName[safeLocale as Locale],
    alternateName: isArabic ? "دافينشي لطب الأسنان" : "Da Vinci Dental Clinic",
    description: isArabic
      ? "عيادة أسنان متخصصة في دمشق تقدم تقويم الأسنان، علاج المفصل الصدغي، والعناية بالتجميل وطب الأسنان العائلي."
      : "A dental clinic in Damascus specializing in orthodontics, TMJ treatment, cosmetic care, and family dental services.",
    url: `${siteConfig.baseUrl}/${safeLocale}`,
    telephone: clinicContactData.phone,
    email: clinicContactData.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinicContactData.address[safeLocale as "ar" | "en"],
      addressLocality: isArabic ? "دمشق" : "Damascus",
      addressCountry: "SY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.5138,
      longitude: 36.2765,
    },
    areaServed: [isArabic ? "سوريا" : "Syria", isArabic ? "الإمارات" : "UAE"],
    sameAs: [clinicContactData.social.facebook, clinicContactData.social.instagram],
  };

  return (
    <main
      className="min-h-screen bg-[#f6f9f8] text-[#172b36]"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageLd) }}
      />
      <ClinicSelector locale={safeLocale as Locale} />
      <HeroSection locale={safeLocale as Locale} content={content.hero} />
      {/* ===== Video Section ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <VideoShowcase
          locale={safeLocale as "ar" | "en"}
          src="/video/v.mp4"
          eyebrow={isArabic ? "تعرف على العيادة" : "Meet the Clinic"}
          title={
            isArabic
              ? "جولة سريعة في عيادة دمشق"
              : "A quick tour of Damascus Dental Clinic"
          }
          description={
            isArabic
              ? "شاهد أجواء العيادة، الأجهزة الحديثة، وفريق الأطباء قبل زيارتك."
              : "See the clinic atmosphere, modern equipment, and our team before your visit."
          }
          aspectRatio="16/9"
          autoPlayOnView
        />
      </section>
      <SignatureServicesSection
        locale={safeLocale as Locale}
        categories={getCategories(safeLocale as Locale)}
      />
      <FeaturesSection
        locale={safeLocale as Locale}
        features={content.features}
      />
      <AboutAndTeamSection
        locale={safeLocale as Locale}
        about={content.about}
        doctors={content.doctors}
      />
      <ServicesOverviewAndWhyUs locale={safeLocale as "ar" | "en"} />
      <TestimonialsAndFAQ
        locale={safeLocale as Locale}
        testimonials={content.testimonials}
        faq={content.faq}
      />
      {/* <BlogAndNewsSection locale={safeLocale as Locale} blog={content.blog} /> */}
      <WhatsAppFloat locale={safeLocale as "ar" | "en"} phone="971555449975" />
    </main>
  );
}
