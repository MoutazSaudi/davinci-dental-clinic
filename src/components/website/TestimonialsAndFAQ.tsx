"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

type Testimonial = {
  name: string;
  text: string;
  source?: "google" | "instagram" | "in-person";
  rating?: number;
};

type FAQItem = {
  question: string;
  answer: string;
};

type TestimonialsAndFAQProps = {
  locale: "en" | "ar";
  testimonials: Testimonial[];
  faq?: FAQItem[]; // ← اختياري الآن
  heading?: {
    eyebrow: string;
    title: string;
  };
};

function SourceBadge({ source }: { source: Testimonial["source"] }) {
  if (source === "google") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-foreground-muted"
        title="Google Reviews"
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.93a5.08 5.08 0 0 1-2.2 3.33v2.76h3.56c2.08-1.92 3.21-4.74 3.21-8.33Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84Z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
        </svg>
        Google
      </span>
    );
  }

  if (source === "instagram") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-foreground-muted"
        title="Instagram"
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
        Instagram
      </span>
    );
  }

  return null;
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div
      className="flex items-center gap-0.5 text-gold"
      aria-label={`Rating ${count} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsAndFAQ({
  locale,
  testimonials,
  faq,
  heading,
}: TestimonialsAndFAQProps) {
  const isArabic = locale === "ar";
  const hasFAQ = faq && faq.length > 0;

  const eyebrow =
    heading?.eyebrow ?? (isArabic ? "آراء المرضى" : "Patient stories");
  const title =
    heading?.title ??
    (isArabic
      ? "ضمان لراحتك ونتائجك"
      : "A reassuring experience from the very first visit");

  return (
    <section className="bg-background-soft py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-primary sm:text-4xl">
            {title}
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={`${testimonial.name}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <Card className="group relative flex h-full flex-col rounded-[28px] border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_18px_40px_rgba(122,28,81,0.10)]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 start-6 select-none font-serif text-6xl leading-none text-gold/40 transition-colors duration-300 group-hover:text-gold/70"
                >
                  &ldquo;
                </span>

                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mint text-base font-bold text-primary transition-transform duration-300 group-hover:scale-105">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Stars count={testimonial.rating ?? 5} />
                      <SourceBadge source={testimonial.source} />
                    </div>

                    <p
                      className="mt-4 text-sm leading-7 text-foreground-muted"
                      dir="rtl"
                    >
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    <p className="mt-4 text-sm font-bold text-primary">
                      {testimonial.name}
                    </p>

                    {!isArabic && testimonial.source === "google" && (
                      <p className="mt-0.5 text-[10px] italic text-foreground-light">
                        Original review in Arabic
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ — conditionally rendered */}
        {hasFAQ && (
          <>
            <div
              aria-hidden="true"
              className="mx-auto my-16 h-px max-w-xs bg-gradient-to-r from-transparent via-gold/40 to-transparent"
            />

            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                {isArabic ? "الأسئلة الشائعة" : "Frequently asked"}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-primary sm:text-4xl">
                {isArabic
                  ? "الإجابات التي تحتاج إليها"
                  : "Helpful answers before your visit"}
              </h2>
            </div>

            <div className="mx-auto mt-10 max-w-3xl space-y-3">
              {faq!.map((item, i) => (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <details
                    className="group rounded-[24px] border border-border bg-surface p-4 shadow-sm transition-colors open:border-teal sm:p-5"
                    open={i === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <span className="text-base font-semibold text-primary">
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint text-teal transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 ps-1 text-sm leading-7 text-foreground-muted">
                      {item.answer}
                    </p>
                  </details>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}