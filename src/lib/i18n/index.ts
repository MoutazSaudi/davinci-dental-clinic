import en from "./dictionaries/en.json";
import ar from "./dictionaries/ar.json";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export function getMessages(locale: Locale) {
  return locale === "ar" ? ar : en;
}
