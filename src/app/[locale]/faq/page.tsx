import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { clinicContactData, faqCatalog } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  return {
    title: isArabic ? "الأسئلة الشائعة | عيادة دمشق" : "FAQ | Damascus Dental Clinic",
    description: isArabic ? "إجابات عملية على الأسئلة الشائعة حول رعاية الأسنان، الفحوصات، والتجهيز للزيارة." : "Answers to common questions about dental care, checkups, and preparing for appointments.",
    alternates: {
      languages: {
        en: "/en/faq",
        ar: "/ar/faq",
      },
    },
    openGraph: {
      title: isArabic ? "الأسئلة الشائعة" : "FAQ",
      description: isArabic ? "معلومات مفيدة عن رعاية الأسنان." : "Helpful information about dental care.",
      url: `/${safeLocale}/faq`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  if (!locales.includes(safeLocale as Locale)) {
    notFound();
  }

  const messages = getMessages(safeLocale as Locale);
  const isArabic = safeLocale === "ar";

  const items = faqCatalog.map((item) => ({
    question: isArabic ? item.question.ar : item.question.en,
    answer: isArabic ? item.answer.ar : item.answer.en,
  }));

  return (
    <main className="min-h-screen bg-[#f6f9f8] text-[#172b36]" dir={isArabic ? "rtl" : "ltr"}>
      <Header locale={safeLocale as Locale} nav={messages.nav} />

      <div className="pt-28">
        <Breadcrumbs locale={safeLocale as Locale} items={[{ label: isArabic ? "الأسئلة" : "FAQ" }]} />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "معلومات مفيدة" : "Useful information"}
          title={isArabic ? "أسئلة شائعة حول رعاية الأسنان والزيارة." : "Frequently asked questions about dental care and visits."}
          description={
            isArabic
              ? "نجيب هنا على الأسئلة الأكثر شيوعًا حول التجربة السريرية، والجدول الزمني، والتحضير للزيارة، ونوعية الرعاية."
              : "Here you will find practical answers to common questions around treatment, timelines, preparation, and what patients can expect from a visit."
          }
        />

        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <FAQAccordion items={items} locale={safeLocale as Locale} />
        </section>
      </div>

      <Footer locale={safeLocale as Locale} footer={{ phone: clinicContactData.phone, email: clinicContactData.email, address: clinicContactData.address[safeLocale as "en" | "ar"] }} nav={messages.nav} />
    </main>
  );
}
