import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { PageHeader } from "@/components/website/PageHeader";
import { doctorCatalog } from "@/data/mock/doctors";
import { clinicContactData, getAlternateUrl, siteConfig } from "@/data/site";
import { getMessages, locales, type Locale } from "@/lib/i18n";

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
    ? `الأطباء | ${siteConfig.siteName.ar} — د. مهند سعودي`
    : `Doctors | ${siteConfig.siteName.en} — Dr. Muhanad Saudi`;

  const description = isArabic
    ? "د. مهند سعودي — استشاري آلام الوجه والمفصل الفكي الصدغي، حاصل على شهادة الاختصاص من جامعة جنوب كاليفورنيا (USC). متخصص في TMJ، الصداع، وآلام الأسنان."
    : "Dr. Muhanad Saudi — Orofacial Pain & TMJ Specialist, with a diploma from the University of Southern California (USC). Specialized in TMJ, headaches, and dental pain.";

  const path = "/doctors";
  const alternates = getAlternateUrl(safeLocale as Locale, path);
  const canonicalUrl = `${siteConfig.baseUrl}/${safeLocale}${path}`;
  const ogImageUrl = `${siteConfig.baseUrl}${OG_IMAGE}`;

  return {
    title,
    description,
    keywords: isArabic
      ? [
          "أطباء أسنان دمشق",
          "د. مهند سعودي",
          "استشاري TMJ",
          "آلام الوجه",
          "المفصل الفكي الصدغي",
          "تقويم الأسنان",
          "USC",
        ]
      : [
          "dental doctors Damascus",
          "Dr. Muhanad Saudi",
          "TMJ specialist",
          "orofacial pain",
          "temporomandibular joint",
          "orthodontics",
          "USC",
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
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
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

export default async function DoctorsPage({
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

  const pageUrl = `${siteConfig.baseUrl}/${safeLocale}/doctors`;
  const ogImageUrl = `${siteConfig.baseUrl}${OG_IMAGE}`;
  const logoUrl = `${siteConfig.baseUrl}/logo.png`;

  /* ═══════════════════════════════════════════
     Doctor data
     ═══════════════════════════════════════════ */
  const primaryDoctor = doctorCatalog[0];

  const doctorName = isArabic ? "د. مهند سعودي" : "Dr. Muhanad Saudi";
  const doctorTitle = isArabic
    ? "استشاري آلام الوجه والمفصل الفكي الصدغي"
    : "Orofacial Pain & TMJ Specialist";
  const doctorBio = isArabic
    ? "حصل على شهادة الاختصاص في آلام الوجه والمفصل الفكي الصدغي من جامعة جنوب كاليفورنيا (USC)، الولايات المتحدة. يهتم هذا التخصص بالآلام العصبية والعضلية في منطقة الوجه، والمفصل الفكي الصدغي، والصداع، وآلام الأذن، ومشاكل توقف التنفس أثناء النوم."
    : "Received a specialized diploma in Orofacial Pain and TMJ from the University of Southern California (USC), USA. This specialty focuses on neuromuscular pain in the facial region, TMJ disorders, headaches, ear pain, and sleep apnea.";
  const doctorImage = OG_IMAGE;

  const doctorCredentials = [
    { ar: "USC · USA", en: "USC · USA" },
    { ar: "دبلوم Orofacial Pain", en: "Orofacial Pain Diploma" },
    { ar: "عضو جمعية TMJ", en: "TMJ Association Member" },
  ];

  const doctorSpecialties = isArabic
    ? [
        "آلام الوجه",
        "المفصل الفكي الصدغي (TMJ)",
        "الصداع",
        "آلام الأذن",
        "توقف التنفس أثناء النوم",
        "تقويم الأسنان",
      ]
    : [
        "Facial Pain",
        "TMJ Disorders",
        "Headaches",
        "Ear Pain",
        "Sleep Apnea",
        "Orthodontics",
      ];

  /* ═══════════════════════════════════════════
     JSON-LD Blocks
     ═══════════════════════════════════════════ */

  const physicianLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${pageUrl}/#physician`,
    name: doctorName,
    alternateName: isArabic ? "Dr. Muhanad Saudi" : "د. مهند سعودي",
    jobTitle: doctorTitle,
    description: doctorBio,
    image: ogImageUrl,
    url: pageUrl,
    medicalSpecialty: ["Orthodontic", "PainMedicine", "OralSurgery"],
    knowsAbout: doctorSpecialties,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Southern California (USC)",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Los Angeles",
        addressCountry: "US",
      },
    },
    worksFor: {
      "@id": `${siteConfig.baseUrl}/#organization`,
    },
    sameAs: [
      clinicContactData.social.facebook,
      clinicContactData.social.instagram,
    ],
  };

  const clinicLd = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalBusiness"],
    "@id": `${siteConfig.baseUrl}/#organization`,
    name: siteConfig.siteName[L],
    url: siteConfig.baseUrl,
    logo: logoUrl,
    image: [ogImageUrl],
    telephone: "+971555449975",
    email: clinicContactData.email,
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
    employee: {
      "@id": `${pageUrl}/#physician`,
    },
    sameAs: [
      clinicContactData.social.facebook,
      clinicContactData.social.instagram,
    ],
  };

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
        name: isArabic ? "الأطباء" : "Doctors",
        item: pageUrl,
      },
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: isArabic
      ? "الأطباء | دافينشي لطب الأسنان"
      : "Doctors | Davinci Dental Clinic",
    description: doctorBio,
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

  const jsonLdBlocks = [physicianLd, clinicLd, breadcrumbLd, webPageLd];

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
          items={[{ label: isArabic ? "الأطباء" : "Doctors" }]}
        />

        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "فريقنا الطبي" : "Our medical team"}
          title={
            isArabic
              ? "خبرة أكاديمية ورعاية إنسانية."
              : "Academic expertise, human care."
          }
          description={
            isArabic
              ? "يقود فريقنا طبيب متخصص في آلام الوجه والمفصل الفكي الصدغي، بخبرة أكاديمية من جامعة USC، وشغف بالرعاية الدقيقة والمريحة لكل مريض."
              : "Our team is led by a specialist in orofacial pain and TMJ, with academic training from USC and a passion for precise, comfortable patient care."
          }
        />

        {/* ═══ Featured Doctor ═══ */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[32px] border border-border bg-surface shadow-[0_20px_50px_rgba(122,28,81,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Image column */}
              <div className="relative h-96 w-full lg:h-auto lg:min-h-[560px]">
                <Image
                  src={doctorImage}
                  alt={doctorName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-top"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent lg:bg-gradient-to-r lg:rtl:bg-gradient-to-l"
                />
                <span className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-bold tracking-wider text-primary shadow-2xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  USC · USA
                </span>
              </div>

              {/* Content column */}
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold-dark">
                  {isArabic ? "المشرف الطبي" : "Medical Lead"}
                </p>

                <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
                  {doctorName}
                </h1>

                <p className="mt-2 text-base font-semibold text-teal sm:text-lg">
                  {doctorTitle}
                </p>

                <div className="my-6 h-[3px] w-20 rounded-full bg-gold" />

                <p className="text-base leading-8 text-foreground-muted">
                  {doctorBio}
                </p>

                {/* Specialties */}
                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-teal">
                    {isArabic ? "مجالات التخصص" : "Specialty areas"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doctorSpecialties.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-background-soft px-3 py-1.5 text-xs font-medium text-foreground-muted transition-all hover:border-teal/50 hover:text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Credentials */}
                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-teal">
                    {isArabic ? "الشهادات" : "Credentials"}
                  </p>
                  <ul className="space-y-2">
                    {doctorCredentials.map((cred) => (
                      <li
                        key={cred.en}
                        className="flex items-center gap-3 text-sm text-foreground"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-xs text-teal">
                          ✓
                        </span>
                        <span>{isArabic ? cred.ar : cred.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${safeLocale}/contact`}
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(122,28,81,0.20)] transition-all hover:bg-primary-light"
                  >
                    {isArabic ? "احجز استشارة" : "Book a consultation"}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                    >
                      ›
                    </span>
                  </Link>

                  <a
                    href={clinicContactData.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-primary transition-all hover:border-teal hover:bg-mint hover:text-teal"
                  >
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
                      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                    </svg>
                  </a>
                  <a
                    href={clinicContactData.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-primary transition-all hover:border-teal hover:bg-mint hover:text-teal"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Philosophy ═══ */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: isArabic
                  ? "تشخيص دقيق أولًا"
                  : "Precise diagnosis first",
                body: isArabic
                  ? "لا نبدأ العلاج قبل فهم الحالة كاملة — الأشعة، التاريخ الطبي، والفحص السريري."
                  : "We never start treatment before understanding the full case — imaging, medical history, and clinical examination.",
              },
              {
                title: isArabic ? "رعاية بلا ألم" : "Pain-free care",
                body: isArabic
                  ? "تقنيات تخدير حديثة وأساليب لطيفة تضمن تجربة مريحة من أول زيارة."
                  : "Modern anesthesia and gentle techniques ensure a comfortable experience from the first visit.",
              },
              {
                title: isArabic ? "خطط مخصصة" : "Customized plans",
                body: isArabic
                  ? "لكل مريض حالة مختلفة. نبني خطة علاج تناسبه هو، لا العكس."
                  : "Every patient is different. We build a plan that fits them — not the other way around.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[26px] border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(122,28,81,0.04)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-xl text-teal">
                  ✦
                </div>
                <h3 className="text-lg font-bold text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-foreground-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ Coming Soon ═══ */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-dashed border-border bg-background-soft p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">
              {isArabic ? "قريبًا" : "Coming soon"}
            </p>
            <h3 className="mt-3 text-xl font-bold text-primary sm:text-2xl">
              {isArabic
                ? "فريق طبي متكامل ينضم قريبًا"
                : "A full medical team joining soon"}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-foreground-muted">
              {isArabic
                ? "نعمل على توسيع فريقنا بأطباء متخصصين في مختلف فروع طب الأسنان — التركيبات، جراحة الفم، طب أسنان الأطفال، وتقويم الأسنان."
                : "We're expanding our team with specialists in various dental fields — prosthodontics, oral surgery, pediatric dentistry, and orthodontics."}
            </p>
            <Link
              href={`/${safeLocale}/contact`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light"
            >
              {isArabic ? "تواصل معنا" : "Contact us"}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}