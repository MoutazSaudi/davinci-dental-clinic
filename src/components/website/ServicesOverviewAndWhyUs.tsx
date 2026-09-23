"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

type ServicesOverviewAndWhyUsProps = {
  locale: "ar" | "en";
};

type PriceItem = {
  label: { ar: string; en: string };
  price: string;
  note?: { ar: string; en: string };
};

type PriceGroup = {
  title: { ar: string; en: string };
  icon: React.ReactNode;
  items: PriceItem[];
};

const IconBraces = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h16M6 10v4M10 10v4M14 10v4M18 10v4M4 14h16" />
  </svg>
);

const IconChat = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1 4a8 8 0 0 1 1 4Z" />
    <path d="M8 12h.01M12 12h.01M16 12h.01" />
  </svg>
);

const IconTooth = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8 2 6 4.5 6 8c0 2 .5 3 .5 5S6 18 6 20c0 1 .7 2 2 2s2-1.5 2.5-4c.2-1 .4-1.8 1.5-1.8s1.3.8 1.5 1.8c.5 2.5 1.2 4 2.5 4s2-1 2-2c0-2-.5-5-.5-7s.5-3 .5-5c0-3.5-2-6-6-6Z" />
  </svg>
);

const IconRepair = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14.7 6.3 3 3M2 22l4-1 10-10-3-3L3 18l-1 4Z" />
    <path d="m15 5 4-4 4 4-4 4-1.5-1.5" />
  </svg>
);

const IconSparkle = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </svg>
);

const IconDiamond = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
    <path d="M2 9h20M12 21 8 9l4-6 4 6-4 12" />
  </svg>
);

const IconImplant = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V8M9 8h6M9 11h6M9 14h6M9 17h6M12 8V4M10 4h4" />
  </svg>
);

const PRICE_GROUPS: PriceGroup[] = [
  {
    title: { ar: "تقويم الأسنان", en: "Orthodontics" },
    icon: <IconBraces />,
    items: [
      { label: { ar: "تقويم معدني", en: "Metal braces" }, price: "$1,200" },
      {
        label: { ar: "تقويم شفاف (Invisalign)", en: "Invisalign aligners" },
        price: "$2,200",
        note: { ar: "يبدأ من", en: "From" },
      },
    ],
  },
  {
    title: { ar: "استشارات", en: "Consultation" },
    icon: <IconChat />,
    items: [
      {
        label: { ar: "استشارة المفصل الفكي (TMJ)", en: "TMJ consultation" },
        price: "$50",
      },
    ],
  },
  {
    title: { ar: "علاج الجذور (RCT)", en: "Root Canal Treatment" },
    icon: <IconTooth />,
    items: [
      { label: { ar: "أضراس", en: "Molars" }, price: "$75" },
      { label: { ar: "ضواحك", en: "Premolars" }, price: "$50" },
      { label: { ar: "أسنان أمامية", en: "Anterior" }, price: "$30" },
    ],
  },
  {
    title: { ar: "الترميم المركّب", en: "Composite Restoration" },
    icon: <IconRepair />,
    items: [
      { label: { ar: "حالة سهلة", en: "Easy case" }, price: "$15" },
      { label: { ar: "حالة متوسطة", en: "Moderate case" }, price: "$30" },
      {
        label: { ar: "حالة معقّدة", en: "Complex case" },
        price: "$50 – $60",
        note: {
          ar: "fiber post أو ribbond fiber",
          en: "fiber post or ribbond fiber",
        },
      },
    ],
  },
  {
    title: { ar: "التنظيف والتبييض", en: "Cleaning & Bleaching" },
    icon: <IconSparkle />,
    items: [
      {
        label: { ar: "تنظيف وتلميع", en: "Scaling & polishing" },
        price: "$15 – $20",
      },
      {
        label: { ar: "تبييض الأسنان", en: "Teeth bleaching" },
        price: "$200",
      },
    ],
  },
  {
    title: { ar: "التيجان والقشور", en: "Crowns & Veneers" },
    icon: <IconDiamond />,
    items: [
      { label: { ar: "تاج زيركون", en: "Zircon crown" }, price: "$75" },
      { label: { ar: "قشور (Veneers)", en: "Veneers" }, price: "$90 – $100" },
    ],
  },
  {
    title: { ar: "الزراعة", en: "Implants" },
    icon: <IconImplant />,
    items: [
      { label: { ar: "زراعة سن", en: "Dental implant" }, price: "$300 – $500" },
    ],
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const listContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export function ServicesOverviewAndWhyUs({
  locale,
}: ServicesOverviewAndWhyUsProps) {
  const isArabic = locale === "ar";

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* ═══ Left: Sticky Visual ═══ */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            {/* Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-gold/30 shadow-[0_24px_60px_rgba(122,28,81,0.14)]">
              <Image
                src="https://davincidental.ae/wp-content/uploads/2023/06/Aesthetic-Treatment.jpg"
                alt={isArabic ? "أسعار العيادة" : "Clinic pricing"}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"
              />

              {/* Overlay text */}
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
                  {isArabic ? "الأسعار المقدرة" : "Estimated Pricing"}
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
                  {isArabic
                    ? "أسعار شفافة قبل البدء"
                    : "Transparent prices, before you begin"}
                </h2>
              </div>
            </div>

            {/* Description + CTA */}
            <div className="mt-8">
              <p className="text-sm leading-7 text-foreground-muted">
                {isArabic
                  ? "جميع الأسعار تقديرية بالدولار الأمريكي لأكثر الخدمات طلبًا. تُحدَّد التكلفة النهائية بعد التقييم السريري لحالتك."
                  : "All prices are estimates in USD for our most requested treatments. Final cost is determined after clinical assessment of your case."}
              </p>

              <Link
                href={`/${locale}/contact`}
                className="group mt-6 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light"
              >
                <span>
                  {isArabic ? "اطلب تسعيرًا دقيقًا" : "Request an accurate quote"}
                </span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
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
              </Link>
            </div>
          </motion.aside>

          {/* ═══ Right: Menu List ═══ */}
          <motion.div
            variants={listContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-10"
          >
            {PRICE_GROUPS.map((group, groupIndex) => (
              <motion.div key={group.title.en} variants={fadeUp}>
                {/* Group header */}
                <div className="flex items-center gap-3 border-b-2 border-primary/10 pb-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mint text-teal">
                    {group.icon}
                  </span>
                  <h3 className="text-xl font-black tracking-tight text-primary sm:text-2xl">
                    {isArabic ? group.title.ar : group.title.en}
                  </h3>
                  <span className="ms-auto text-[11px] font-bold uppercase tracking-wider text-foreground-light">
                    {String(groupIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Items — menu style with dotted leaders */}
                <ul className="mt-4 space-y-3">
                  {group.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-baseline gap-3 text-base"
                    >
                      <div className="min-w-0">
                        <span className="font-medium text-foreground">
                          {isArabic ? item.label.ar : item.label.en}
                        </span>
                        {item.note && (
                          <span className="ms-2 text-[11px] italic text-foreground-light">
                            ({isArabic ? item.note.ar : item.note.en})
                          </span>
                        )}
                      </div>

                      {/* Dotted leader */}
                      <span
                        aria-hidden="true"
                        className="relative flex-1 translate-y-[-4px] self-end border-b border-dotted border-border"
                      />

                      <span className="shrink-0 text-base font-black tracking-tight text-primary tabular-nums">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}