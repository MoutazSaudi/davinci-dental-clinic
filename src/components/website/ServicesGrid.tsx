"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ServiceCard } from "./ServiceCard";
import type { Locale } from "@/lib/i18n";

export type ServiceListEntry = {
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  categoryKey: string;
  image: string;
};

export type CategoryChip = {
  slug: string;
  label: string;
  count: number;
};

type ServicesGridProps = {
  locale: Locale;
  services: ServiceListEntry[];
  categories: CategoryChip[];
};

// ─── Arabic normalization ───
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // tashkeel + tatweel
    .replace(/[أإآٱا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ئ/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

export function ServicesGrid({
  locale,
  services,
  categories,
}: ServicesGridProps) {
  const isArabic = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [query, setQuery] = useState("");

  // مزامنة الحالة مع URL عند تغيير الفئة
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  const selectCategory = (slug: string) => {
    setActiveCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  };

  const filtered = useMemo(() => {
    const q = normalize(query);

    return services.filter((s) => {
      // 1) فلتر الفئة
      if (activeCategory !== "all" && s.categoryKey !== activeCategory) {
        return false;
      }
      // 2) فلتر البحث (بعد التطبيع)
      if (!q) return true;

      const title = normalize(s.title);
      const desc = normalize(s.shortDescription);
      const cat = normalize(s.category);

      return title.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [query, activeCategory, services]);

  const totalChips = services.length;

  return (
    <>
      {/* ─── Search + Counter ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-foreground-light">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35"
                />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isArabic ? "ابحث عن خدمة..." : "Search for a service..."
              }
              aria-label={isArabic ? "بحث في الخدمات" : "Search services"}
              className="h-12 w-full rounded-full border border-border-light bg-surface ps-11 pe-4 text-sm text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-mint-dark"
            />
          </div>

          <p
            role="status"
            aria-live="polite"
            className="text-xs font-medium text-foreground-muted sm:text-sm"
          >
            {isArabic
              ? `عرض ${filtered.length} من ${totalChips} خدمة`
              : `Showing ${filtered.length} of ${totalChips} services`}
          </p>
        </div>
      </section>

      {/* ─── Category chips ─── */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            active={activeCategory === "all"}
            onClick={() => selectCategory("all")}
            label={isArabic ? "الكل" : "All"}
            count={totalChips}
          />
          {categories.map((c) => (
            <CategoryChip
              key={c.slug}
              active={activeCategory === c.slug}
              onClick={() => selectCategory(c.slug)}
              label={c.label}
              count={c.count}
            />
          ))}
        </div>
      </section>

      {/* ─── Grid / Empty state ─── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filtered.length > 0 ? (
          <motion.div
            key={`${activeCategory}-${query}`}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.06 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {filtered.map((service) => (
              <ServiceCard
                key={service.slug}
                locale={locale}
                slug={service.slug}
                title={service.title}
                shortDescription={service.shortDescription}
                category={service.category}
                image={service.image}
              />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-[28px] border border-border bg-surface p-10 text-center sm:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint text-teal">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <circle cx="11" cy="11" r="8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35"
                />
              </svg>
            </div>
            <h3 className="mt-5 text-2xl font-bold text-primary">
              {isArabic ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="mt-2 text-sm leading-7 text-foreground-muted">
              {isArabic
                ? `لم نجد خدمة تطابق "${query}". جرّب كلمة أخرى.`
                : `We couldn't find a service matching "${query}". Try another keyword.`}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                selectCategory("all");
              }}
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light"
            >
              {isArabic ? "إعادة التعيين" : "Reset"}
            </button>
          </div>
        )}
      </section>
    </>
  );
}

// ─── CategoryChip ───
function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-surface text-foreground-muted hover:border-teal hover:text-primary"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
          active ? "bg-white/20 text-white" : "bg-mint text-teal"
        }`}
      >
        {count}
      </span>
    </button>
  );
}