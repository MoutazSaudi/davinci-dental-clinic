"use client";

import { useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { motion, AnimatePresence } from "framer-motion";

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
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const drMouhannadData = {
    name: isRtl ? "د. مهند سعودي" : "DR. MOUHANNAD SAUDI",
    specialty: isRtl
      ? "أخصائي تقويم الأسنان وآلام الفم والوجه"
      : "ORTHODONTIST & OROFACIAL PAIN SPECIALIST",
    experience: isRtl
      ? "اختصاصي آلام الفم والوجه واضطرابات مفصل الفك - USC"
      : "USC DIPLOMA IN OROFACIAL PAIN",
    rating: "USC",
    imageSrc: "/images/doctors/DrMuhanad.jpeg",
  };

  const defaultSlides: SlideContent[] = slides || [
    {
      title: isRtl
        ? "علاج اضطرابات المفصل\nوآلام الوجه والفكين"
        : "TMJ & OROFACIAL PAIN CARE",
      description: isRtl
        ? "التشخيص • العلاج • التسكين"
        : "DIAGNOSE • TREAT • RELIEVE",
      badges: isRtl
        ? [
            "اضطرابات المفصل الصدغي الفكي",
            "آلام الفك",
            "الصداع المزمن",
            "صرير الأسنان",
            "آلام الوجه",
          ]
        : ["TMJ DISORDERS", "JAW PAIN", "HEADACHES", "BRUXISM", "FACIAL PAIN"],
      doctorCard: drMouhannadData,
      bgImage: "/images/hero/hero1.webp",
    },
    {
      title: isRtl
        ? "زراعة الأسنان\nالموجهة ثلاثية الأبعاد"
        : "3D GUIDED\nDENTAL IMPLANTATION",
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
      doctorCard: drMouhannadData,
      bgImage: "/images/hero/hero2.webp",
    },
    {
      title: isRtl
        ? "تقويم الأسنان\nبالتقويم المعدني أو الشفاف"
        : "ORTHODONTICS BY\nBRACES OR INVISALIGN",
      description: isRtl
        ? "تصحيح ترتيب الأسنان وتحقيق ابتسامة متناسقة باستخدام التقويم المعدني أو التقويم الشفاف."
        : "Straighten your teeth and achieve a confident smile with traditional braces or Invisalign.",
      badges: isRtl
        ? [
            "تقويم معدني",
            "تقويم شفاف",
            "تصحيح تزاحم الأسنان",
            "ابتسامة متناسقة",
            "خطة علاج مخصصة",
          ]
        : [
            "Braces",
            "Invisalign",
            "Teeth Alignment",
            "Confident Smile",
            "Personalized Treatment",
          ],
      doctorCard: drMouhannadData,
      bgImage: "/images/hero/hero3.webp",
    },
    {
      title: isRtl ? "علاج\nالعصب" : "ROOT CANAL\nTREATMENT",
      description: isRtl
        ? "علاج العصب والحفاظ على السن الطبيعي مع تخفيف الألم واستعادة وظيفة السن."
        : "Relieve pain, preserve your natural tooth, and restore its function with precise root canal treatment.",
      badges: isRtl
        ? [
            "علاج العصب",
            "تخفيف الألم",
            "الحفاظ على السن",
            "علاج دقيق",
            "استعادة وظيفة السن",
          ]
        : [
            "Root Canal Therapy",
            "Pain Relief",
            "Natural Tooth",
            "Precise Treatment",
            "Restored Function",
          ],
      doctorCard: drMouhannadData,
      bgImage: "/images/hero/hero4.webp",
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
    <>
      <div className="w-full p-1.5 sm:p-3 lg:p-4">
        <section className="relative min-h-[100dvh] w-full overflow-hidden rounded-[1rem] bg-slate-900 text-white shadow-2xl sm:min-h-[680px] lg:min-h-[820px]">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={true}
            speed={800}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="h-full w-full min-h-[100dvh] sm:min-h-[680px] lg:min-h-[820px]"
          >
            {defaultSlides.map((slide, slideIdx) => (
              <SwiperSlide key={slideIdx} className="relative h-full w-full">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <motion.div
                    initial={{ scale: 1.08 }}
                    animate={{
                      scale: activeIndex === slideIdx ? 1 : 1.08,
                    }}
                    transition={{
                      duration: 6,
                      ease: "linear",
                    }}
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
                    className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/75 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/30 sm:to-black/50 rtl:sm:bg-gradient-to-l"
                    aria-hidden="true"
                  />
                </div>

                <div className="container relative z-10 mx-auto flex h-full min-h-[100dvh] flex-col justify-between px-4 pb-5 pt-24 sm:min-h-[680px] sm:px-8 sm:pb-10 sm:pt-32 md:px-10 lg:min-h-[820px] lg:px-14 lg:pb-14 lg:pt-44">
                  <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-7">
                      <motion.h1
                        key={`title-${activeIndex}`}
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariants}
                        style={{ color: "white" }}
                        className="max-w-xl whitespace-pre-line text-[28px] font-black uppercase leading-[1.05] tracking-tight text-white min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                      >
                        {slide.title}
                      </motion.h1>
                    </div>

                    <div className="lg:col-span-5 lg:pl-12 lg:pt-2 rtl:lg:pl-0 rtl:lg:pr-12">
                      <motion.p
                        key={`desc-${activeIndex}`}
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariants}
                        style={{ color: "white" }}
                        className="max-w-md text-xs font-semibold leading-relaxed tracking-wider text-white sm:max-w-xs sm:text-sm md:text-base"
                      >
                        {slide.description}
                      </motion.p>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-1 items-end gap-4 pt-6 sm:gap-6 sm:pt-10 lg:grid-cols-12 lg:pt-12">
                    <div className="lg:col-span-7">
                      <motion.div
                        key={`badges-${activeIndex}`}
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariants}
                        className="flex max-w-md flex-wrap gap-1.5 sm:gap-2.5"
                      >
                        {(slide.badges || []).map((badge, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold backdrop-blur-md transition-all hover:scale-105 sm:px-5 sm:py-2.5 sm:text-xs ${
                              idx === 0
                                ? "bg-white text-slate-900 shadow-lg"
                                : "border border-white/10 bg-white/20 text-white hover:bg-white/30"
                            }`}
                          >
                            {badge}
                          </button>
                        ))}
                      </motion.div>
                    </div>

                    <div className="flex flex-col items-stretch gap-3 sm:gap-4 lg:col-span-5 lg:items-end">
                      <motion.div
                        key={`controls-${activeIndex}`}
                        custom={2.5}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariants}
                        className="mb-1 flex items-center gap-2 font-mono text-[10px] font-bold text-white dir-ltr sm:gap-3 sm:text-xs lg:justify-end"
                      >
                        <button
                          onClick={() => swiperInstance?.slidePrev()}
                          className="flex cursor-pointer items-center gap-1 font-bold transition hover:opacity-75"
                        >
                          &lt; {String(activeIndex + 1).padStart(2, "0")}
                        </button>

                        <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/40 sm:w-28 sm:flex-none">
                          <div
                            className="h-full bg-white transition-all duration-500 ease-out"
                            style={{
                              width: `${
                                ((activeIndex + 1) / totalSlides) * 100
                              }%`,
                            }}
                          />
                        </div>

                        <button
                          onClick={() => swiperInstance?.slideNext()}
                          className="flex cursor-pointer items-center gap-1 font-bold transition hover:opacity-75"
                        >
                          {String(totalSlides).padStart(2, "0")} &gt;
                        </button>
                      </motion.div>

                      <motion.button
                        key={`card-${activeIndex}`}
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariants}
                        type="button"
                        onClick={() => setIsDoctorModalOpen(true)}
                        aria-label={
                          isRtl
                            ? "عرض الملف التعريفي للطبيب"
                            : "View doctor's profile"
                        }
                        className="group flex w-full max-w-xs cursor-pointer items-center gap-3 rounded-sm border bg-white p-2.5 text-left text-slate-900 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] focus:outline-none focus:ring-2 focus:ring-white/80 sm:gap-4 sm:p-3 rtl:text-right"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-slate-200 shadow-inner sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]">
                          <Image
                            src={
                              slide.doctorCard?.imageSrc ||
                              "/placeholder-doctor.jpg"
                            }
                            alt={slide.doctorCard?.name || "Doctor"}
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex min-w-0 flex-col text-xs leading-tight">
                          <span className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                            {slide.doctorCard?.name}
                          </span>

                          <span className="mt-0.5 line-clamp-2 text-[10px] font-medium text-slate-500 sm:text-xs">
                            {slide.doctorCard?.specialty}
                          </span>

                          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 sm:mt-2 sm:text-[11px]">
                            <span className="truncate">
                              {slide.doctorCard?.experience}
                            </span>

                            <span className="shrink-0 font-bold text-amber-600">
                              ({slide.doctorCard?.rating})
                            </span>
                          </div>

                          <span className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-slate-700 sm:mt-2 sm:text-[10px]">
                            {isRtl ? "عرض الملف ←" : "View Profile →"}
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {slideIdx === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.8,
                        duration: 0.6,
                      }}
                      className="mt-4 flex flex-col items-center justify-between gap-1.5 border-t border-white/15 pt-3 font-mono text-[9px] uppercase tracking-widest text-white/80 sm:mt-6 sm:flex-row sm:gap-0 sm:pt-4 sm:text-[11px]"
                    >
                      <span className="text-center sm:text-left">
                        {isRtl
                          ? "رعاية متخصصة. جودة حياة أفضل."
                          : "EXPERT CARE. BETTER QUALITY OF LIFE."}
                      </span>

                      <span className="text-center sm:text-right">
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

      <AnimatePresence>
        {isDoctorModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setIsDoctorModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={isRtl ? "الملف التعريفي للطبيب" : "Doctor profile"}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92dvh] w-full max-w-5xl overflow-hidden rounded-t-2xl bg-white text-slate-900 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <button
                type="button"
                onClick={() => setIsDoctorModalOpen(false)}
                aria-label={isRtl ? "إغلاق" : "Close"}
                className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl text-slate-700 shadow-md backdrop-blur transition hover:bg-white rtl:right-auto rtl:left-3 sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:bg-black/5 sm:shadow-none sm:hover:bg-black/10 rtl:sm:left-4"
              >
                ×
              </button>

              <div className="grid max-h-[92dvh] min-h-0 grid-rows-[160px_1fr] sm:max-h-[90vh] sm:grid-rows-[200px_1fr] lg:h-[90vh] lg:max-h-[90vh] lg:grid-cols-[320px_1fr] lg:grid-rows-1">
                <div className="relative min-h-0 overflow-hidden bg-slate-100">
                  <Image
                    src="/images/doctors/DrMuhanad.jpeg"
                    alt={isRtl ? "د. مهند سعودي" : "Dr. Mouhannad Saudi"}
                    fill
                    className="object-cover object-top lg:object-contain lg:object-center"
                    sizes="(max-width: 1024px) 100vw, 320px"
                    priority
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-20 text-white sm:p-6 sm:pt-32">
                    <h2 className="text-lg font-black sm:text-2xl">
                      {isRtl ? "د. مهند سعودي" : "DR. MOUHANNAD SAUDI"}
                    </h2>

                    <p className="mt-0.5 text-xs font-medium text-white/85 sm:mt-1 sm:text-sm">
                      {isRtl
                        ? "أخصائي أول تقويم الأسنان"
                        : "Senior Orthodontist"}
                    </p>
                  </div>
                </div>

                <div className="min-h-0 overflow-y-auto p-5 sm:p-7 lg:p-10">
                  <div className="mb-6 sm:mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
                      {isRtl ? "الملف التعريفي" : "PROFILE"}
                    </p>

                    <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                      {isRtl ? "د. مهند سعودي" : "Dr. Mouhannad Saudi"}
                    </h3>

                    <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-600 sm:mt-4 sm:text-sm sm:leading-7">
                      {isRtl
                        ? "أخصائي أول في تقويم الأسنان وآلام الفم والوجه واضطرابات مفصل الفك، مع خبرة تمتد لأكثر من 20 عامًا في مجال تقويم الأسنان."
                        : "Senior Orthodontist specializing in orthodontics, orofacial pain, and TMJ disorders, with more than 20 years of experience in orthodontic practice."}
                    </p>
                  </div>

                  <section className="mb-6 sm:mb-8">
                    <h4 className="mb-3 text-base font-black text-slate-900 sm:mb-4 sm:text-lg">
                      {isRtl
                        ? "المؤهلات الأكاديمية"
                        : "Academic Qualifications"}
                    </h4>

                    <div className="space-y-2.5 sm:space-y-3">
                      <ProfileItem>
                        {isRtl
                          ? "اختصاصي في آلام الفم والوجه واضطرابات مفصل الفك، جامعة جنوب كاليفورنيا (USC)، الولايات المتحدة الأمريكية – 2026"
                          : "High Diploma in Orofacial Pain and TMJ Disorders, University of Southern California (USC), USA – 2026"}
                      </ProfileItem>

                      <ProfileItem>
                        {isRtl
                          ? "ماجستير مهني في تقويم الأسنان والفكين، جامعة القديس يوسف (USJ)، لبنان – 2005"
                          : "Professional Master's Degree in Orthodontics, Saint Joseph University (USJ), Lebanon – 2005"}
                      </ProfileItem>

                      <ProfileItem>
                        {isRtl
                          ? "باحث في التطبيقات السريرية لليزر في تسريع علاج تقويم الأسنان، جامعة العلوم الماليزية (USM) – 2018"
                          : "Researcher in Clinical Laser Applications for Accelerating Orthodontic Treatment, University of Science Malaysia (USM) – 2018"}
                      </ProfileItem>

                      <ProfileItem>
                        {isRtl
                          ? "إجازة دكتور في طب الأسنان وجراحتها – 1998"
                          : "Doctor of Dental Surgery (DDS) – 1998"}
                      </ProfileItem>
                    </div>
                  </section>

                  <section className="mb-6 sm:mb-8">
                    <h4 className="mb-3 text-base font-black text-slate-900 sm:mb-4 sm:text-lg">
                      {isRtl ? "الخبرة المهنية" : "Professional Experience"}
                    </h4>

                    <div className="space-y-2.5 sm:space-y-3">
                      <ProfileItem>
                        {isRtl
                          ? "أستاذ محاضر في مركز التخصصات الطبية والبورد السوري لتقويم الأسنان"
                          : "Lecturer at the Medical Specialties Center and the Syrian Orthodontic Board (SOB)"}
                      </ProfileItem>

                      <ProfileItem>
                        {isRtl
                          ? "خبرة في ممارسة تقويم الأسنان منذ 2005"
                          : "Orthodontic practice experience since 2005"}
                      </ProfileItem>

                      <ProfileItem>
                        {isRtl
                          ? "أخصائي أول تقويم الأسنان في الإمارات العربية المتحدة منذ 2009 وحتى الآن"
                          : "Senior Orthodontist in the United Arab Emirates since 2009"}
                      </ProfileItem>

                      <ProfileItem>
                        {isRtl
                          ? "رئيس قسم تقويم الأسنان في مركز دافينشي للأسنان، أبوظبي، الإمارات العربية المتحدة منذ 2016 وحتى الآن"
                          : "Head of the Orthodontics Department at Davinci Dental Clinic, Abu Dhabi, UAE, since 2016"}
                      </ProfileItem>
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-3 text-base font-black text-slate-900 sm:mb-4 sm:text-lg">
                      {isRtl ? "العضويات المهنية" : "Professional Memberships"}
                    </h4>

                    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                        <div className="text-lg font-black text-slate-900 sm:text-xl">
                          AAO
                        </div>
                        <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                          {isRtl
                            ? "زميل الجمعية الأمريكية لتقويم الأسنان"
                            : "Fellow, American Association of Orthodontists"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                        <div className="text-lg font-black text-slate-900 sm:text-xl">
                          AAOP
                        </div>
                        <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                          {isRtl
                            ? "زميل الأكاديمية الأمريكية لآلام الفم والوجه"
                            : "Fellow, American Academy of Orofacial Pain"}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ProfileItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:gap-3 sm:p-4">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 sm:mt-2" />

      <p className="text-xs leading-6 text-slate-600 sm:text-sm">{children}</p>
    </div>
  );
}