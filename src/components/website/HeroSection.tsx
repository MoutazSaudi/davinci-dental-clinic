"use client";

import { useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/effect-fade";

export type SlideContent = {
  title?: string;
  description?: string;
  badges?: string[];
  doctorCard?: {
    name: string;
    specialty: string;
    experience: string;
    rating: string;
    imageSrc: string;
  };
  bgImage?: string;
};

type HeroSectionProps = {
  locale: Locale;
  content: SlideContent;
  slides?: SlideContent[];
};

export function HeroSection({ locale, content, slides }: HeroSectionProps) {
  const isRtl = locale === "ar";
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // تعريف بيانات الطبيب المشتركة لتجنب التكرار
  const drMouhannadData = {
    name: isRtl ? "د. مهند سعودي" : "DR. MOUHANNAD SAUDI",
    specialty: isRtl ? "أخصائي تقويم الأسنان" : "ORTHODONTIST",
    experience: isRtl ? "دبلوم جامعة جنوب كاليفورنيا (USC) في آلام الوجه والفكين" : "USC DIPLOMA IN OROFACIAL PAIN",
    rating: "USC",
    imageSrc: "/images/doctors/DrMuhanad.jpeg",
  };

  const defaultSlides: SlideContent[] = slides || [
    // الشريحة الأولى
    {
      title: "TMJ & OROFACIAL PAIN CARE",
      description: isRtl ? "التشخيص • العلاج • التسكين" : "DIAGNOSE • TREAT • RELIEVE",
      badges: isRtl
        ? [
            "اضطرابات المفصل الصدغي الفكي",
            "آلام الفك",
            "الصداع المزمن",
            "صرير الأسنان",
            "آلام الوجه",
          ]
        : [
            "TMJ DISORDERS",
            "JAW PAIN",
            "HEADACHES",
            "BRUXISM",
            "FACIAL PAIN",
          ],
      doctorCard: drMouhannadData, // استخدام بيانات الطبيب
      bgImage: "/images/hero/hero1.jpeg",
    },
    // الشريحة الثانية (تم تحديثها لاستخدام الصورة الجديدة)
    {
      title: isRtl ? "زراعة الأسنان\nالموجهة ثلاثية الأبعاد" : "3D GUIDED\nDENTAL IMPLANTATION",
      description: isRtl
        ? "دقة متناهية، جراحة طفيفة التوغل، ونتائج مثالية باستخدام أحدث تقنيات التصوير الرقمي."
        : "Unmatched precision, minimally invasive surgery, and optimal results using advanced digital imaging.",
      badges: isRtl
        ? [
            "تخطيط رقمي دقيق",
            "جراحة بدون شق جراحي",
            "أمان عالي",
            "تعافي سريع",
            "ابتسامة فورية",
          ]
        : [
            "Precise Digital Planning",
            "Flapless Surgery",
            "High Safety",
            "Rapid Recovery",
            "Immediate Smile",
          ],
      doctorCard: drMouhannadData, // استخدام نفس الطبيب
      bgImage: "/images/hero/hero2.jpeg", // تعيين الصورة الجديدة هنا
    },
  ];

  const totalSlides = defaultSlides.length;

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: custom * 0.15,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    }),
  };

  return (
    <div className="w-full p-2 sm:p-4">
      <section className="relative min-h-[720px] w-full overflow-hidden rounded-[1rem] bg-slate-900 text-white shadow-2xl lg:min-h-[820px]">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={800}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="h-full w-full min-h-[720px] lg:min-h-[820px]"
        >
          {defaultSlides.map((slide, slideIdx) => (
            <SwiperSlide key={slideIdx} className="relative h-full w-full">
              <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                  initial={{ scale: 1.08 }}
                  animate={{ scale: activeIndex === slideIdx ? 1 : 1.08 }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={
                      slide.bgImage ||
                      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
                    }
                    alt="Dental background"
                    fill
                    priority={slideIdx === 0}
                    sizes="100vw"
                    className="object-cover object-center brightness-90"
                  />
                </motion.div>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/50 rtl:bg-gradient-to-l"
                  aria-hidden="true"
                />
              </div>

              {/* المحتوى الداخلي مع الأنميشن */}
              <div className="relative z-10 mx-auto flex container h-full min-h-[720px] lg:min-h-[820px] flex-col justify-between px-6 pb-12 pt-36 sm:px-10 lg:px-14 lg:pb-14 lg:pt-44">
                {/* الجزء العلوي: العنوان والوصف */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 ">
                  <div className="lg:col-span-7">
                    <motion.h1
                      key={`title-${activeIndex}`}
                      custom={0}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUpVariants}
                      style={{ color: "white" }}
                      className="max-w-xl text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl whitespace-pre-line"
                    >
                      {slide.title}
                    </motion.h1>
                  </div>

                  <div className="lg:col-span-5 lg:pt-2 lg:pl-12 rtl:lg:pr-12 rtl:lg:pl-0">
                    <motion.p
                      key={`desc-${activeIndex}`}
                      custom={1}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUpVariants}
                      style={{ color: "white" }}
                      className="max-w-xs leading-relaxed text-white sm:text-base font-semibold tracking-wider"
                    >
                      {slide.description}
                    </motion.p>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-1 items-end gap-6 pt-12 lg:grid-cols-12">
                  {/* الكبسولات (Badges) */}
                  <div className="lg:col-span-7">
                    <motion.div
                      key={`badges-${activeIndex}`}
                      custom={2}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUpVariants}
                      className="flex max-w-md flex-wrap gap-2.5"
                    >
                      {(slide.badges || []).map((badge, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`rounded-full px-5 py-2.5 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 ${
                            idx === 0
                              ? "bg-white text-slate-900 shadow-lg"
                              : "bg-white/20 text-white hover:bg-white/30 border border-white/10"
                          }`}
                        >
                          {badge}
                        </button>
                      ))}
                    </motion.div>
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-4 lg:col-span-5">
                    <motion.div
                      key={`controls-${activeIndex}`}
                      custom={2.5}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUpVariants}
                      className="flex items-center gap-3 text-xs text-white font-mono dir-ltr mb-1"
                    >
                      <button
                        onClick={() => swiperInstance?.slidePrev()}
                        className="hover:opacity-75 transition cursor-pointer flex items-center gap-1 font-bold"
                      >
                        &lt; {String(activeIndex + 1).padStart(2, "0")}
                      </button>

                      <div className="h-[2px] w-28 bg-white/40 overflow-hidden rounded-full">
                        <div
                          className="h-full bg-white transition-all duration-500 ease-out"
                          style={{
                            width: `${((activeIndex + 1) / totalSlides) * 100}%`,
                          }}
                        />
                      </div>

                      <button
                        onClick={() => swiperInstance?.slideNext()}
                        className="hover:opacity-75 transition cursor-pointer flex items-center gap-1 font-bold"
                      >
                        {String(totalSlides).padStart(2, "0")} &gt;
                      </button>
                    </motion.div>

                    {/* بطاقة الطبيب */}
                    <motion.div
                      key={`card-${activeIndex}`}
                      custom={3}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUpVariants}
                      className="flex w-full max-w-xs items-center gap-4 rounded-sm bg-white p-3 text-slate-900 shadow-2xl backdrop-blur-md border"
                    >
                      <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-sm bg-slate-200 shadow-inner">
                        <Image
                          src={slide.doctorCard?.imageSrc || "/placeholder-doctor.jpg"}
                          alt={slide.doctorCard?.name || "Doctor"}
                          fill
                          className="object-cover object-top"
                        />
                      </div>

                      <div className="flex flex-col text-xs leading-tight">
                        <span className="font-bold text-slate-900 text-sm">
                          {slide.doctorCard?.name}
                        </span>
                        <span className="text-xs text-slate-500 font-medium mt-0.5">
                          {slide.doctorCard?.specialty}
                        </span>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                          <span>{slide.doctorCard?.experience}</span>
                          <span className="text-amber-600 font-bold">
                            ({slide.doctorCard?.rating})
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* الإطار الخارجي (الجزء السفلي) - يظهر فقط في الشريحة الأولى */}
                {slideIdx === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-widest text-white/80 font-mono uppercase"
                  >
                    <span>
                      {isRtl
                        ? "رعاية متخصصة. جودة حياة أفضل."
                        : "EXPERT CARE. BETTER QUALITY OF LIFE."}
                    </span>
                    <span className="mt-1 sm:mt-0">
                      {isRtl
                        ? "جامعة جنوب كاليفورنيا (USC)"
                        : "UNIVERSITY OF SOUTHERN CALIFORNIA (USC)"}
                    </span>
                  </motion.div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}