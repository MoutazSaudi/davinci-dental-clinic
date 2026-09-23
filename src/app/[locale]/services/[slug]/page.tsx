// import type { Metadata } from "next";
// import Image from "next/image";
// import { notFound } from "next/navigation";
// import { Breadcrumbs } from "@/components/website/Breadcrumbs";
// import { Footer } from "@/components/website/Footer";
// import { Header } from "@/components/website/Header";
// import { PageHeader } from "@/components/website/PageHeader";
// import { ServiceRequestForm } from "@/components/website/ServiceRequestForm";
// import { clinicContactData, getServiceBySlug, serviceCatalog } from "@/data/mock/services";
// import { getMessages, locales, type Locale } from "@/lib/i18n";

// export function generateStaticParams() {
//   return locales.flatMap((locale) => serviceCatalog.map((service) => ({ locale, slug: service.slug })));
// }

// export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
//   const { locale, slug } = await params;
//   const safeLocale = locale === "ar" ? "ar" : "en";
//   const service = getServiceBySlug(safeLocale as Locale, slug);

//   if (!service) {
//     return {
//       title: safeLocale === "ar" ? "الخدمة غير موجودة" : "Service not found",
//     };
//   }

//   return {
//     title: `${service.title} | Davinci Dental Clinic`,
//     description: service.description,
//     alternates: {
//       languages: {
//         en: `/en/services/${slug}`,
//         ar: `/ar/services/${slug}`,
//       },
//     },
//     openGraph: {
//       title: service.title,
//       description: service.description,
//       url: `/${safeLocale}/services/${slug}`,
//       type: "website",
//     },
//   };
// }

// export default async function ServiceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
//   const { locale, slug } = await params;
//   const safeLocale = locale === "ar" ? "ar" : "en";

//   if (!locales.includes(safeLocale as Locale)) {
//     notFound();
//   }

//   const service = getServiceBySlug(safeLocale as Locale, slug);

//   if (!service) {
//     notFound();
//   }

//   const messages = getMessages(safeLocale as Locale);
//   const isArabic = safeLocale === "ar";

//   return (
//     <main className="min-h-screen bg-background-soft text-foreground" dir={isArabic ? "rtl" : "ltr"}>
//       <Header locale={safeLocale as Locale} nav={messages.nav} />

//       <div className="pt-28">
//         <Breadcrumbs
//           locale={safeLocale as Locale}
//           items={[{ href: `/${safeLocale}/services`, label: isArabic ? "الخدمات" : "Services" }, { label: service.title }]}
//         />
//         <PageHeader
//           locale={safeLocale as Locale}
//           eyebrow={service.category}
//           title={service.title}
//           description={service.shortDescription}
//         />

//         <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//           <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
//             <div className="overflow-hidden rounded-[30px] border border-border bg-surface shadow-[0_16px_36px_rgba(122,28,81,0.04)]">
//               <div className="relative h-[420px] w-full">
//                 <Image
//                   src={service.image}
//                   alt={service.title}
//                   fill
//                   sizes="(max-width: 1024px) 100vw, 60vw"
//                   className="object-cover"
//                 />
//               </div>
//               <div className="p-6 sm:p-8">
//                 <h2 className="text-2xl font-black text-primary">
//                   {isArabic ? "معلومات الخدمة" : "Service overview"}
//                 </h2>
//                 <p className="mt-4 text-base leading-8 text-foreground-muted">{service.description}</p>

//                 <div className="mt-6 rounded-[24px] bg-mint p-5">
//                   <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
//                     {isArabic ? "مزايا الخدمة" : "Highlights"}
//                   </p>
//                   <ul className="mt-4 space-y-3 text-sm leading-7 text-foreground">
//                     {service.highlight.map((item) => (
//                       <li key={item} className="flex items-start gap-3">
//                         <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold text-primary">✓</span>
//                         <span>{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="rounded-[28px] bg-primary p-6 text-white shadow-[0_16px_34px_rgba(122,28,81,0.08)]">
//                 <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
//                   {isArabic ? "نقطة البداية" : "Starting point"}
//                 </p>
//                 <h3 className="mt-3 text-2xl font-black text-white">
//                   {isArabic ? "دعنا نساعدك في تحديد الخطة المناسبة." : "Let us help you choose the right plan."}
//                 </h3>
//                 <p className="mt-3 text-sm leading-7 text-white/80">
//                   {isArabic
//                     ? "نستمع إلى احتياجك، ونراجع الحالة، ونقترح حلًا مناسبًا وفقًا لأهدافك وراحةك."
//                     : "We listen carefully to your needs, review the case, and suggest the right approach based on your goals and comfort level."}
//                 </p>
//                 <a href={`/${safeLocale}/contact`} className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary">
//                   {isArabic ? "تواصل معنا" : "Contact us"}
//                 </a>
//               </div>

//               <div className="rounded-[28px] border border-border bg-surface p-4 shadow-[0_16px_34px_rgba(122,28,81,0.04)] sm:p-6">
//                 <ServiceRequestForm locale={safeLocale as Locale} />
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>

//       <Footer locale={safeLocale as Locale} footer={{ phone: clinicContactData.phone, email: clinicContactData.email, address: clinicContactData.address[safeLocale as "en" | "ar"] }} nav={messages.nav} />
//     </main>
//   );
// }
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { ServiceRequestForm } from "@/components/website/ServiceRequestForm";
import {
  clinicContactData,
  getAlternateUrl,
  getServiceBySlug,
  serviceCatalog,
  siteConfig,
} from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    serviceCatalog.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const service = getServiceBySlug(safeLocale as Locale, slug);

  if (!service) {
    return {
      title: safeLocale === "ar" ? "الخدمة غير موجودة" : "Service not found",
    };
  }

  const title = `${service.title} | ${siteConfig.siteName[safeLocale as Locale]}`;
  const description = service.rich?.intro ?? service.shortDescription;
  const path = `/services/${slug}`;
  const alternates = getAlternateUrl(safeLocale as Locale, path);
  const canonicalUrl = `${siteConfig.baseUrl}/${safeLocale}${path}`;
  const imageUrl = service.image;

  return {
    title,
    description,
    keywords: [
      service.title,
      service.category,
      siteConfig.siteName[safeLocale as Locale],
      safeLocale === "ar" ? "عيادة أسنان دمشق" : "dental clinic Damascus",
      safeLocale === "ar" ? "طب أسنان سوريا" : "dental care Syria",
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
      type: "article",
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.siteName[safeLocale as Locale],
      locale: siteConfig.ogLocale[safeLocale as Locale],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
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

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  if (!locales.includes(safeLocale as Locale)) {
    notFound();
  }

  const service = getServiceBySlug(safeLocale as Locale, slug);
  if (!service) notFound();

  const messages = getMessages(safeLocale as Locale);
  const isArabic = safeLocale === "ar";
  const rich = service.rich;

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.rich?.intro ?? service.shortDescription,
    image: service.image,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    howPerformed: service.rich?.sections?.map((s) => s.heading).join(" · "),
    provider: {
      "@type": "Dentist",
      name: siteConfig.siteName[safeLocale as Locale],
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.geo.placename[safeLocale as Locale],
        addressCountry: siteConfig.geo.region,
      },
      telephone: clinicContactData.call,
    },
    url: `${siteConfig.baseUrl}/${safeLocale}/services/${slug}`,
  };

  // قائمة "خدمات أخرى" — نستثني الحالية
  const otherServices = serviceCatalog
    .filter((s) => s.slug !== service.slug)
    .slice(0, 6);

  return (
    <main
      className="min-h-screen bg-background-soft text-foreground"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header locale={safeLocale as Locale} nav={messages.nav} />

      <div className="pt-28">
        <Breadcrumbs
          locale={safeLocale as Locale}
          items={[
            {
              href: `/${safeLocale}/services`,
              label: isArabic ? "الخدمات" : "Services",
            },
            { label: service.title },
          ]}
        />

        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={service.category}
          title={service.title}
          description={rich?.intro ?? service.shortDescription}
        />

        {/* ── Highlights ── */}
        <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {service.highlight.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-primary">
                  ✓
                </span>
                <span className="text-sm font-medium leading-6 text-foreground">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Main grid: Sidebar + Content ── */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            {/* ═══ SIDEBAR ═══ */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {/* صورة الخدمة */}
              <div className="overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_14px_32px_rgba(122,28,81,0.05)]">
                <div className="relative h-56 w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* نموذج الطلب */}
              <ServiceRequestForm locale={safeLocale as Locale} />

              {/* قائمة خدمات أخرى */}
              {otherServices.length > 0 && (
                <div className="rounded-[28px] border border-border bg-surface p-5 shadow-sm">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal">
                    {isArabic ? "خدمات أخرى" : "Other services"}
                  </p>
                  <ul className="space-y-2">
                    {otherServices.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/${safeLocale}/services/${s.slug}`}
                          className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-foreground-muted transition hover:bg-background-soft hover:text-primary"
                        >
                          <span>{s.title[safeLocale as Locale]}</span>
                          <span className="text-xs text-teal">
                            {isArabic ? "‹" : "›"}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="space-y-8">
              {rich?.sections && rich.sections.length > 0 ? (
                rich.sections.map((section, idx) => (
                  <article
                    key={idx}
                    className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(122,28,81,0.04)] sm:p-8"
                  >
                    <h2 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">
                      {section.heading}
                    </h2>

                    {section.paragraphs.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {section.paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="text-base leading-8 text-foreground-muted"
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    )}

                    {section.bullets.length > 0 && (
                      <ul className="mt-4 space-y-3">
                        {section.bullets.map((b, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-base leading-7 text-foreground-muted"
                          >
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))
              ) : (
                <div className="rounded-[28px] border border-border bg-surface p-8 text-center">
                  <p className="text-foreground-muted">
                    {isArabic
                      ? "لا توجد تفاصيل إضافية لهذه الخدمة حاليًا. تواصل معنا للاستفسار."
                      : "No additional details available for this service yet. Contact us for more information."}
                  </p>
                </div>
              )}

              {/* ── FAQs ── */}
              {rich?.faqs && rich.faqs.length > 0 && (
                <section className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(122,28,81,0.04)] sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
                    {isArabic ? "الأسئلة الشائعة" : "Frequently asked"}
                  </p>
                  <h2 className="mt-2 mb-6 text-2xl font-black text-primary sm:text-3xl">
                    {isArabic
                      ? "إجابات لأكثر الأسئلة تكرارًا"
                      : "Answers to common questions"}
                  </h2>
                  <FAQAccordion
                    items={rich.faqs.map((f) => ({
                      question: f.question,
                      answer: f.answer,
                    }))}
                    locale={safeLocale as "ar" | "en"}
                  />
                </section>
              )}

              {/* ── CTA ── */}
              <section className="rounded-[28px] bg-primary p-6 text-white shadow-[0_16px_34px_rgba(122,28,81,0.10)] sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                  {isArabic ? "جاهز للبدء؟" : "Ready to begin?"}
                </p>
                <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  {isArabic
                    ? "احجز استشارتك اليوم."
                    : "Book your consultation today."}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
                  {isArabic
                    ? "فريقنا جاهز للإجابة على أسئلتك ومساعدتك في اختيار الخطة المناسبة."
                    : "Our team is ready to answer your questions and help you choose the right plan."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/${safeLocale}/contact`}
                    className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-background-soft"
                  >
                    {isArabic ? "تواصل معنا" : "Contact us"}
                  </Link>
                  <a
                    href={`tel:${clinicContactData.call.replace(/\s+/g, "")}`}
                    className="inline-flex rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {isArabic ? "اتصل الآن" : "Call now"}
                  </a>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>

      <Footer
        locale={safeLocale as Locale}
        footer={{
          phone: clinicContactData.phone,
          email: clinicContactData.email,
          address:
            clinicContactData.address[safeLocale as "en" | "ar"],
        }}
        nav={messages.nav}
      />
    </main>
  );
}