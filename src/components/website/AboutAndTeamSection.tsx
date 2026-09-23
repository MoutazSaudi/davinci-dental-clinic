"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Card } from "@/components/ui/Card";

type Doctor = {
  name: string;
  specialty: string;
  initials: string;
};

type AboutAndTeamSectionProps = {
  locale: "en" | "ar";
  about?: {
    eyebrow: string;
    title: string;
    description: string;
    stats?: Array<{ value: string; label: string }>;
  };
  doctors?: Doctor[];
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const teamContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const teamItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AboutAndTeamSection({
  locale,
  about,
  doctors = [],
}: AboutAndTeamSectionProps) {
  const isArabic = locale === "ar";

  const safeAbout = about || {
    eyebrow: isArabic ? "من نحن" : "About Us",
    title: isArabic ? "نقدم رعاية استثنائية" : "Providing Exceptional Care",
    description: isArabic
      ? "نحن هنا لخدمتك بأفضل المعايير."
      : "We are here to serve you with high standards.",
    stats: [],
  };

  const lead = {
    name: isArabic ? "د. مهند سعودي" : "Dr. Muhanad Saudi",
    title: isArabic
      ? "استشاري آلام الوجه والمفصل الفكي الصدغي"
      : "Orofacial Pain & TMJ Specialist",
    bio: isArabic
      ? "حصل على شهادة الاختصاص في آلام الوجه والمفصل الفكي الصدغي من جامعة جنوب كاليفورنيا (USC)، الولايات المتحدة. يهتم هذا التخصص بالآلام العصبية والعضلية في منطقة الوجه، والمفصل الفكي الصدغي، والصداع، وآلام الأذن، ومشاكل توقف التنفس أثناء النوم."
      : "Received a specialized diploma in Orofacial Pain and TMJ from the University of Southern California (USC), USA. This specialty focuses on neuromuscular pain in the facial region, TMJ disorders, headaches, ear pain, and sleep apnea.",
    image: "/images/doctors/DrMuhanad.jpeg",
    credential: "USC · USA",
    specialties: isArabic
      ? [
          "آلام الوجه",
          "المفصل الفكي الصدغي",
          "الصداع",
          "آلام الأذن",
          "توقف التنفس أثناء النوم",
        ]
      : [
          "Facial Pain",
          "TMJ Disorders",
          "Headaches",
          "Ear Pain",
          "Sleep Apnea",
        ],
    cta: isArabic ? "احجز استشارة" : "Book a consultation",
  };

  return (
    <section className="overflow-hidden">
      {/* ═══════════════════════════════════════════
          BLOCK 1 — LEAD SPECIALIST (Soft Editorial)
      ═══════════════════════════════════════════ */}
      <div className="relative bg-background-soft py-24">
        {/* Decorative subtle circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 start-[-10%] h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-20%] end-[-5%] h-[420px] w-[420px] rounded-full bg-teal/8 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            {/* ─── Image column ─── */}
            <motion.div
              initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative lg:col-span-5"
            >
              {/* Image with gold frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[32px] border border-gold/40 bg-mint shadow-[0_30px_80px_rgba(122,28,81,0.18)]">
                <Image
                  src={lead.image}
                  alt={lead.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
                {/* Soft inner vignette */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"
                />
              </div>

              {/* Credential badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-4 start-8 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-bold tracking-wider text-primary shadow-2xl"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {lead.credential}
              </motion.div>
            </motion.div>

            {/* ─── Content column ─── */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-7 lg:ps-8"
            >
              {/* Eyebrow */}
              <motion.p
                variants={fadeUp}
                className="text-xs font-bold uppercase tracking-[0.28em] text-gold-dark"
              >
                {isArabic ? "مشرف العيادة" : "Clinic Lead"}
              </motion.p>

              {/* Name */}
              <motion.h2
                variants={fadeUp}
                className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl"
              >
                {lead.name}
              </motion.h2>

              {/* Title */}
              <motion.p
                variants={fadeUp}
                className="mt-3 text-base font-medium text-teal sm:text-lg"
              >
                {lead.title}
              </motion.p>

              {/* Gold divider (drawn) */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: 80, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                className="my-8 h-[3px] rounded-full bg-gold"
              />

              {/* Bio */}
              <motion.p
                variants={fadeUp}
                className="max-w-2xl text-base leading-9 text-foreground-muted"
              >
                {lead.bio}
              </motion.p>

              {/* Specialty pills */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-2.5"
              >
                {lead.specialties.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-foreground-muted shadow-sm transition-all hover:border-teal/50 hover:text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeUp} className="mt-10">
                <Link
                  href={`/${locale}/contact`}
                  className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_10px_30px_rgba(122,28,81,0.25)] transition-all hover:bg-primary-light hover:shadow-[0_14px_40px_rgba(122,28,81,0.35)]"
                >
                  <span>{lead.cta}</span>
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
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Subtle bottom divider */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        />
      </div>

      {/* ═══════════════════════════════════════════
          BLOCK 2 — ABOUT + TEAM (Light)
      ═══════════════════════════════════════════ */}
      {/* <div className="bg-background-soft py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal">
              {safeAbout.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl">
              {safeAbout.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-foreground-muted">
              {safeAbout.description}
            </p>
          </motion.div>

          {safeAbout.stats && safeAbout.stats.length > 0 && (
            <motion.div
              variants={teamContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3"
            >
              {safeAbout.stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={teamItem}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-border bg-surface p-6 text-center shadow-[0_10px_26px_rgba(122,28,81,0.04)] transition-shadow hover:shadow-[0_18px_40px_rgba(122,28,81,0.08)]"
                >
                  <p className="text-3xl font-black tracking-tight text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {doctors.length > 0 && (
            <div className="mt-20">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-10 flex items-end justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal">
                    {isArabic ? "فريقنا الطبي" : "Our Medical Team"}
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-primary sm:text-3xl">
                    {isArabic
                      ? "نخبة من الأطباء المتخصصين"
                      : "A team of specialized doctors"}
                  </h3>
                </div>
                <div
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent sm:block"
                />
              </motion.div>

              <motion.div
                variants={teamContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {doctors.map((doctor) => (
                  <motion.div key={doctor.name} variants={teamItem}>
                    <Card className="group h-full rounded-[28px] border border-border bg-surface p-6 shadow-[0_10px_26px_rgba(122,28,81,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-teal/40 hover:shadow-[0_20px_44px_rgba(122,28,81,0.10)]">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-lg font-bold text-primary transition-transform duration-300 group-hover:scale-105">
                        {doctor.initials}
                      </div>
                      <h4 className="mt-5 text-lg font-bold leading-tight text-primary">
                        {doctor.name}
                      </h4>
                      <p className="mt-1.5 text-sm text-teal">
                        {doctor.specialty}
                      </p>
                      <Link
                        href={`/${locale}/doctors`}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-75"
                      >
                        {isArabic ? "احجز معه" : "Book with"}
                        <span
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100"
                        >
                          ›
                        </span>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div> */}
    </section>
  );
}