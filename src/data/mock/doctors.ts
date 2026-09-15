import { type Locale } from "./services";

export interface DoctorItem {
  slug: string;
  name: string;
  specialization: {
    ar: string;
    en: string;
  };
  image: string;
  bio: {
    ar: string;
    en: string;
  };
  social?: {
    instagram?: string;
    linkedin?: string;
  };
}

export const doctorCatalog: DoctorItem[] = [
  {
    slug: "dr-ahmad-al-ali",
    name: "د. أحمد العلي",
    specialization: {
      ar: "استشاري تقويم الأسنان والفرط جراحي",
      en: "Orthodontic & Maxillofacial Consultant",
    },
    image: "https://davincidental.ae/wp-content/uploads/2023/06/Children-Orthodontics.jpg",
    bio: {
      ar: "خبير في تصحيح اصطفاف الأسنان ومعالجة مشاكل الإطباق المعقدة لدى الأطفال والكبار بأحدث الأساليب.",
      en: "Expert in correcting teeth alignment and treating complex bite issues for children and adults using modern techniques.",
    },
    social: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    slug: "dr-sara-mahmoud",
    name: "د. سارة محمود",
    specialization: {
      ar: "أخصائية تجميل الأسنان وابتسامة هوليود",
      en: "Aesthetic Dentistry & Hollywood Smile Specialist",
    },
    image: "https://davincidental.ae/wp-content/uploads/2017/09/Dental-Veneers.jpg",
    bio: {
      ar: "متخصصة في تصميم الابتسامات الرقمية، وتجميل الأسنان بالفينير واللومينير لضمان مظهر طبيعي وجذاب.",
      en: "Specialized in digital smile design, veneers, and lumineers to ensure a natural and attractive appearance.",
    },
    social: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    slug: "dr-mohammed-khalid",
    name: "د. محمد خالد",
    specialization: {
      ar: "استشاري جراحة الفم وزراعة الأسنان",
      en: "Oral Surgery & Dental Implant Consultant",
    },
    image: "https://davincidental.ae/wp-content/uploads/2017/09/Dental-Implant-Surgery.jpg",
    bio: {
      ar: "خبرة واسعة في عمليات زراعة الأسنان المتقدمة والتعويضات الثابتة بأعلى معايير الأمان والجودة.",
      en: "Extensive experience in advanced dental implant surgeries and fixed prosthetics with the highest safety standards.",
    },
    social: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
];

export function getDoctorBySlug(locale: Locale, slug: string) {
  const doctor = doctorCatalog.find((d) => d.slug === slug);
  if (!doctor) return undefined;

  return {
    ...doctor,
    specialization: doctor.specialization[locale],
    bio: doctor.bio[locale],
  };
}