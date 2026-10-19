import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutAndTeamSection } from "@/components/website/AboutAndTeamSection";
import { BlogAndNewsSection } from "@/components/website/BlogAndNewsSection";
import { FeaturesSection } from "@/components/website/FeaturesSection";
import { HeroSection } from "@/components/website/HeroSection";
import { ServicesOverviewAndWhyUs } from "@/components/website/ServicesOverviewAndWhyUs";
import { SignatureServicesSection } from "@/components/website/SignatureServicesSection";
import { TestimonialsAndFAQ } from "@/components/website/TestimonialsAndFAQ";
import { VideoShowcase } from "@/components/website/VideoShowcase";
import {
  getCategories,
  getPageContent,
} from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";
import { WhatsAppFloat } from "@/components/website/WhatsAppFloat";
import { ClinicSelector } from "@/components/website/ClinicSelector";
import {
  buildMetadata,
  buildPageJsonLd,
  seoDefaults,
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
  return buildMetadata("home", safeLocale);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* ═══════════════════════════════════════════════════
   الصفحة
   ═══════════════════════════════════════════════════ */

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

  /* كل كتل JSON-LD تُبنى من seo.ts */
  const jsonLdBlocks = buildPageJsonLd("home", safeLocale);

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

      <section id="pricing" className="scroll-mt-28">
        <ServicesOverviewAndWhyUs locale={safeLocale as "ar" | "en"} />
      </section>

      <TestimonialsAndFAQ
        locale={safeLocale as Locale}
        testimonials={content.testimonials}
        faq={content.faq}
      />

      {/* <BlogAndNewsSection locale={safeLocale as Locale} blog={content.blog} /> */}

      <WhatsAppFloat
        locale={safeLocale as "ar" | "en"}
        phone={seoDefaults.whatsappNumber}
      />
    </main>
  );
}