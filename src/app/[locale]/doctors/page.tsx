import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import {  doctorCatalog } from "@/data/mock/doctors";
import { clinicContactData } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  return {
    title: isArabic ? "الأطباء | عيادة دمشق" : "Doctors | Damascus Dental Clinic",
    description: isArabic ? "تعرف على فريق العيادة واهتمامه بالرعاية الدقيقة والمريحة للمرضى." : "Meet the clinic team and learn about their approach to careful, patient-centered care.",
    alternates: {
      languages: {
        en: "/en/doctors",
        ar: "/ar/doctors",
      },
    },
    openGraph: {
      title: isArabic ? "فريقنا الطبي" : "Our medical team",
      description: isArabic ? "فريق طبي يركز على الرعاية المريحة." : "A care-focused dental team.",
      url: `/${safeLocale}/doctors`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function DoctorsPage({ params }: { params: Promise<{ locale: string }> }) {
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
        <Breadcrumbs locale={safeLocale as Locale} items={[{ label: isArabic ? "الأطباء" : "Doctors" }]} />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "فريقنا الطبي" : "Our medical team"}
          title={isArabic ? "أطباء يقدّمون رعاية مريحة ومهنية." : "A clinical team focused on calm, thoughtful care."}
          description={
            isArabic
              ? "يعمل فريقنا مع المرضى على بناء خطط مناسبة لكل حالة، مع الحفاظ على التواصل الواضح، والراحة، وتوسيع الفهم حول الخيارات العلاجية."
              : "Our team works with each patient to build a plan that fits the case, with clear communication, comfort, and practical guidance throughout treatment."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {doctorCatalog.map((doctor) => {
              const specialization = isArabic ? doctor.specialization.ar : doctor.specialization.en;
              const bio = isArabic ? doctor.bio.ar : doctor.bio.en;

              return (
                <article key={doctor.slug} className="overflow-hidden rounded-[28px] border border-[#e5eeeb] bg-white shadow-[0_14px_32px_rgba(11,59,90,0.04)]">
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image src={doctor.image} alt={doctor.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">{specialization}</p>
                    <h3 className="mt-3 text-2xl font-black text-[#0b3b5a]">{doctor.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{bio}</p>

                    <div className="mt-5 flex items-center gap-3">
                      {doctor.social?.instagram ? (
                        <Link href={doctor.social.instagram} aria-label={`${doctor.name} Instagram`} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf6f5] text-[#0b3b5a]">
                          IG
                        </Link>
                      ) : null}
                      {doctor.social?.linkedin ? (
                        <Link href={doctor.social.linkedin} aria-label={`${doctor.name} LinkedIn`} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf6f5] text-[#0b3b5a]">
                          in
                        </Link>
                      ) : null}
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
