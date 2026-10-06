"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const STORAGE_KEY = "clinic-selector-choice";
const ABU_DHABI_URL = "https://davincidental.ae/";

type ClinicKey = "damascus" | "abu-dhabi";
type ClinicSelectorProps = { locale: Locale };

type ClinicOptionConfig = {
  key: ClinicKey;
  cityEn: string;
  cityAr: string;
  subtitleEn: string;
  subtitleAr: string;
  map: string;
  pinAlign: "left" | "right";
};

const CLINICS: ClinicOptionConfig[] = [
  {
    key: "abu-dhabi",
    cityEn: "Abu Dhabi",
    cityAr: "أبوظبي",
    subtitleEn: "Expert dental care in the heart of the UAE",
    subtitleAr: "رعاية أسنان متخصصة في قلب الإمارات",
    map: "/maps/ae.svg",
    pinAlign: "left",
  },
  {
    key: "damascus",
    cityEn: "Damascus",
    cityAr: "دمشق",
    subtitleEn: "Trusted dental care for a healthier smile",
    subtitleAr: "رعاية أسنان موثوقة لابتسامة أكثر صحة",
    map: "/maps/sy.svg",
    pinAlign: "right",
  },
];

export function ClinicSelector({ locale }: ClinicSelectorProps) {
  const isRtl = locale === "ar";
  const prefersReducedMotion = useReducedMotion() ?? false;

  const [isOpen, setIsOpen] = useState(true);

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const choice = localStorage.getItem(STORAGE_KEY);

    if (choice === "damascus") {
      setIsOpen(false);
      return;
    }

    if (choice === "abu-dhabi") {
      window.location.assign(ABU_DHABI_URL);
      return;
    }

    setIsOpen(true);
  }, []);

  const handleChoose = useCallback((key: ClinicKey) => {
    localStorage.setItem(STORAGE_KEY, key);

    if (key === "abu-dhabi") {
      window.location.assign(ABU_DHABI_URL);
      return;
    }

    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;

      const t = window.setTimeout(() => {
        dialogRef.current?.focus({ preventScroll: true });
      }, 60);

      return () => window.clearTimeout(t);
    }

    lastFocusedRef.current?.focus?.();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={isRtl ? "اختر الفرع" : "Choose your clinic"}
          tabIndex={-1}
          dir={isRtl ? "rtl" : "ltr"}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
          className="fixed inset-0 z-[9999] min-h-[100dvh] overflow-hidden bg-primary outline-none"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-[300px] w-[300px] rounded-full bg-teal-light/10 blur-[90px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />

            <div className="absolute -bottom-40 -right-40 h-[300px] w-[300px] rounded-full bg-gold-light/10 blur-[90px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.12)_100%)]" />
          </div>

          <div className="relative flex min-h-[100dvh] flex-col">
            <motion.header
              initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.15,
                duration: 0.5,
              }}
              className="relative z-20 flex shrink-0 justify-center px-4 pb-3 pt-5 sm:px-6 sm:pb-5 sm:pt-8 md:pt-10 lg:pt-12"
            >
              <div className="text-center">
                <p className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-gold-light/80 sm:text-xs sm:tracking-[0.35em] md:text-sm">
                  Da Vinci
                </p>

                <h1 className="mt-1 font-sans text-base font-semibold tracking-[0.14em] text-white sm:text-xl sm:tracking-[0.18em] md:text-2xl">
                  DENTAL CLINIC
                </h1>

                <div className="mx-auto mt-2.5 h-px w-10 bg-gold/70 sm:mt-4 sm:w-12" />
              </div>
            </motion.header>

            <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
              <ClinicOption
                config={CLINICS[0]}
                isRtl={isRtl}
                prefersReducedMotion={prefersReducedMotion}
                onSelect={handleChoose}
                delay={0.2}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-5 right-5 top-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent sm:left-6 sm:right-6 lg:hidden"
              />

              <ClinicOption
                config={CLINICS[1]}
                isRtl={isRtl}
                prefersReducedMotion={prefersReducedMotion}
                onSelect={handleChoose}
                delay={0.3}
              />
            </div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.65,
                duration: 0.5,
              }}
              className="relative z-20 flex shrink-0 items-center justify-center gap-2.5 px-4 pb-4 pt-2 text-[8px] font-medium uppercase tracking-[0.25em] text-white/35 sm:gap-4 sm:px-6 sm:pb-7 sm:pt-3 sm:text-[10px] sm:tracking-[0.3em] md:pb-8 md:text-xs"
            >
              <span className="hidden h-px w-8 bg-white/15 sm:block sm:w-10" />

              <span className="text-center">
                {isRtl
                  ? "نفس العناية · موقعان"
                  : "Same dedication · Two locations"}
              </span>

              <span className="hidden h-px w-8 bg-white/15 sm:block sm:w-10" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type ClinicOptionProps = {
  config: ClinicOptionConfig;
  isRtl: boolean;
  prefersReducedMotion: boolean;
  onSelect: (key: ClinicKey) => void;
  delay: number;
};

function ClinicOption({
  config,
  isRtl,
  prefersReducedMotion,
  onSelect,
  delay,
}: ClinicOptionProps) {
  const {
    key,
    cityEn,
    cityAr,
    subtitleEn,
    subtitleAr,
    map,
    pinAlign,
  } = config;

  const cityLabel = isRtl ? cityAr : cityEn;
  const subtitle = isRtl ? subtitleAr : subtitleEn;

  const maskStyle = useMemo<CSSProperties>(
    () => ({
      WebkitMaskImage: `url(${map})`,
      maskImage: `url(${map})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",
    }),
    [map],
  );

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(key)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ contain: "paint" }}
      className="group relative isolate flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden px-4 py-3 text-center outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:px-6 sm:py-6 md:px-10 md:py-8 lg:px-12 lg:py-4"
      aria-label={isRtl ? `المتابعة إلى ${cityAr}` : `Continue to ${cityEn}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/12 opacity-0 blur-[100px] transition-opacity duration-500 group-hover:opacity-100 sm:block"
      />

      <div className="relative z-10">
        <p className="font-sans text-[8px] font-medium uppercase tracking-[0.28em] text-gold-light/80 sm:text-[10px] sm:tracking-[0.35em] md:text-xs">
          {isRtl ? "أنت في" : "You are in"}
        </p>

        <h2 className="mt-1.5 font-sans text-2xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-gold-light min-[400px]:text-3xl sm:mt-2 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          {cityLabel}
        </h2>

        <p className="mx-auto mt-1.5 line-clamp-2 max-w-[260px] text-[10px] leading-4 text-white/50 transition-colors duration-300 group-hover:text-white/70 sm:mt-3 sm:max-w-sm sm:text-xs sm:leading-6 md:text-sm">
          {subtitle}
        </p>
      </div>

      <div className="relative z-10 my-2 flex h-[90px] w-full max-w-[200px] items-center justify-center min-[400px]:h-[110px] sm:my-5 sm:h-[160px] sm:max-w-[280px] md:my-6 md:h-[210px] md:max-w-[330px] lg:my-4 lg:h-[220px] xl:h-[250px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-20 w-20 rounded-full bg-teal-light/15 blur-2xl sm:h-32 sm:w-32 sm:blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-20 w-20 scale-150 rounded-full bg-gold/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:h-32 sm:w-32 sm:blur-3xl"
        />

        <div className="relative h-full w-full max-h-full max-w-[150px] transform-gpu transition-transform duration-500 ease-out will-change-transform group-hover:scale-110 sm:max-w-[220px] md:max-w-[260px]">
          <div className="absolute inset-0" style={maskStyle}>
            <div className="absolute inset-0 bg-teal-light/45 opacity-80 transition-opacity duration-500 group-hover:opacity-0" />

            <div className="absolute inset-0 bg-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </div>

        <div
          aria-hidden="true"
          className={`absolute ${
            pinAlign === "left" ? "left-[55%]" : "left-[47%]"
          } top-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu transition-transform duration-300 will-change-transform group-hover:scale-110`}
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-gold/25 transition-[transform,opacity] duration-500 group-hover:scale-150 group-hover:opacity-0" />

            <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-primary/90 shadow-lg transition-colors duration-300 group-hover:border-gold/60 group-hover:bg-gold sm:h-8 sm:w-8 md:h-9 md:w-9">
              <MapPin className="h-3 w-3 text-gold-light transition-colors duration-300 group-hover:text-primary sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-2 text-[8px] font-medium uppercase tracking-[0.15em] text-white/60 transition-colors duration-300 group-hover:border-gold/50 group-hover:text-gold-light min-[400px]:text-[9px] sm:gap-3 sm:px-6 sm:py-3 sm:text-[10px] sm:tracking-[0.18em] md:px-7 md:py-3.5 md:text-xs">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-gold/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <span className="relative whitespace-nowrap">
          {isRtl ? `المتابعة إلى ${cityAr}` : `Continue to ${cityEn}`}
        </span>

        <ArrowRight
          className={`relative h-3 w-3 shrink-0 transform-gpu transition-transform duration-300 will-change-transform sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${
            isRtl
              ? "rotate-180 group-hover:-translate-x-1"
              : "group-hover:translate-x-1"
          }`}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 origin-center scale-x-0 transform-gpu bg-gradient-to-r from-transparent via-gold/50 to-transparent transition-transform duration-500 will-change-transform group-hover:scale-x-100"
      />
    </motion.button>
  );
}