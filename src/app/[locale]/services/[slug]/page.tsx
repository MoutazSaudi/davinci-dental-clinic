import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { ServiceRequestForm } from "@/components/website/ServiceRequestForm";
import { clinicContactData, getServiceBySlug, serviceCatalog } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceCatalog.map((service) => ({ locale, slug: service.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const service = getServiceBySlug(safeLocale as Locale, slug);

  if (!service) {
    return {
      title: safeLocale === "ar" ? "الخدمة غير موجودة" : "Service not found",
    };
  }

  return {
    title: `${service.title} | Davinci Dental Clinic`,
    description: service.description,
    alternates: {
      languages: {
        en: `/en/services/${slug}`,
        ar: `/ar/services/${slug}`,
      },
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `/${safeLocale}/services/${slug}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  if (!locales.includes(safeLocale as Locale)) {
    notFound();
  }

  const service = getServiceBySlug(safeLocale as Locale, slug);

  if (!service) {
    notFound();
  }

  const messages = getMessages(safeLocale as Locale);
  const isArabic = safeLocale === "ar";

  return (
    <main className="min-h-screen bg-[#f6f9f8] text-[#172b36]" dir={isArabic ? "rtl" : "ltr"}>
      <Header locale={safeLocale as Locale} nav={messages.nav} />

      <div className="pt-28">
        <Breadcrumbs
          locale={safeLocale as Locale}
          items={[{ href: `/${safeLocale}/services`, label: isArabic ? "الخدمات" : "Services" }, { label: service.title }]}
        />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={service.category}
          title={service.title}
          description={service.shortDescription}
        />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-[30px] border border-[#e5eeeb] bg-white shadow-[0_16px_36px_rgba(11,59,90,0.04)]">
              <div className="relative h-[420px] w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-black text-[#0b3b5a]">
                  {isArabic ? "معلومات الخدمة" : "Service overview"}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">{service.description}</p>

                <div className="mt-6 rounded-[24px] bg-[#edf6f5] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">
                    {isArabic ? "مزايا الخدمة" : "Highlights"}
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                    {service.highlight.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#c6a664] text-[#0b3b5a]">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] bg-[#0b3b5a] p-6 text-white shadow-[0_16px_34px_rgba(11,59,90,0.08)]">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c6a664]">
                  {isArabic ? "نقطة البداية" : "Starting point"}
                </p>
                <h3 className="mt-3 text-2xl font-black">
                  {isArabic ? "دعنا نساعدك في تحديد الخطة المناسبة." : "Let us help you choose the right plan."}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  {isArabic
                    ? "نستمع إلى احتياجك، ونراجع الحالة، ونقترح حلًا مناسبًا وفقًا لأهدافك وراحةك."
                    : "We listen carefully to your needs, review the case, and suggest the right approach based on your goals and comfort level."}
                </p>
                <a href={`/${safeLocale}/contact`} className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0b3b5a]">
                  {isArabic ? "تواصل معنا" : "Contact us"}
                </a>
              </div>

              <div className="rounded-[28px] border border-[#e5eeeb] bg-white p-4 shadow-[0_16px_34px_rgba(11,59,90,0.04)] sm:p-6">
                <ServiceRequestForm locale={safeLocale as Locale} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer locale={safeLocale as Locale} footer={{ phone: clinicContactData.phone, email: clinicContactData.email, address: clinicContactData.address[safeLocale as "en" | "ar"] }} nav={messages.nav} />
    </main>
  );
}