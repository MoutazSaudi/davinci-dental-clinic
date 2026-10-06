/**
 * Global site configuration and clinic contact data.
 * Independent from any mock/domain data.
 */

export const siteConfig = {
  baseUrl: "https://davincidental.org",
  siteName: { ar: "دافينشي لطب الأسنان", en: "Davinci Dental Clinic" },
  defaultTitle: {
    ar: "دافينشي لطب الأسنان — دمشق وأبوظبي",
    en: "Davinci Dental Clinic — Damascus & Abu Dhabi",
  },
  defaultDescription: {
    ar: "دافينشي لطب الأسنان — رعاية متخصصة في تقويم الأسنان وآلام الوجه والمفصل الفكي الصدغي. فرعان في دمشق وأبوظبي.",
    en: "Davinci Dental Clinic — specialized care in orthodontics, orofacial pain and TMJ. Two branches in Damascus and Abu Dhabi.",
  },
  ogLocale: { ar: "ar_SY", en: "en_US" },
  hreflang: { ar: "ar-SY", en: "en" },
  geo: {
    region: "SY",
    placename: { ar: "دمشق", en: "Damascus" },
    position: "33.5138;36.2765",
    ICBM: "33.5138, 36.2765",
  },
} as const;

export const clinicContactData = {
  phone: "+971 55 544 9975",
  call: "+971 55 544 9975",
  whatsapp: "+971 55 544 9975",
  email: "info@saudidental.sy",
  address: {
    ar: "المزرعة، دمشق، سوريا",
    en: "Al-Mazraa, Damascus, Syria",
  },
  social: {
    facebook: "https://www.facebook.com/mouhannad.saoudi.2025",
    instagram:
      "https://www.instagram.com/tmj.dr.mouhannad?stkn=MTAwdXFvd29jdXpmaQ%3D%3D&utm_source=qr",
  },
} as const;

export function getAlternateUrl(locale: "ar" | "en", path: string) {
  const clean = path.replace(/^\/(ar|en)/, "");
  return {
    ar: `${siteConfig.baseUrl}/ar${clean}`,
    en: `${siteConfig.baseUrl}/en${clean}`,
  };
}