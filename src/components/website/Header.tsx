"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitch } from "./LanguageSwitch";
import type { Locale } from "@/lib/i18n";

type HeaderProps = {
  locale: Locale;
  nav: Record<string, string>;
};

export function Header({ locale, nav }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === `/${locale}`;
  const shouldBeDark = scrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = [
    {
      label: nav.home || (locale === "ar" ? "الرئيسية" : "Home"),
      href: `/${locale}`,
    },
    {
      label: nav.services || (locale === "ar" ? "الخدمات" : "Services"),
      href: `/${locale}/services`,
    },
    {
      label: nav.about || (locale === "ar" ? "من نحن" : "About us"),
      href: `/${locale}/about`,
    },
    {
      label: nav.doctors || (locale === "ar" ? "الأطباء" : "Doctors"),
      href: `/${locale}/doctors`,
    },
    {
      label: nav.gallery || (locale === "ar" ? "المعرض" : "Gallery"),
      href: `/${locale}/gallery`,
    },
    // {
    //   label: nav.faq || (locale === "ar" ? "الأسئلة" : "FAQ"),
    //   href: `/${locale}/faq`,
    // },
    // {
    //   label: nav.blog || (locale === "ar" ? "المدونة" : "Blog"),
    //   href: `/${locale}/blog`,
    // },
    {
      label: nav.contact || (locale === "ar" ? "تواصل معنا" : "Contact"),
      href: `/${locale}/contact`,
    },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -15,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  } as const;

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 },
  } as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-4 text-white transition-all">
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 50,
          mass: 0.7,
        }}
        className={`pointer-events-auto flex items-center justify-between transition-colors duration-300 ${
          shouldBeDark
            ? "rounded-full bg-primary/90 px-5 sm:px-6 py-2.5 backdrop-blur-2xl border border-white/10 shadow-2xl gap-4 sm:gap-6"
            : "w-full px-6 lg:px-16 py-4 bg-transparent border-transparent shadow-none gap-8"
        }`}
      >
        <Link
          href={`/${locale}`}
          className="flex items-center group shrink-0"
          aria-label="Home"
        >
          <motion.div
            layout
            className={`relative transition-all duration-300 ${
              shouldBeDark
                ? "h-7 w-28 sm:h-8 sm:w-32"
                : "h-10 w-40 sm:h-12 sm:w-48"
            }`}
          >
            <Image
              src={shouldBeDark ? "/logo-white.png" : "/logo.png"}
              alt="Damascus Dental Clinic"
              fill
              priority
              sizes="200px"
              className="object-contain object-left rtl:object-right"
            />
          </motion.div>
        </Link>

        <nav
          className="hidden items-center text-white md:flex"
          aria-label="Main navigation"
        >
          <motion.div
            layout
            className={`flex items-center transition-all ${
              shouldBeDark
                ? "gap-5 bg-transparent px-0 py-0 backdrop-blur-none"
                : "gap-8 rounded-full bg-white/10 px-10 py-3.5 backdrop-blur-md"
            }`}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-semibold text-white transition-opacity hover:opacity-80 whitespace-nowrap ${
                  shouldBeDark ? "text-xs" : "text-sm"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        </nav>

        <motion.div layout className="flex items-center gap-2 sm:gap-2.5">
          <LanguageSwitch
            locale={locale}
            variant="desktop"
            shouldBeDark={shouldBeDark}
          />

          <Link
            href={`/${locale}/contact`}
            className="group flex items-center gap-1.5"
          >
            <motion.div
              layout
              className={`flex items-center justify-center rounded-full bg-white font-bold text-primary shadow-md transition-transform group-hover:scale-105 ${
                shouldBeDark
                  ? "h-8 sm:h-9 px-3 sm:px-4 text-[10px] tracking-wider"
                  : "h-10 sm:h-12 px-4 sm:px-7 text-[11px] sm:text-xs tracking-wider"
              }`}
            >
              <span className="whitespace-nowrap">
                {nav.appointment ||
                  (locale === "ar" ? "احجز مكالمة" : "BOOK A CALL")}
              </span>
            </motion.div>

            <motion.div
              layout
              className={`flex items-center justify-center rounded-full bg-white text-primary shadow-md transition-transform group-hover:scale-105 ${
                shouldBeDark
                  ? "h-8 w-8 sm:h-9 sm:w-9"
                  : "h-10 w-10 sm:h-12 sm:w-12"
              }`}
            >
              <svg
                className={`stroke-[2.5] stroke-current transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5 ${
                  shouldBeDark ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4"
                }`}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </motion.div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex md:hidden items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition-colors hover:bg-white/20 focus:outline-none ${
              shouldBeDark ? "h-8 w-8" : "h-10 w-10"
            }`}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-5 h-5 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={mobileMenuOpen ? "open" : "closed"}
                variants={{
                  closed: { d: "M 4 6 L 20 6 M 4 12 L 20 12 M 4 18 L 20 18" },
                  open: { d: "M 6 18 L 18 6 M 6 6 L 18 18" },
                }}
                transition={{ duration: 0.3 }}
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="pointer-events-auto absolute top-20 left-4 right-4 z-40 rounded-3xl bg-primary/95 p-6 backdrop-blur-2xl border border-white/10 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <motion.div key={item.href} variants={itemVariants}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base font-semibold text-white/90 hover:text-white transition-colors border-b border-white/5"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={itemVariants}
                className="pt-2 flex items-center justify-between"
              >
                <span className="text-xs text-white/60">Language:</span>
                <LanguageSwitch
                  locale={locale}
                  variant="mobile"
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}