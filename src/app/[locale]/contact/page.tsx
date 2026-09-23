import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { ContactForm } from "@/components/website/ContactForm";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { getAlternateUrl, clinicContactData, siteConfig } from "@/data/site";
import { getMessages, locales, type Locale } from "@/lib/i18n";

const WHATSAPP_NUMBER = "971555449975";
const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8298.26066247907!2d36.29726462398486!3d33.52130334388944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e73a684378c9%3A0x3224c91b3bccc9f6!2z2KfZhNi02YfYr9in2KHYjCDYr9mF2LTZgtiMINiz2YjYsdmK2Kc!5e1!3m2!1sar!2snl!4v1790170800084!5m2!1sar!2snl";
const OG_IMAGE = "/images/doctors/DrMuhanad.jpeg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  const title = isArabic
    ? `تواصل معنا | ${siteConfig.siteName.ar} — دمشق`
    : `Contact Us | ${siteConfig.siteName.en} — Damascus`;

  const description = isArabic
    ? "تواصل مع دافينشي لطب الأسنان عبر واتساب، الهاتف، البريد الإلكتروني، أو نموذج مباشر. عيادتنا في المزرعة، دمشق، سوريا."
    : "Contact Davinci Dental Clinic via WhatsApp, phone, email, or direct form. Our clinic is in Al-Mazraa, Damascus, Syria.";

  const path = "/contact";
  const alternates = getAlternateUrl(safeLocale as Locale, path);
  const canonicalUrl = `${siteConfig.baseUrl}/${safeLocale}${path}`;
  const ogImageUrl = `${siteConfig.baseUrl}${OG_IMAGE}`;

  return {
    title,
    description,
    keywords: isArabic
      ? [
          "تواصل عيادة أسنان",
          "حجز موعد أسنان دمشق",
          "واتساب عيادة أسنان",
          "رقم عيادة دافينشي",
          "عيادة أسنان المزرعة",
          "تواصل دافينشي دمشق",
        ]
      : [
          "dental clinic contact",
          "book dental appointment Damascus",
          "dental clinic WhatsApp",
          "Davinci Dental Clinic phone",
          "dental clinic Al-Mazraa",
          "contact Davinci Damascus",
        ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [siteConfig.hreflang.ar]: alternates.ar,
        [siteConfig.hreflang.en]: alternates.en,
        "x-default": alternates.en,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.siteName[safeLocale as Locale],
      locale: siteConfig.ogLocale[safeLocale as Locale],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
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

export default async function ContactPage({
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

  const pageUrl = `${siteConfig.baseUrl}/${safeLocale}/contact`;
  const ogImageUrl = `${siteConfig.baseUrl}${OG_IMAGE}`;
  const logoUrl = `${siteConfig.baseUrl}/logo.png`;

  /* ═══════════════════════════════════════════════════
     JSON-LD Blocks
     ═══════════════════════════════════════════════════ */

  // 1) ContactPage
  const contactPageLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: isArabic
      ? "تواصل معنا | دافينشي لطب الأسنان"
      : "Contact Us | Davinci Dental Clinic",
    description: isArabic
      ? "تواصل مع دافينشي لطب الأسنان — دمشق، سوريا."
      : "Contact Davinci Dental Clinic — Damascus, Syria.",
    inLanguage: isArabic ? "ar-SY" : "en-US",
    isPartOf: {
      "@id": `${siteConfig.baseUrl}/#website`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
  };

  // 2) BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isArabic ? "الرئيسية" : "Home",
        item: `${siteConfig.baseUrl}/${safeLocale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isArabic ? "تواصل معنا" : "Contact",
        item: pageUrl,
      },
    ],
  };

  // 3) MedicalClinic / LocalBusiness with full contact details
  const clinicLd = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalClinic", "LocalBusiness"],
    "@id": `${siteConfig.baseUrl}/#organization`,
    name: siteConfig.siteName[L],
    alternateName: isArabic
      ? "Davinci Dental Clinic"
      : "دافينشي لطب الأسنان",
    description: isArabic
      ? "عيادة متخصصة في طب الأسنان وتقويم الأسنان في دمشق."
      : "A dental clinic specialized in dentistry and orthodontics in Damascus.",
    url: siteConfig.baseUrl,
    logo: logoUrl,
    image: [ogImageUrl],
    telephone: "+971555449975",
    email: clinicContactData.email,
    priceRange: "$$",
    currenciesAccepted: "USD, AED, SYP",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: isArabic ? "المزرعة" : "Al-Mazraa",
      addressLocality: isArabic ? "دمشق" : "Damascus",
      addressCountry: "SY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.5213033,
      longitude: 36.2972646,
    },
    hasMap: "https://maps.google.com/?q=Al-Mazraa+Damascus+Syria",
    sameAs: [
      clinicContactData.social.facebook,
      clinicContactData.social.instagram,
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+971555449975",
        contactType: isArabic ? "خدمة العملاء" : "customer service",
        availableLanguage: ["ar", "en"],
        areaServed: ["SY", "AE"],
      },
    ],
  };

  // 4) Website (links the org)
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.baseUrl}/#website`,
    url: siteConfig.baseUrl,
    name: siteConfig.siteName[L],
    inLanguage: isArabic ? "ar-SY" : "en-US",
    publisher: {
      "@id": `${siteConfig.baseUrl}/#organization`,
    },
  };

  const jsonLdBlocks = [contactPageLd, breadcrumbLd, clinicLd, websiteLd];

  /* ═══════════════════════════════════════════════════
     Info Cards
     ═══════════════════════════════════════════════════ */

  const infoCards = [
    {
      key: "whatsapp",
      title: isArabic ? "واتساب" : "WhatsApp",
      value: "+971 55 544 9975",
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      external: true,
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
    },
    {
      key: "call",
      title: isArabic ? "اتصال" : "Call",
      value: "+971 55 544 9975",
      href: "tel:+971555449975",
      external: false,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
          />
        </svg>
      ),
    },
    {
      key: "email",
      title: isArabic ? "البريد الإلكتروني" : "Email",
      value: clinicContactData.email,
      href: `mailto:${clinicContactData.email}`,
      external: false,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
      ),
    },
    {
      key: "address",
      title: isArabic ? "العنوان" : "Address",
      value: clinicContactData.address[L],
      href: "https://maps.google.com/?q=Al-Mazraa+Damascus+Syria",
      external: true,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
      ),
    },
  ];

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
          items={[{ label: isArabic ? "تواصل معنا" : "Contact" }]}
        />

        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "تواصل معنا" : "Contact"}
          title={
            isArabic
              ? "نحن هنا لمساعدتك في اتخاذ الخطوة التالية."
              : "We're here to help you take the next step."
          }
          description={
            isArabic
              ? "تواصل معنا عبر واتساب، الهاتف، البريد الإلكتروني، أو النموذج المباشر — وسنعاود الاتصال بك في أقرب وقت."
              : "Reach us via WhatsApp, phone, email, or the direct form — we'll get back to you as soon as possible."
          }
        />

        {/* ═══ Info Cards ═══ */}
        <section
          aria-label={isArabic ? "طرق التواصل" : "Contact methods"}
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((card) => (
              <a
                key={card.key}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className="group rounded-[24px] border border-border bg-surface p-5 shadow-[0_12px_28px_rgba(122,28,81,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_18px_38px_rgba(122,28,81,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-teal transition-transform duration-300 group-hover:scale-105">
                  {card.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-primary">
                  {card.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-7 text-foreground-muted"
                  dir={
                    card.key === "whatsapp" || card.key === "call"
                      ? "ltr"
                      : undefined
                  }
                >
                  {card.value}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* ═══ Map + Form ═══ */}
        <section
          aria-label={isArabic ? "الموقع والنموذج" : "Location and form"}
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Map card */}
            <div className="overflow-hidden rounded-[30px] bg-primary p-6 text-white shadow-[0_20px_50px_rgba(122,28,81,0.15)] sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                  {isArabic ? "موقع العيادة" : "Clinic location"}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-light" />
                  {isArabic ? "مفتوح" : "Open"}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                {isArabic ? "دمشق، سوريا" : "Damascus, Syria"}
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/80">
                {isArabic
                  ? "عيادتنا في منطقة المزرعة، دمشق. على بعد دقائق من وسط المدينة، مع سهولة الوصول عبر المواصلات العامة أو السيارة."
                  : "Our clinic is in Al-Mazraa, Damascus. Minutes from the city center, easily reachable by public transport or car."}
              </p>

              <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
                <iframe
                  title={
                    isArabic
                      ? "موقع دافينشي لطب الأسنان على الخريطة"
                      : "Davinci Dental Clinic on map"
                  }
                  src={MAP_EMBED_SRC}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="h-80 w-full border-0"
                />
              </div>

              <a
                href="https://maps.google.com/?q=Al-Mazraa+Damascus+Syria"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-background-soft"
              >
                {isArabic ? "افتح في خرائط جوجل" : "Open in Google Maps"}
                <svg
                  className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover/btn:-translate-x-0.5 rtl:group-hover/btn:-translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </a>
            </div>

            {/* Form */}
            <div className="relative">
              <ContactForm
                locale={safeLocale as Locale}
                whatsappNumber={WHATSAPP_NUMBER}
              />
            </div>
          </div>
        </section>

        {/* ═══ Hours + Social ═══ */}
        <section
          aria-label={isArabic ? "ساعات العمل والتابعون" : "Hours and social"}
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Hours */}
            <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_14px_34px_rgba(122,28,81,0.04)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
                {isArabic ? "ساعات العمل" : "Opening hours"}
              </p>
              <h3 className="mt-3 text-2xl font-black text-primary">
                {isArabic
                  ? "نستقبلكم خلال الأسبوع"
                  : "We welcome you all week"}
              </h3>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  {
                    day: isArabic ? "السبت — الخميس" : "Saturday — Thursday",
                    hours: "10:00 — 20:00",
                    closed: false,
                  },
                  {
                    day: isArabic ? "الجمعة" : "Friday",
                    hours: isArabic ? "مغلق" : "Closed",
                    closed: true,
                  },
                ].map((row) => (
                  <li
                    key={row.day}
                    className="flex items-center justify-between border-b border-dashed border-border pb-3 last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-foreground">
                      {row.day}
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        row.closed ? "text-foreground-light" : "text-primary"
                      }`}
                      dir={row.closed ? undefined : "ltr"}
                    >
                      {row.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_14px_34px_rgba(122,28,81,0.04)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
                {isArabic ? "تابعنا" : "Follow us"}
              </p>
              <h3 className="mt-3 text-2xl font-black text-primary">
                {isArabic ? "على وسائل التواصل" : "On social media"}
              </h3>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={clinicContactData.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="group inline-flex items-center gap-3 rounded-full border border-border bg-background-soft px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-teal hover:bg-surface"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-white transition-transform group-hover:scale-105">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </span>
                  Facebook
                </a>
                <a
                  href={clinicContactData.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="group inline-flex items-center gap-3 rounded-full border border-border bg-background-soft px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-teal hover:bg-surface"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white transition-transform group-hover:scale-105">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="0.8"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  Instagram
                </a>
              </div>

              <p className="mt-6 text-sm leading-7 text-foreground-muted">
                {isArabic
                  ? "تابعنا للحصول على نصائح صحة الفم، آخر التقنيات، وقصص مرضى العيادة."
                  : "Follow us for oral health tips, latest technology, and patient stories from our clinic."}
              </p>
            </div>
          </div>
        </section>
      </div>

    </main>
  );
}