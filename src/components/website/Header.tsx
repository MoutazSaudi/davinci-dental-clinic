"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 👈 استيراد
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n";

type HeaderProps = {
  locale: Locale;
  nav: Record<string, string>;
};

export function Header({ locale, nav }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const alternateLocale = locale === "ar" ? "en" : "ar";
  const pathname = usePathname(); // 👈 الحصول على المسار
  const isHomePage = pathname === `/${locale}`; // 👈 هل هي الصفحة الرئيسية؟
  const shouldBeDark = scrolled || !isHomePage; // 👈 متى تكون الخلفية داكنة

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = [
    { label: nav.home || (locale === "ar" ? "الرئيسية" : "Home"), href: `/${locale}` },
    { label: nav.services || (locale === "ar" ? "الخدمات" : "Services"), href: `/${locale}/services` },
    { label: nav.about || (locale === "ar" ? "من نحن" : "About us"), href: `/${locale}/about` },
    { label: nav.doctors || (locale === "ar" ? "الأطباء" : "Doctors"), href: `/${locale}/doctors` },
    { label: nav.gallery || (locale === "ar" ? "المعرض" : "Gallery"), href: `/${locale}/gallery` },
    { label: nav.faq || (locale === "ar" ? "الأسئلة" : "FAQ"), href: `/${locale}/faq` },
    { label: nav.equipment || (locale === "ar" ? "التقنية" : "Technology"), href: `/${locale}/equipment` },
    { label: nav.blog || (locale === "ar" ? "المدونة" : "Blog"), href: `/${locale}/blog` },
    { label: nav.contact || (locale === "ar" ? "تواصل معنا" : "Contact"), href: `/${locale}/contact` },
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
          shouldBeDark // 👈 استخدمنا shouldBeDark هنا
            ? "rounded-full bg-slate-900/85 px-5 sm:px-6 py-2.5 backdrop-blur-2xl border border-white/10 shadow-2xl gap-4 sm:gap-6"
            : "w-full px-6 lg:px-16 py-4 bg-transparent border-transparent shadow-none gap-8"
        }`}
      >
        {/* اللوجو */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5 text-white group" aria-label="Home">
          <motion.svg
            layout
            className={`text-white fill-current transition-all ${
              shouldBeDark ? "h-5 w-5" : "h-6 sm:h-7 w-6 sm:w-7" // 👈 استخدمنا shouldBeDark
            }`}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="5" cy="8" r="2.2" />
            <circle cx="10.5" cy="6" r="2.2" />
            <circle cx="16" cy="8" r="2.2" />
            <circle cx="6.5" cy="13.5" r="2.2" />
            <circle cx="12" cy="11.5" r="2.2" />
            <circle cx="17.5" cy="13.5" r="2.2" />
            <circle cx="9" cy="18.5" r="2.2" />
            <circle cx="15" cy="18.5" r="2.2" />
          </motion.svg>
          <motion.span
            layout
            className={`font-bold tracking-tight text-white font-sans transition-all ${
              shouldBeDark ? "text-base sm:text-lg" : "text-xl sm:text-2xl" // 👈 استخدمنا shouldBeDark
            }`}
          >
            Dental
          </motion.span>
        </Link>

        {/* شريط الملاحة للشاشات الكبيرة */}
        <nav className="hidden items-center text-white md:flex" aria-label="Main navigation">
          <motion.div
            layout
            className={`flex items-center transition-all ${
              shouldBeDark // 👈 استخدمنا shouldBeDark
                ? "gap-5 bg-transparent px-0 py-0 backdrop-blur-none"
                : "gap-8 rounded-full bg-white/10 px-10 py-3.5 backdrop-blur-md"
            }`}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-semibold text-white transition-opacity hover:opacity-80 whitespace-nowrap ${
                  shouldBeDark ? "text-xs" : "text-sm" // 👈 استخدمنا shouldBeDark
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        </nav>

        {/* الجانب الأيمن */}
        <motion.div layout className="flex items-center gap-2 sm:gap-2.5">
          {/* زر تبديل اللغة */}
          <Link
            href={`/${alternateLocale}`}
            className={`hidden sm:inline-flex items-center justify-center rounded-full text-white backdrop-blur-md transition-all hover:bg-white/20 ${
              shouldBeDark // 👈 استخدمنا shouldBeDark
                ? "bg-white/10 px-2.5 py-1 text-[11px] font-semibold"
                : "bg-white/10 px-3.5 py-2 text-xs font-semibold"
            }`}
          >
            {alternateLocale === "ar" ? "AR" : "EN"}
          </Link>

          {/* زر BOOK A CALL */}
          <Link href={`/${locale}/contact`} className="group flex items-center gap-1.5">
            <motion.div
              layout
              className={`flex items-center justify-center rounded-full bg-white font-bold text-slate-900 shadow-md transition-transform group-hover:scale-105 ${
                shouldBeDark // 👈 استخدمنا shouldBeDark
                  ? "h-8 sm:h-9 px-3 sm:px-4 text-[10px] tracking-wider"
                  : "h-10 sm:h-12 px-4 sm:px-7 text-[11px] sm:text-xs tracking-wider"
              }`}
            >
              <span className="whitespace-nowrap">
                {nav.appointment || (locale === "ar" ? "احجز مكالمة" : "BOOK A CALL")}
              </span>
            </motion.div>

            <motion.div
              layout
              className={`flex items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition-transform group-hover:scale-105 ${
                shouldBeDark ? "h-8 w-8 sm:h-9 sm:w-9" : "h-10 w-10 sm:h-12 sm:w-12" // 👈 استخدمنا shouldBeDark
              }`}
            >
              <svg
                className={`stroke-[2.5] stroke-current transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5 ${
                  shouldBeDark ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4" // 👈 استخدمنا shouldBeDark
                }`}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </motion.div>
          </Link>

          {/* زر الهامبرغر */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex md:hidden items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition-colors hover:bg-white/20 focus:outline-none ${
              shouldBeDark ? "h-8 w-8" : "h-10 w-10" // 👈 استخدمنا shouldBeDark
            }`}
            aria-label="Toggle Menu"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
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

      {/* قائمة الجوال */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="pointer-events-auto absolute top-20 left-4 right-4 z-40 rounded-3xl bg-slate-900/95 p-6 backdrop-blur-2xl border border-white/10 shadow-2xl md:hidden"
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
              <motion.div variants={itemVariants} className="pt-2 flex items-center justify-between">
                <span className="text-xs text-white/60">Language:</span>
                <Link
                  href={`/${alternateLocale}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  {alternateLocale === "ar" ? "العربية (AR)" : "English (EN)"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}