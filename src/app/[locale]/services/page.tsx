import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { clinicContactData, serviceCatalog } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  return {
    title: isArabic ? "الخدمات | عيادة دافنشي" : "Services | Davinci Dental Clinic",
    description: isArabic ? "اكتشف خدمات العيادة في العناية الوقائية، التجميل، وتقويم الأسنان." : "Explore our preventive, cosmetic, and restorative dental services.",
    alternates: {
      languages: {
        en: "/en/services",
        ar: "/ar/services",
      },
    },
    openGraph: {
      title: isArabic ? "خدماتنا" : "Our services",
      description: isArabic ? "خطط علاجية متكاملة." : "Integrated treatment plans for modern dental care.",
      url: `/${safeLocale}/services`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
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
        <Breadcrumbs locale={safeLocale as Locale} items={[{ label: isArabic ? "الخدمات" : "Services" }]} />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "خدماتنا" : "Our services"}
          title={isArabic ? "خطط علاجية متكاملة لأهداف ابتسامة صحية وواثقة." : "Integrated treatment plans for healthy, confident smiles."}
          description={
            isArabic
              ? "تغطي خدماتنا الرعاية الوقائية، التجميل، والتقويم، مع تركيز على التخطيط الواقعي والراحة في كل مرحلة من مراحل العلاج."
              : "Our services cover preventive, cosmetic, and restorative care, with a focus on realistic planning and comfort at every stage of treatment."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {serviceCatalog.map((service) => {
              const title = isArabic ? service.title.ar : service.title.en;
              const shortDescription = isArabic ? service.shortDescription.ar : service.shortDescription.en;
              const category = isArabic ? service.category.ar : service.category.en;

              return (
                <article key={service.slug} className="overflow-hidden rounded-[28px] border border-[#e5eeeb] bg-white shadow-[0_14px_32px_rgba(11,59,90,0.04)]">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image src={service.image} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">{category}</p>
                    <h3 className="mt-3 text-2xl font-black text-[#0b3b5a]">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{shortDescription}</p>

                    <Link href={`/${safeLocale}/services/${service.slug}`} className="mt-6 inline-flex rounded-full bg-[#0b3b5a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194a69]">
                      {isArabic ? "اقرأ المزيد" : "Read more"}
                    </Link>
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