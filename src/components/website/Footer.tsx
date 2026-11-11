import Image from "next/image";
import Link from "next/link";
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
  instagram: "https://www.instagram.com/davincidamas",
};

export function Footer({ locale, footer, nav }: FooterProps) {
  const isArabic = locale === "ar";
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/services`, label: nav.services },
    { href: `/${locale}/doctors`, label: nav.doctors },
    { href: `/${locale}/about`, label: isArabic ? "من نحن" : "About" },
  ];

  return (
    <footer className="border-t border-border bg-primary text-white">
      {/* ─── Main content ─── */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href={`/${locale}`} className="inline-block">
              <div className="relative h-14 w-44">
                <Image
                  src="/logo-white.png"
                  alt="Davinci Dental Clinic"
                  fill
                  sizes="176px"
                  className="object-contain object-left rtl:object-right"
                />
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
              {isArabic
                ? "دافينشي لطب الأسنان — رعاية شاملة في دمشق وأبوظبي، تجمع بين الخبرة الأكاديمية والدفء الإنساني."
                : "Davinci Dental Clinic — comprehensive dental care in Damascus and Abu Dhabi, where academic expertise meets genuine warmth."}
            </p>

            <div className="mt-8 flex items-center gap-2">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold hover:text-gold"
              >
                <FacebookIcon />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold hover:text-gold"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <SectionTitle
              isArabic={isArabic}
              text={{ ar: "استكشف", en: "Explore" }}
            />
            <ul className="mt-5 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
                  >
                    <span className="h-px w-3 bg-white/30 transition-all duration-300 group-hover:w-5 group-hover:bg-gold" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <SectionTitle
              isArabic={isArabic}
              text={{ ar: "تواصل", en: "Contact" }}
            />
            <ul className="mt-5 space-y-3.5 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
                <a
                  href="tel:+963980677113"
                  dir="ltr"
                  className="transition-colors hover:text-white"
                >
                  +963 980 677 113
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
                <a
                  href={`mailto:${footer.email}`}
                  className="transition-colors hover:text-white"
                >
                  {footer.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
                <span>
                  {isArabic
                    ? "المزرعة، دمشق، سوريا"
                    : "Al-Mazraa, Damascus, Syria"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Bottom bar ─── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-white/60 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year}{" "}
            {isArabic
              ? "دافينشي لطب الأسنان. جميع الحقوق محفوظة."
              : "Davinci Dental Clinic. All rights reserved."}
          </p>
          <p className="flex items-center gap-2">
            <span>{isArabic ? "دمشق" : "Damascus"}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{isArabic ? "أبوظبي" : "Abu Dhabi"}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────── Sub-components ─────────── */

function SectionTitle({
  isArabic,
  text,
}: {
  isArabic: boolean;
  text: { ar: string; en: string };
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-1 w-1 rounded-full bg-gold" />
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
        {isArabic ? text.ar : text.en}
      </h3>
    </div>
  );
}

/* ─────────── Icons ─────────── */

function FacebookIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}

function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}