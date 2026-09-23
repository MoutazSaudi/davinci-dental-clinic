"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

type ServiceCardProps = {
  locale: Locale;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  image: string;
};

export function ServiceCard({
  locale,
  slug,
  title,
  shortDescription,
  category,
  image,
}: ServiceCardProps) {
  const isArabic = locale === "ar";

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className="group relative h-full"
    >
      <Link
        href={`/${locale}/services/${slug}`}
        aria-label={
          isArabic ? `اقرأ المزيد عن ${title}` : `Read more about ${title}`
        }
        className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_14px_32px_rgba(122,28,81,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_20px_42px_rgba(122,28,81,0.10)]"
      >
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Soft gradient on hover */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary/35 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden="true"
          />

          {/* Arrow badge */}
          <span
            className="absolute end-4 top-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-white/95 text-primary opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4 stroke-[2.5] stroke-current rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
            {category}
          </p>

          <h3 className="mt-3 text-2xl font-black leading-tight text-primary">
            {title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-foreground-muted">
            {shortDescription}
          </p>

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            {isArabic ? "اقرأ المزيد" : "Read more"}
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              aria-hidden="true"
            >
              {isArabic ? "‹" : "›"}
            </span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}