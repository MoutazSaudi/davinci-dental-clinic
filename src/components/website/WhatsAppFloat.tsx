"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type WhatsAppFloatProps = {
  locale: "ar" | "en";
  /** International format without + or spaces. Example: "971555449975" */
  phone: string;
};

type Country = "SY" | "AE" | "OTHER";

function getMessage(locale: "ar" | "en", country: Country): string {
  const isArabic = locale === "ar";

  if (country === "SY") {
    return isArabic
      ? "مرحباً، أنا من سوريا وأرغب بالاستفسار عن خدمات عيادة دافينشي في دمشق."
      : "Hello, I'm contacting from Syria and would like to inquire about Davinci Dental Clinic's services in Damascus.";
  }

  if (country === "AE") {
    return isArabic
      ? "مرحباً، أنا من الإمارات وأرغب بالاستفسار عن خدمات عيادة دافنشي في أبوظبي."
      : "Hello, I'm contacting from the UAE and would like to inquire about Davinci Dental Clinic's services in Abu Dhabi.";
  }

  return isArabic
    ? "مرحباً، أرغب بالاستفسار عن خدمات عيادة دافنشي."
    : "Hello, I would like to inquire about Davinci Dental Clinic's services.";
}

function readCountryFromCookie(): Country {
  if (typeof document === "undefined") return "OTHER";
  const match = document.cookie.match(/(?:^|;\s*)user-country=([^;]+)/);
  const value = match?.[1]?.toUpperCase();
  if (value === "SY" || value === "AE") return value;
  return "OTHER";
}

export function WhatsAppFloat({ locale, phone }: WhatsAppFloatProps) {
  const [country, setCountry] = useState<Country>("OTHER");

  useEffect(() => {
    setCountry(readCountryFromCookie());
  }, []);

  const message = getMessage(locale, country);
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const isArabic = locale === "ar";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={isArabic ? "تواصل عبر واتساب" : "Contact via WhatsApp"}
      className="group fixed bottom-6 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.40)]"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
       {/* Wave ring 1 */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1, 2.2, 2.2],
          opacity: [0, 0.55, 0, 0],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeOut",
          times: [0, 0.1, 0.75, 1],
        }}
      />

      {/* Wave ring 2 — offset by 1.2s */}
        

      {/* WhatsApp icon */}
      <svg
        className="relative h-7 w-7"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>

      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-3 end-0 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
        {isArabic ? "تواصل معنا عبر واتساب" : "Chat with us on WhatsApp"}
      </span>
    </motion.a>
  );
}