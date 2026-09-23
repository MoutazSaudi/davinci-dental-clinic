import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AboutAndTeamSection } from "@/components/website/AboutAndTeamSection";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { TestimonialsAndFAQ } from "@/components/website/TestimonialsAndFAQ";
import { doctorCatalog } from "@/data/mock/doctors";
import { clinicValues } from "@/data/mock/services";
import { clinicContactData, getAlternateUrl, siteConfig } from "@/data/site";
import { homeTestimonials } from "@/data/mock/testimonials";
import { getMessages, locales, type Locale } from "@/lib/i18n";

const OG_IMAGE = "/images/doctors/DrMuhanad.jpeg";

const SOCIAL_LINKS = [
  "https://www.facebook.com/mouhannad.saoudi.2025",
  "https://www.instagram.com/tmj.dr.mouhannad",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  const title = isArabic
    ? "من نحن | دافينشي لطب الأسنان — دمشق وأبوظبي"
    : "About Us | Davinci Dental Clinic — Damascus & Abu Dhabi";

  const description = isArabic
    ? "دافينشي لطب الأسنان — رعاية متخصصة في تقويم الأسنان وآلام الوجه والمفصل الفكي الصدغي. فرعان في دمشق وأبوظبي، بخبرة أكاديمية من جامعة USC."
    : "Davinci Dental Clinic — specialized care in orthodontics, orofacial pain and TMJ. Two branches in Damascus and Abu Dhabi, with academic training from USC.";

  const path = "/about";
  const alternates = getAlternateUrl(safeLocale as Locale, path);
  const canonicalUrl = `${siteConfig.baseUrl}/${safeLocale}${path}`;
  const ogImageUrl = `${siteConfig.baseUrl}${OG_IMAGE}`;

  return {
    title,
    description,
    keywords: isArabic
      ? [
          "عيادة أسنان دمشق",
          "عيادة أسنان أبوظبي",
          "دافينشي لطب الأسنان",
          "تقويم الأسنان",
          "آلام الوجه",
          "المفصل الفكي الصدغي",
          "طب الأسنان في سوريا",
          "طب الأسنان في الإمارات",
        ]
      : [
          "dental clinic Damascus",
          "dental clinic Abu Dhabi",
          "Davinci Dental Clinic",
          "orthodontics",
          "orofacial pain",
          "TMJ treatment",
          "dentistry in Syria",
          "dentistry in UAE",
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

export default async function AboutPage({
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

  const doctors = doctorCatalog.map((d) => ({
    name: d.name,
    specialty: d.specialization[L],
    initials: d.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  }));

  const aboutContent = {
    eyebrow: isArabic ? "عن العيادة" : "About the clinic",
    title: isArabic
      ? "رعاية أسنان تجمع بين الخبرة الأكاديمية والدفء الإنساني."
      : "Dental care combining academic expertise with human warmth.",
    description: isArabic
      ? "بدأت دافينشي لطب الأسنان من فكرة بسيطة: أن يجد المريض بيئة هادئة، تشخيصًا صادقًا، وخطة علاج واضحة. اليوم، وبعد سنوات من العمل، أصبح لدينا فرعان — في دمشق وأبوظبي — يخدمان مرضى من مختلف الأعمار بنفس الالتزام."
      : "Davinci Dental Clinic began with a simple idea: that every patient deserves a calm environment, an honest diagnosis, and a clear treatment plan. Today, with two branches — in Damascus and Abu Dhabi — we serve patients of all ages with the same commitment.",
    stats: [
      {
        value: `${doctors.length}+`,
        label: isArabic ? "أطباء متخصصون" : "Specialist doctors",
      },
      {
        value: "30+",
        label: isArabic ? "خدمة علاجية" : "Treatment services",
      },
      {
        value: "2",
        label: isArabic ? "فرعان دوليان" : "International branches",
      },
    ],
  };

  /* ═══════════════════════════════════════════════════
     JSON-LD — Complete Structured Data
     ═══════════════════════════════════════════════════ */

  const pageUrl = `${siteConfig.baseUrl}/${safeLocale}/about`;
  const logoUrl = `${siteConfig.baseUrl}/logo.png`;
  const ogImageUrl = `${siteConfig.baseUrl}${OG_IMAGE}`;

  // 1) Organization / MedicalBusiness (Main entity)
  const medicalBusinessLd = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "Dentist"],
    "@id": `${siteConfig.baseUrl}/#organization`,
    name: siteConfig.siteName[L],
    alternateName: isArabic
      ? "Davinci Dental Clinic"
      : "دافينشي لطب الأسنان",
    description: aboutContent.description,
    url: siteConfig.baseUrl,
    logo: logoUrl,
    image: [ogImageUrl],
    telephone: "+971555449975",
    email: clinicContactData.email,
    priceRange: "$$",
    currenciesAccepted: "USD, AED, SYP",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    founder: {
      "@type": "Person",
      name: isArabic ? "د. مهند سعودي" : "Dr. Muhanad Saudi",
      jobTitle: isArabic
        ? "استشاري آلام الوجه والمفصل الفكي الصدغي"
        : "Orofacial Pain & TMJ Specialist",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Southern California (USC)",
      },
    },
    sameAs: SOCIAL_LINKS,
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: isArabic ? "المزرعة" : "Al-Mazraa",
        addressLocality: isArabic ? "دمشق" : "Damascus",
        addressCountry: "SY",
      },
      {
        "@type": "PostalAddress",
        addressLocality: isArabic ? "أبوظبي" : "Abu Dhabi",
        addressCountry: "AE",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.5138,
      longitude: 36.2765,
    },
    areaServed: [
      { "@type": "Country", name: isArabic ? "سوريا" : "Syria" },
      { "@type": "Country", name: isArabic ? "الإمارات" : "UAE" },
    ],
    medicalSpecialty: [
      "Orthodontic",
      "OralSurgery",
      "Pediatric",
      "CosmeticDentistry",
      "PainMedicine",
      "Periodontic",
      "Endodontic",
    ],
    availableLanguage: ["ar", "en"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "18:00",
      },
    ],
  };

  // 2) WebSite (with SearchAction)
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.baseUrl}/#website`,
    url: siteConfig.baseUrl,
    name: siteConfig.siteName[L],
    inLanguage: L === "ar" ? "ar-SY" : "en-US",
    publisher: {
      "@id": `${siteConfig.baseUrl}/#organization`,
    },
  };

  // 3) WebPage (About page)
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: isArabic
      ? "من نحن | دافينشي لطب الأسنان"
      : "About Us | Davinci Dental Clinic",
    description: aboutContent.description,
    inLanguage: L === "ar" ? "ar-SY" : "en-US",
    isPartOf: {
      "@id": `${siteConfig.baseUrl}/#website`,
    },
    about: {
      "@id": `${siteConfig.baseUrl}/#organization`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
  };

  // 4) BreadcrumbList
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
        name: isArabic ? "من نحن" : "About us",
        item: pageUrl,
      },
    ],
  };

  // 5) MedicalClinic Location — Damascus
  const clinicDamascusLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${siteConfig.baseUrl}/#damascus-clinic`,
    name: isArabic
      ? "دافينشي لطب الأسنان — دمشق"
      : "Davinci Dental Clinic — Damascus",
    parentOrganization: {
      "@id": `${siteConfig.baseUrl}/#organization`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: isArabic ? "المزرعة" : "Al-Mazraa",
      addressLocality: isArabic ? "دمشق" : "Damascus",
      addressCountry: "SY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.5138,
      longitude: 36.2765,
    },
    telephone: "+971555449975",
    isAcceptingNewPatients: true,
  };

  // 6) MedicalClinic Location — Abu Dhabi
  const clinicAbuDhabiLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${siteConfig.baseUrl}/#abudhabi-clinic`,
    name: isArabic
      ? "دافينشي لطب الأسنان — أبوظبي"
      : "Davinci Dental Clinic — Abu Dhabi",
    parentOrganization: {
      "@id": `${siteConfig.baseUrl}/#organization`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: isArabic ? "أبوظبي" : "Abu Dhabi",
      addressCountry: "AE",
    },
    url: "https://davincidental.ae/",
    isAcceptingNewPatients: true,
  };

  // 7) AggregateRating (based on Google reviews shown)
  const aggregateRatingLd = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@id": `${siteConfig.baseUrl}/#organization`,
    },
    ratingValue: "5.0",
    bestRating: "5",
    worstRating: "1",
    reviewCount: homeTestimonials.length,
    reviewAspect: isArabic ? "رعاية الأسنان" : "Dental care",
  };

  const jsonLdBlocks = [
    medicalBusinessLd,
    websiteLd,
    webPageLd,
    breadcrumbLd,
    clinicDamascusLd,
    clinicAbuDhabiLd,
    aggregateRatingLd,
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
          items={[{ label: isArabic ? "من نحن" : "About us" }]}
        />

        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "عن العيادة" : "About the clinic"}
          title={
            isArabic
              ? "رعاية أسنان هادئة، متينة، ومصممة للثقة."
              : "Calm, trustworthy dental care designed around confidence."
          }
          description={
            isArabic
              ? "نركز على خلق تجربة مريحة وواضحة، مع رعاية قائمة على التقييم المهني والتخطيط الشخصي. هدفنا هو مساعدة المرضى على الشعور بالثقة في كل خطوة من رحلتهم العلاجية."
              : "We focus on a relaxed, clear experience built around professional assessment and personal treatment planning. Our aim is to help patients feel confident at every step of their care journey."
          }
        />

        {/* ═══ About + Lead Specialist + Team ═══ */}
        <AboutAndTeamSection
          locale={L}
          about={aboutContent}
          doctors={doctors}
        />

        {/* ═══ Locations — Damascus + Abu Dhabi ═══ */}
        <section className="bg-surface py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal">
                {isArabic ? "تواجدنا" : "Our Presence"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl">
                {isArabic
                  ? "عيادتان، اسم واحد، رسالة واحدة."
                  : "Two clinics, one name, one mission."}
              </h2>
              <p className="mt-5 text-base leading-8 text-foreground-muted">
                {isArabic
                  ? "نقدّم رعاية أسنان متخصصة من موقعين استراتيجيين — دمشق وأبوظبي — تحت اسم دافينشي لطب الأسنان، بنفس المعايير العالية ونفس الفريق الخبير الذي يجمع بين التدريب الأكاديمي من جامعة USC والخبرة العملية الطويلة."
                  : "We provide specialized dental care from two strategic locations — Damascus and Abu Dhabi — under the Davinci Dental Clinic name, with the same high standards and the same expert team combining USC academic training with extensive clinical experience."}
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {/* Damascus */}
              <article className="group relative overflow-hidden rounded-[32px] border border-border bg-background-soft p-7 shadow-[0_14px_36px_rgba(122,28,81,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_24px_54px_rgba(122,28,81,0.12)] sm:p-9">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {isArabic ? "المقر الرئيسي" : "Headquarters"}
                  </span>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted">
                    <svg
                      className="h-4 w-4 text-teal"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.949 8.949 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    {isArabic ? "سوريا" : "Syria"}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black tracking-tight text-primary sm:text-3xl">
                  {isArabic ? "دافينشي لطب الأسنان" : "Davinci Dental Clinic"}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-base font-semibold text-teal">
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
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
                  {isArabic ? "دمشق، سوريا" : "Damascus, Syria"}
                </p>

                <p className="mt-5 text-sm leading-7 text-foreground-muted">
                  {isArabic
                    ? "مركزنا الرئيسي، حيث بدأت الرحلة. يخدم العيادة مرضى من مختلف الأعمار بتخصصات شاملة: تقويم الأسنان، التركيبات، الزراعة، وجراحة الفم والوجه والفكين."
                    : "Our main center, where the journey began. The clinic serves patients of all ages across multiple specialties: orthodontics, prosthodontics, implants, and oral & maxillofacial surgery."}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={`/${safeLocale}/contact`}
                    className="group/btn inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-light"
                  >
                    {isArabic ? "تواصل معنا" : "Contact us"}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 rtl:-scale-x-100"
                    >
                      ›
                    </span>
                  </Link>
                  <a
                    href={`tel:+971555449975`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-teal hover:text-teal"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                    {isArabic ? "اتصل الآن" : "Call now"}
                  </a>
                </div>
              </article>

              {/* Abu Dhabi */}
              <article className="group relative overflow-hidden rounded-[32px] border border-gold/40 bg-gradient-to-br from-primary to-primary-dark p-7 text-white shadow-[0_20px_50px_rgba(122,28,81,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(122,28,81,0.28)] sm:p-9">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 -end-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
                />

                <div className="relative flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-light">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {isArabic ? "الفرع الدولي" : "International Branch"}
                  </span>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/70">
                    <svg
                      className="h-4 w-4 text-gold-light"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.949 8.949 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    {isArabic ? "الإمارات" : "UAE"}
                  </span>
                </div>

                <h3 className="relative mt-6 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Davinci Dental Clinic
                </h3>

                <p className="relative mt-2 flex items-center gap-2 text-base font-semibold text-gold-light">
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
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
                  {isArabic ? "أبوظبي، الإمارات" : "Abu Dhabi, UAE"}
                </p>

                <p className="relative mt-5 text-sm leading-7 text-white/80">
                  {isArabic
                    ? "فرعنا الدولي في دولة الإمارات، حيث نقدّم نفس مستوى الرعاية الذي بدأنا به في دمشق — بخبرة فريقنا في طب الأسنان المتقدم، وتخصصات دقيقة في TMJ وآلام الوجه."
                    : "Our international branch in the UAE, where we deliver the same level of care that began in Damascus — with our team's expertise in advanced dentistry and specialized focus on TMJ and orofacial pain."}
                </p>

                <div className="relative mt-7 flex flex-wrap gap-3">
                  <a
                    href="https://davincidental.ae/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-primary shadow-[0_10px_24px_rgba(198,166,100,0.30)] transition-all hover:bg-gold-light"
                  >
                    {isArabic ? "زيارة الموقع" : "Visit website"}
                    <svg
                      className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl:group-hover/btn:-translate-x-0.5 rtl:group-hover/btn:-translate-y-0.5"
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
              </article>
            </div>
          </div>
        </section>

        {/* ═══ Vision & Mission ═══ */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_14px_34px_rgba(122,28,81,0.04)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
                {isArabic ? "رؤيتنا" : "Vision"}
              </p>
              <h3 className="mt-3 text-2xl font-black text-primary">
                {isArabic
                  ? "تحويل تجربة الأسنان إلى تجربة أكثر راحة وثقة."
                  : "To turn dental care into a more comfortable and confident experience."}
              </h3>
              <p className="mt-4 text-base leading-8 text-foreground-muted">
                {isArabic
                  ? "نطمح إلى تقديم رعاية أسنان تسمح للمرضى بالاستمرار في متابعة صحتهم مع راحة نفسية وثقة في القرارات العلاجية."
                  : "We aim to provide a dental care journey that helps patients feel at ease, confident in their decisions, and supported from consultation to aftercare."}
              </p>
            </div>

            <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_14px_34px_rgba(122,28,81,0.04)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
                {isArabic ? "مهمتنا" : "Mission"}
              </p>
              <h3 className="mt-3 text-2xl font-black text-primary">
                {isArabic
                  ? "تبسيط الرعاية العلاجية مع احترام كل مريض."
                  : "To make treatment clearer, calmer, and more tailored to every patient."}
              </h3>
              <p className="mt-4 text-base leading-8 text-foreground-muted">
                {isArabic
                  ? "نهدف إلى تقديم رعاية فعالة ومفهومة توازن بين الفن الطبي، وتحليل الحالة، والراحة النفسية للمريض."
                  : "We aim to deliver efficient, understandable care that balances clinical skill, clear communication, and a gentle patient experience."}
              </p>
            </div>
          </div>
        </section>

        {/* ═══ Values ═══ */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
              {isArabic ? "قيمنا" : "Values"}
            </p>
            <h3 className="mt-2 text-3xl font-black text-primary sm:text-4xl">
              {isArabic
                ? "أساس يُبنى عليه كل قرار طبي."
                : "The foundations behind every clinical decision."}
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {clinicValues.map((item) => (
              <article
                key={item.title.en}
                className="group rounded-[26px] border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(122,28,81,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_18px_40px_rgba(122,28,81,0.08)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-xl text-teal transition-transform duration-300 group-hover:scale-105">
                  ✦
                </div>
                <h4 className="text-xl font-bold text-primary">
                  {isArabic ? item.title.ar : item.title.en}
                </h4>
                <p className="mt-3 text-sm leading-7 text-foreground-muted">
                  {isArabic ? item.text.ar : item.text.en}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ═══ Testimonials (بدون FAQ) ═══ */}
        <TestimonialsAndFAQ
          locale={L}
          testimonials={homeTestimonials}
          heading={{
            eyebrow: isArabic ? "آراء المرضى" : "Patient stories",
            title: isArabic
              ? "تجارب حقيقية من مرضى العيادة"
              : "Real experiences from our patients",
          }}
        />

        {/* ═══ CTA ═══ */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-primary px-6 py-8 text-center text-white shadow-[0_20px_50px_rgba(122,28,81,0.15)] sm:px-8 lg:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
              {isArabic ? "جاهز للزيارة؟" : "Ready to visit?"}
            </p>
            <h3 className="mt-3 text-3xl font-black sm:text-4xl">
              {isArabic
                ? "دعونا نبدأ بخطوة رعاية مناسبة لك."
                : "Let's begin with a care plan that suits you."}
            </h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
              <Link
                href={`/${safeLocale}/contact`}
                className="rounded-full bg-white px-5 py-3 text-primary transition hover:bg-background-soft"
              >
                {isArabic ? "تواصل معنا" : "Contact us"}
              </Link>
              <a
                href={`tel:+971555449975`}
                className="rounded-full border border-white/30 px-5 py-3 text-white transition hover:bg-white/10"
              >
                {isArabic ? "اتصل الآن" : "Call now"}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}