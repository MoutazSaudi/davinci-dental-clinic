import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { ContactForm } from "@/components/website/ContactForm";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { clinicContactData } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  return {
    title: isArabic ? "تواصل معنا | عيادة دمشق" : "Contact Us | Damascus Dental Clinic",
    description: isArabic ? "تواصل مع عيادة دمشق للأسنان للحصول على المعلومات، الاستشارة، أو حجز المواعيد." : "Contact Damascus Dental Clinic for treatment information, consultations, and appointments.",
    alternates: {
      languages: {
        en: "/en/contact",
        ar: "/ar/contact",
      },
    },
    openGraph: {
      title: isArabic ? "تواصل معنا" : "Contact us",
      description: isArabic ? "تواصل مع عيادة دمشق للأسنان." : "Get in touch with the clinic.",
      url: `/${safeLocale}/contact`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  if (!locales.includes(safeLocale as Locale)) {
    notFound();
  }

  const messages = getMessages(safeLocale as Locale);
  const isArabic = safeLocale === "ar";

  const infoCards = [
    {
      title: isArabic ? "واتساب" : "WhatsApp",
      value: clinicContactData.whatsapp,
      href: `https://wa.me/${clinicContactData.whatsapp.replace(/\D/g, "")}`,
      icon: "✆",
    },
    {
      title: isArabic ? "اتصال" : "Call",
      value: clinicContactData.call,
      href: `tel:${clinicContactData.call.replace(/\s+/g, "")}`,
      icon: "☎",
    },
    {
      title: isArabic ? "البريد الإلكتروني" : "Email",
      value: clinicContactData.email,
      href: `mailto:${clinicContactData.email}`,
      icon: "✉",
    },
    {
      title: isArabic ? "العنوان" : "Address",
      value: clinicContactData.address[safeLocale as "en" | "ar"],
      href: "https://maps.google.com/?q=Damascus%20Syria",
      icon: "⌂",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f9f8] text-[#172b36]" dir={isArabic ? "rtl" : "ltr"}>
      <Header locale={safeLocale as Locale} nav={messages.nav} />

      <div className="pt-28">
        <Breadcrumbs locale={safeLocale as Locale} items={[{ label: isArabic ? "تواصل معنا" : "Contact" }]} />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "تواصل معنا" : "Contact"}
          title={isArabic ? "نحن هنا لمساعدتك في اتخاذ الخطوة التالية." : "We’re here to help you take the next step."}
          description={
            isArabic
              ? "استخدم المعلومات أو النموذج أدناه لطرح أسئلة حول الخدمة، الحجز، أو أي استفسار يتعلق برعاية الأسنان."
              : "Use the information below or the form to ask about treatment, scheduling, or any general question about dental care."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {infoCards.map((card) => (
              <a key={card.title} href={card.href} className="rounded-[24px] border border-[#e5eeeb] bg-white p-5 shadow-[0_12px_28px_rgba(11,59,90,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(11,59,90,0.08)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf6f5] text-xl text-[#2b7a78]">{card.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-[#0b3b5a]">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.value}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[30px] bg-[#0b3b5a] p-6 text-white shadow-[0_18px_42px_rgba(11,59,90,0.12)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c6a664]">
                {isArabic ? "موقع العيادة" : "Clinic location"}
              </p>
              <h3 className="mt-4 text-3xl font-black">{isArabic ? "دمشق، سوريا" : "Damascus, Syria"}</h3>
              <p className="mt-4 text-base leading-8 text-white/80">
                {isArabic
                  ? "نقطة التقاء مريحة للمرضى الذين يبحثون عن رعاية أسنان متخصصة وحلول علاجية واضحة."
                  : "A convenient location for patients looking for predictable, professional dental care in a calm setting."}
              </p>
              <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
                <iframe
                  title="Clinic location map"
                  src="https://www.google.com/maps?q=Damascus%20Syria&z=12&output=embed"
                  loading="lazy"
                  className="h-80 w-full border-0"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-[#e5eeeb] bg-slate-900 shadow-[0_18px_42px_rgba(11,59,90,0.1)]">
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop"
                  alt={isArabic ? "فريق طبي في عيادة" : "Medical team in clinic"}
                  fill
                  className="object-cover opacity-30"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <ContactForm locale={safeLocale as Locale} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer locale={safeLocale as Locale} footer={{ phone: clinicContactData.phone, email: clinicContactData.email, address: clinicContactData.address[safeLocale as "en" | "ar"] }} nav={messages.nav} />
    </main>
  );
}
