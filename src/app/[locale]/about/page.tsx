import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { clinicContactData, clinicValues, patientTestimonials } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  return {
    title: isArabic ? "من نحن | عيادة دمشق" : "About Us | Damascus Dental Clinic",
    description: isArabic ? "تعرف على قيم العيادة ونهج الرعاية الموجه للمرضى." : "Learn about our clinic values, care philosophy, and patient-centered approach.",
    alternates: {
      languages: {
        en: "/en/about",
        ar: "/ar/about",
      },
    },
    openGraph: {
      title: isArabic ? "من نحن" : "About us",
      description: isArabic ? "رعاية أسنان هادئة وموثوقة." : "Calm, trustworthy dental care.",
      url: `/${safeLocale}/about`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
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
        <Breadcrumbs locale={safeLocale as Locale} items={[{ label: isArabic ? "من نحن" : "About us" }]} />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "عن العيادة" : "About the clinic"}
          title={isArabic ? "رعاية أسنان هادئة، متينة، ومصممة للثقة." : "Calm, trustworthy dental care designed around confidence."}
          description={
            isArabic
              ? "نركز على خلق تجربة مريحة وواضحة، مع رعاية قائمة على التقييم المهني والتخطيط الشخصي. هدفنا هو مساعدة المرضى على الشعور بالثقة في كل خطوة من رحلتهم العلاجية."
              : "We focus on a relaxed, clear experience built around professional assessment and personal treatment planning. Our aim is to help patients feel confident at every step of their care journey."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-[30px] bg-white p-5 shadow-[0_20px_42px_rgba(11,59,90,0.04)] lg:grid-cols-2 lg:p-8">
            <div className="relative overflow-hidden rounded-[24px] bg-[#eaf2f7]">
              <Image
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop"
                alt={isArabic ? "عيادة أسنان داخلية" : "Dental clinic interior"}
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2b7a78]">
                {isArabic ? "لماذا نحن" : "Why choose us"}
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#0b3b5a] sm:text-4xl">
                {isArabic ? "بيئة عناية مريحة وتفكير طبي مسؤول." : "A thoughtful clinical experience with modern attention to detail."}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                {isArabic
                  ? "تجمع العيادة بين الرعاية الوقائية والعلاج الترميمي والتجميل بطريقة تحترم أهداف المريض، واقتصاد الوقت، والراحة النفسية. كل قرار يتم بناءه على التقييم، وليس على التسرع أو التجارب العامة."
                  : "Our clinic brings together preventive care, restorative treatment, and cosmetic work in a way that respects the patient’s goals, time, and emotional comfort. Every recommendation is guided by assessment rather than a one-size-fits-all routine."}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {clinicValues.map((item) => (
              <article key={item.title.en} className="rounded-[26px] border border-[#e5eeeb] bg-white p-6 shadow-[0_12px_30px_rgba(11,59,90,0.04)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf6f5] text-xl text-[#2b7a78]">
                  ✦
                </div>
                <h3 className="text-xl font-bold text-[#0b3b5a]">{isArabic ? item.title.ar : item.title.en}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{isArabic ? item.text.ar : item.text.en}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-[30px] bg-[#0b3b5a] p-6 text-white lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div className="relative overflow-hidden rounded-[24px]">
              <Image
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop"
                alt={isArabic ? "صورة مدير العيادة" : "Clinic manager portrait"}
                width={900}
                height={1100}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c6a664]">
                {isArabic ? "رسالة المدير" : "Manager message"}
              </p>
              <blockquote className="mt-4 text-xl leading-9 text-white/95 sm:text-2xl">
                “{isArabic
                  ? "الهدف ليس مجرد ضبط الابتسامة، بل بناء رعاية مستدامة تتوافق مع راحة المريض واحتياجاته على المدى الطويل."
                  : "Our goal is not simply to improve a smile, but to build a sustainable care experience that respects comfort, timing, and long-term wellbeing."}”
              </blockquote>
              <div className="mt-6">
                <p className="text-lg font-bold">{isArabic ? "د. رامي السليم" : "Dr. Rami Saleem"}</p>
                <p className="text-sm text-[#dfeff5]">{isArabic ? "مدير العيادة" : "Clinic Manager"}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-[#e5eeeb] bg-white p-6 shadow-[0_16px_36px_rgba(11,59,90,0.04)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">{isArabic ? "رؤيتنا" : "Vision"}</p>
              <h3 className="mt-3 text-2xl font-black text-[#0b3b5a]">
                {isArabic ? "تحويل تجربة الأسنان إلى تجربة أكثر راحة وثقة." : "To turn dental care into a more comfortable and confident experience."}
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-600">
                {isArabic
                  ? "نطمح إلى تقديم رعاية أسنان تسمح للمرضى بالاستمرار في متابعة صحتهم مع راحة نفسية وثقة في القرارات العلاجية."
                  : "We aim to provide a dental care journey that helps patients feel at ease, confident in their decisions, and supported from consultation to aftercare."}
              </p>
            </div>

            <div className="rounded-[28px] border border-[#e5eeeb] bg-white p-6 shadow-[0_16px_36px_rgba(11,59,90,0.04)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">{isArabic ? "مهمتنا" : "Mission"}</p>
              <h3 className="mt-3 text-2xl font-black text-[#0b3b5a]">
                {isArabic ? "تبسيط الرعاية العلاجية مع احترام كل مريض." : "To make treatment clearer, calmer, and more tailored to every patient."}
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-600">
                {isArabic
                  ? "نهدف إلى تقديم رعاية فعالة ومفهومة توازن بين الفن الطبي، وتحليل الحالة، والراحة النفسية للمريض." 
                  : "We aim to deliver efficient, understandable care that balances clinical skill, clear communication, and a gentle patient experience."}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[30px] border border-[#e5eeeb] bg-white p-6 shadow-[0_18px_40px_rgba(11,59,90,0.04)] sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">{isArabic ? "قيمنا" : "Values"}</p>
              <h3 className="mt-2 text-3xl font-black text-[#0b3b5a]">
                {isArabic ? "أساس يُبنى عليه كل قرار طبي." : "The foundations behind every clinical decision."}
              </h3>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                isArabic ? "الشفافية" : "Transparency",
                isArabic ? "الراحة" : "Comfort",
                isArabic ? "التخطيط الدقيق" : "Thoughtful planning",
                isArabic ? "الاحترام" : "Respect",
                isArabic ? "التعليم" : "Education",
                isArabic ? "الاستمرارية" : "Continuity",
              ].map((value) => (
                <div key={value} className="rounded-2xl bg-[#f7faf9] p-4 text-base font-semibold text-[#0b3b5a]">
                  {value}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[30px] bg-[#edf6f5] p-6 sm:p-8 lg:p-10">
            <div className="mb-6 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">
                {isArabic ? "مراجعات المرضى" : "Patient feedback"}
              </p>
              <h3 className="mt-2 text-3xl font-black text-[#0b3b5a]">
                {isArabic ? "تجربة نموذجية لمرضى العيادة" : "A representative patient experience"}
              </h3>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {patientTestimonials.map((item) => (
                <blockquote key={item.name} className="rounded-[26px] border border-[#dfe9e6] bg-white p-6 shadow-[0_12px_28px_rgba(11,59,90,0.04)]">
                  <p className="text-base leading-8 text-slate-600">“{isArabic ? item.text.ar : item.text.en}”</p>
                  <footer className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-[#0b3b5a]">{item.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-[30px] bg-[#0b3b5a] px-6 py-8 text-center text-white shadow-[0_18px_40px_rgba(11,59,90,0.1)] sm:px-8 lg:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd86]">
              {isArabic ? "جاهز للزيارة؟" : "Ready to visit?"}
            </p>
            <h3 className="mt-3 text-3xl font-black sm:text-4xl">
              {isArabic ? "دعونا نبدأ بخطوة رعاية مناسبة لك." : "Let’s begin with a care plan that suits you."}
            </h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
              <a href={`/${safeLocale}/contact`} className="rounded-full bg-white px-5 py-3 text-[#0b3b5a] transition hover:bg-[#eaf2f7]">
                {isArabic ? "تواصل معنا" : "Contact us"}
              </a>
              <a href={`tel:${clinicContactData.call.replace(/\s+/g, "")}`} className="rounded-full border border-white/30 px-5 py-3 text-white transition hover:bg-white/10">
                {isArabic ? "اتصل الآن" : "Call now"}
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer locale={safeLocale as Locale} footer={{ phone: clinicContactData.phone, email: clinicContactData.email, address: clinicContactData.address[safeLocale as "en" | "ar"] }} nav={messages.nav} />
    </main>
  );
}
