import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { clinicContactData, galleryCollections } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  return {
    title: isArabic ? "المعرض | عيادة دمشق" : "Gallery | Damascus Dental Clinic",
    description: isArabic ? "تصفح أمثلة تجريبية لتصميم الابتسامة وتقويم الأسنان والعلاجات التجميلية." : "Explore representative smile design, orthodontic, and cosmetic treatment examples.",
    alternates: {
      languages: {
        en: "/en/gallery",
        ar: "/ar/gallery",
      },
    },
    openGraph: {
      title: isArabic ? "المعرض" : "Gallery",
      description: isArabic ? "أمثلة على العلاجات التجميلية والتقويمية." : "Representative cosmetic and orthodontic treatment examples.",
      url: `/${safeLocale}/gallery`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  if (!locales.includes(safeLocale as Locale)) {
    notFound();
  }

  const messages = getMessages(safeLocale as Locale);
  const isArabic = safeLocale === "ar";

  return (
    <main className="min-h-screen bg-[#f6f9f8] text-[#172b36]" dir={isArabic ? "rtl" : "ltr"}>
      <Header locale={safeLocale as Locale} nav={messages.nav} />

      <div className="pt-28">
        <Breadcrumbs locale={safeLocale as Locale} items={[{ label: isArabic ? "المعرض" : "Gallery" }]} />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "المعرض" : "Gallery"}
          title={isArabic ? "أمثلة على الحالات وتجارب الابتسامة." : "Representative cases and smile transformations."}
          description={
            isArabic
              ? "تُعرض هنا أمثلة توضيحية تُستخدم لتوضيح أنواع العلاج وتنسيقها في العيادة، مع إبقاء كل حالة كعرض تجريبي قابل للاستبدال بأعمال حقيقية لاحقًا."
              : "This gallery highlights representative examples of treatment types and aesthetic planning, intentionally structured as demo cases that can later be replaced by real clinic photography."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {galleryCollections.map((caseItem, index) => {
              const label = isArabic ? caseItem.label.ar : caseItem.label.en;
              const category = isArabic ? caseItem.category.ar : caseItem.category.en;

              return (
                <article key={`${category}-${index}`} className="rounded-[30px] border border-[#e5eeeb] bg-white p-4 shadow-[0_16px_36px_rgba(11,59,90,0.04)] sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">{category}</p>
                      <h3 className="mt-2 text-2xl font-black text-[#0b3b5a]">{label}</h3>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="overflow-hidden rounded-[24px] bg-[#edf6f5]">
                      <div className="relative h-72 w-full">
                        <Image src={caseItem.beforeImage} alt={`${label} before`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                      </div>
                      <div className="px-4 py-3 text-sm font-semibold text-[#0b3b5a]">
                        {isArabic ? "قبل" : "Before"}
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[24px] bg-[#edf6f5]">
                      <div className="relative h-72 w-full">
                        <Image src={caseItem.afterImage} alt={`${label} after`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                      </div>
                      <div className="px-4 py-3 text-sm font-semibold text-[#0b3b5a]">
                        {isArabic ? "بعد" : "After"}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <Footer locale={safeLocale as Locale} footer={{ phone: clinicContactData.phone, email: clinicContactData.email, address: clinicContactData.address[safeLocale as "en" | "ar"] }} nav={messages.nav} />
    </main>
  );
}
