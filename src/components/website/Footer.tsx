import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Locale } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
  footer: {
    phone: string;
    email: string;
    address: string;
  };
  nav: Record<string, string>;
};

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/mouhannad.saoudi.2025",
  instagram:
    "https://www.instagram.com/tmj.dr.mouhannad?stkn=MTAwdXFvd29jdXpmaQ%3D%3D&utm_source=qr",
};

export function Footer({ locale, footer, nav }: FooterProps) {
  const isArabic = locale === "ar";

  return (
    <footer className="border-t border-border bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          {/* ─── Brand + Logo ─── */}
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-36">
                <Image
                  src="/logo-white.png"
                  alt="Davinci Dental Clinic"
                  fill
                  sizes="150px"
                  className="object-contain object-left rtl:object-right"
                />
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/75">
              {isArabic
                ? "دافينشي لطب الأسنان — رعاية شاملة في دمشق وأبوظبي، تجمع بين الخبرة الأكاديمية والدفء الإنساني."
                : "Davinci Dental Clinic — comprehensive care in Damascus and Abu Dhabi, combining academic expertise with human warmth."}
            </p>
          </div>

          {/* ─── Quick links ─── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              {isArabic ? "روابط سريعة" : "Quick links"}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/85">
              <li>
                <a
                  href={`/${locale}`}
                  className="transition-colors hover:text-gold"
                >
                  {nav.home}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/services`}
                  className="transition-colors hover:text-gold"
                >
                  {nav.services}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/doctors`}
                  className="transition-colors hover:text-gold"
                >
                  {nav.doctors}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/about`}
                  className="transition-colors hover:text-gold"
                >
                  {isArabic ? "من نحن" : "About us"}
                </a>
              </li>
              {/* <li>
                <a
                  href={`/${locale}/blog`}
                  className="transition-colors hover:text-gold"
                >
                  {nav.blog}
                </a>
              </li> */}
            </ul>
          </div>

          {/* ─── Contact ─── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              {isArabic ? "تواصل" : "Contact"}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/85">
              <li>
                <a
                  href="tel:+971555449975"
                  className="transition-colors hover:text-gold"
                  dir="ltr"
                >
                  +971 55 544 9975
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${footer.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {footer.email}
                </a>
              </li>
              <li>
                {isArabic
                  ? "المزرعة، دمشق، سوريا"
                  : "Al-Mazraa, Damascus, Syria"}
              </li>
            </ul>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-gold hover:text-primary"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-gold hover:text-primary"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* ─── Newsletter ─── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              {isArabic ? "النشرة البريدية" : "Newsletter"}
            </h3>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder={
                  isArabic ? "بريدك الإلكتروني" : "Your email"
                }
                aria-label="Email address"
                className="h-12 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/60"
              />
              <Button
                type="button"
                className="h-12 rounded-full bg-gold px-5 text-sm font-semibold text-primary transition hover:bg-gold-light"
              >
                {isArabic ? "إرسال" : "Join"}
              </Button>
            </div>
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/70">
          © 2026{" "}
          {isArabic ? "دافينشي لطب الأسنان" : "Davinci Dental Clinic"}
        </div>
      </div>
    </footer>
  );
}