"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

type Category = {
  slug: string;
  label: string;
  count: number;
  image: string;
};

type SignatureServicesSectionProps = {
  locale: "en" | "ar";
  categories: Category[];
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function formatCount(count: number, locale: "en" | "ar"): string {
  if (locale === "ar") {
    if (count === 1) return "خدمة واحدة";
    if (count === 2) return "خدمتان";
    if (count <= 10) return `${count} خدمات`;
    return `${count} خدمة`;
  }
  if (count === 1) return "1 service";
  return `${count} services`;
}

export function SignatureServicesSection({
  locale,
  categories,
}: SignatureServicesSectionProps) {
  const isRtl = locale === "ar";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal"
        >
          {isRtl ? "تخصصاتنا" : "OUR SPECIALTIES"}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl"
        >
          {isRtl
            ? "مجموعة شاملة من العلاجات"
            : "A Comprehensive Range of Treatments"}
        </motion.h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.slug}
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <Link
              href={`/${locale}/services?category=${cat.slug}`}
              aria-label={
                isRtl ? `استعرض ${cat.label}` : `Browse ${cat.label}`
              }
              className="group relative flex h-60 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-mint p-5 shadow-sm transition-all hover:shadow-xl"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-light/40 via-teal-light/5 to-transparent" />
              </div>

              <div className="relative z-10">
                <span className="inline-flex items-center rounded-xl bg-white/95 px-3 py-1.5 text-[11px] font-bold text-primary shadow-md backdrop-blur-md">
                  {formatCount(cat.count, locale)}
                </span>
              </div>

              <div className="relative z-10 flex items-end justify-between">
                <h3 className="max-w-[80%] text-xl font-bold leading-tight !text-white drop-shadow-sm">
                  {cat.label}
                </h3>

                <span className="flex h-7 w-7 items-center justify-center text-sm text-white/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white rtl:group-hover:-translate-x-1">
                  {isRtl ? "‹" : "›"}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}