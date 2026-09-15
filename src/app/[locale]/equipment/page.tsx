import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { clinicContactData, equipmentCatalog } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  return {
    title: isArabic ? "التقنية | عيادة دمشق" : "Technology | Damascus Dental Clinic",
    description: isArabic ? "تعرف على التقنيات الرقمية والملحقات التي تدعم رعاية دقيقة وراحة للمرضى." : "Explore the clinic’s modern dental technology and the tools that support precise, comfortable care.",
    alternates: {
      languages: {
        en: "/en/equipment",
        ar: "/ar/equipment",
      },
    },
    openGraph: {
      title: isArabic ? "التقنية" : "Technology",
      description: isArabic ? "تكنولوجيا حديثة لرعاية أكثر دقة." : "Modern technology supporting precise dental care.",
      url: `/${safeLocale}/equipment`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function EquipmentPage({ params }: { params: Promise<{ locale: string }> }) {
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
        <Breadcrumbs locale={safeLocale as Locale} items={[{ label: isArabic ? "التقنية" : "Technology" }]} />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "معدات العيادة" : "Clinic equipment"}
          title={isArabic ? "تقنيات حديثة تدعم رعاية دقيقة وأكثر راحة." : "Modern tools supporting accurate, comfortable care."}
          description={
            isArabic
              ? "تعكس هذه العيادة نهجًا حديثًا يعتمد على أدوات تشخيصية ورعاية دقيقة تُستخدم لتسهيل العلاج وتصوير الحالة بوضوح مع احترام راحة المريض."
              : "This clinic follows a modern approach that combines precise diagnostics and careful treatment support to improve clarity, efficiency, and patient comfort."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {equipmentCatalog.map((item) => (
              <article key={item.name.en} className="overflow-hidden rounded-[28px] border border-[#e5eeeb] bg-white shadow-[0_12px_28px_rgba(11,59,90,0.04)]">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={isArabic ? item.name.ar : item.name.en}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">
                    {isArabic ? "معدات" : "Equipment"}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[#0b3b5a]">{isArabic ? item.name.ar : item.name.en}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{isArabic ? item.description.ar : item.description.en}</p>
                  <div className="mt-5 rounded-2xl bg-[#edf6f5] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">
                      {isArabic ? "الاستخدام" : "Use"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#0b3b5a]">{isArabic ? item.use.ar : item.use.en}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-[#0b3b5a] p-6 text-white shadow-[0_18px_42px_rgba(11,59,90,0.1)] lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c6a664]">
                  {isArabic ? "تجربة تقنية" : "Technology highlight"}
                </p>
                <h3 className="mt-3 text-3xl font-black sm:text-4xl">
                  {isArabic ? "تقنيات تمثل رؤية العيادة الحديثة." : "Technology that reflects a modern, precise clinical approach."}
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">
                  {isArabic
                    ? "يعتمد الفريق على أدوات داعمة تساعد في التخطيط الدقيق، وتحسين التواصل، وتوفير تجربة علاجية أكثر راحة ووضوحًا."
                    : "Our team relies on supportive technology to improve planning clarity, communication, and the overall patient experience during treatment."}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c6a664] text-xl text-[#0b3b5a]">✦</div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#dfeff5]">{isArabic ? "التجهيز" : "Prepared"}</p>
                    <p className="text-lg font-black text-white">{isArabic ? "لمتابعة دقيقة" : "For precise care"}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm leading-7 text-white/80">
                  <p>{isArabic ? "تصوير تشخيصي واضح" : "Clear diagnostic imaging"}</p>
                  <p>{isArabic ? "تخطيط يعتمد على البيانات" : "Data-led treatment planning"}</p>
                  <p>{isArabic ? "تجربة أكثر راحة" : "A calmer patient experience"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer locale={safeLocale as Locale} footer={{ phone: clinicContactData.phone, email: clinicContactData.email, address: clinicContactData.address[safeLocale as "en" | "ar"] }} nav={messages.nav} />
    </main>
  );
}
