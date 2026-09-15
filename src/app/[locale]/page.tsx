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
import { getPageContent } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  if (!locales.includes(safeLocale as Locale)) {
    notFound();
  }

  const messages = getMessages(safeLocale as Locale);
  const content = getPageContent(safeLocale as Locale);

  return (
    <main className="min-h-screen bg-[#f6f9f8] text-[#172b36]" dir={safeLocale === "ar" ? "rtl" : "ltr"}>
      <Header locale={safeLocale as Locale} nav={messages.nav} />
      <HeroSection locale={safeLocale as Locale} content={content.hero} />
      <SignatureServicesSection locale={safeLocale as Locale} services={content.services} />
      <FeaturesSection locale={safeLocale as Locale} features={content.features} />
      <AboutAndTeamSection locale={safeLocale as Locale} about={content.about} doctors={content.doctors} />
      <ServicesOverviewAndWhyUs
        locale={safeLocale as Locale}
        overview={content.overview}
        whyUs={content.whyUs}
      />
      <TestimonialsAndFAQ
        locale={safeLocale as Locale}
        testimonials={content.testimonials}
        faq={content.faq}
      />
      <BlogAndNewsSection locale={safeLocale as Locale} blog={content.blog} />
      <Footer locale={safeLocale as Locale} footer={content.footer} nav={messages.nav} />
    </main>
  );
}
