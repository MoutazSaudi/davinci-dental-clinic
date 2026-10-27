import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { PageHeader } from "@/components/website/PageHeader";
import { clinicContactData, siteConfig } from "@/data/site";
import { getPublishedDoctors } from "@/lib/services/doctors";
import { locales, type Locale } from "@/lib/i18n";
import {
  buildMetadata,
  buildPageJsonLd,
  buildBreadcrumbSchema,
} from "@/data/seo";

export const dynamic = "force-dynamic";

const OG_IMAGE = "/images/doctors/DrMuhanad.jpeg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  return buildMetadata("doctors", safeLocale);
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

  if (!locales.includes(safeLocale as Locale)) notFound();

  const isArabic = safeLocale === "ar";
  const L = safeLocale as "ar" | "en";

  const doctors = await getPublishedDoctors();
  const featured = doctors[0];

  const pageUrl = `${siteConfig.baseUrl}/${safeLocale}/doctors`;
  const ogImageUrl = `${siteConfig.baseUrl}${featured?.image || OG_IMAGE}`;

  // Physician JSON-LD for each doctor
  const physicianLds = doctors.map((doc) => ({
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${pageUrl}/#${doc.slug}`,
    name: doc.name[L],
    jobTitle: doc.specialization[L] || undefined,
    description: doc.bio[L] || undefined,
    image: doc.image ? `${siteConfig.baseUrl}${doc.image}` : ogImageUrl,
    url: pageUrl,
    worksFor: { "@id": `${siteConfig.baseUrl}/#organization` },
    sameAs: [doc.instagram, doc.linkedin, clinicContactData.social.facebook, clinicContactData.social.instagram].filter(Boolean),
  }));

  const breadcrumbLd = buildBreadcrumbSchema(safeLocale, [
    { name: isArabic ? "الرئيسية" : "Home", path: "" },
    { name: isArabic ? "الأطباء" : "Doctors", path: "doctors" },
  ]);

  const jsonLdBlocks = buildPageJsonLd("doctors", safeLocale, [
    ...physicianLds,
    breadcrumbLd,
  ]);

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
              ? "نخبة من الأطباء المتخصصين، بخبرة أكاديمية وشغف بالرعاية الدقيقة لكل مريض."
              : "A team of specialized doctors with academic expertise and a passion for precise patient care."
          }
        />

        {/* Doctors list */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {doctors.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-border bg-background-soft p-8 text-center">
              <h3 className="text-xl font-bold text-primary">
                {isArabic ? "قريبًا" : "Coming soon"}
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-foreground-muted">
                {isArabic
                  ? "فريقنا الطبي قيد التحديث، تابعنا قريبًا."
                  : "Our medical team is being updated. Stay tuned."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {doctors.map((doc) => (
                <article
                  key={doc.slug}
                  className="group overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_16px_40px_rgba(122,28,81,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(122,28,81,0.12)]"
                >
                  <div className="relative aspect-[4/3] w-full bg-background-soft">
                    {doc.image ? (
                      <Image
                        src={doc.image}
                        alt={doc.name[L]}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
                        {isArabic ? "لا توجد صورة" : "No photo"}
                      </div>
                    )}
                    <div className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-primary shadow-xl">
                      {isArabic ? "طبيب" : "Doctor"}
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-black text-primary">
                      {doc.name[L]}
                    </h2>
                    {doc.specialization[L] && (
                      <p className="mt-2 text-sm font-semibold text-teal">
                        {doc.specialization[L]}
                      </p>
                    )}
                    {doc.bio[L] && (
                      <p className="mt-3 text-sm leading-7 text-foreground-muted line-clamp-4">
                        {doc.bio[L]}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/${safeLocale}/contact?doctor=${doc.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light"
                      >
                        {isArabic ? "احجز مع الطبيب" : "Book with doctor"}
                      </Link>
                      {doc.instagram && (
                        <a
                          href={doc.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-primary transition hover:border-teal hover:bg-mint hover:text-teal"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                          </svg>
                        </a>
                      )}
                      {doc.linkedin && (
                        <a
                          href={doc.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-primary transition hover:border-teal hover:bg-mint hover:text-teal"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Philosophy */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: isArabic ? "تشخيص دقيق أولًا" : "Precise diagnosis first",
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
                <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}