import { type Locale } from "./services";

export interface DoctorItem {
  slug: string;
  name: {
    ar: string;
    en: string;
  };
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
    slug: "dr-mouhannad-saudi",
    image: "/images/doctors/DrMuhanad.jpeg",
    name: {
      ar: "د. مهند سعودي",
      en: "Dr. Mouhannad Saudi",
    },
    specialization: {
      ar: "أخصائي تقويم الأسنان، وأخصائي آلام الوجه والفكين والمفصل الفكي الصدغي",
      en: "Orthodontist and Orofacial Pain & TMJ Specialist",
    },
    bio: {
      ar: "حصل على شهادة الاختصاص في آلام الوجه والمفصل الفكي الصدغي من جامعة جنوب كاليفورنيا (USC)، الولايات المتحدة. يهتم هذا التخصص بالآلام العصبية والعضلية في منطقة الوجه، والمفصل الفكي الصدغي، والصداع، وآلام الأذن، ومشاكل توقف التنفس أثناء النوم.",
      en: "Received a specialized diploma in Orofacial Pain and TMJ from the University of Southern California (USC), USA. This specialty focuses on neuromuscular pain in the facial region, TMJ disorders, headaches, ear pain, and sleep apnea.",
    },
  },
  {
    slug: "dr-marwan-qattan",
    image: "/images/doctors/DrMroan.jpeg",
    name: {
      ar: "د. مروان قطان",
      en: "Dr. Marwan Qattan",
    },
    specialization: {
      ar: "زميل الكلية الأميركية لزراعة الأسنان منذ عام ١٩٩٨",
      en: "Fellow of the American College of Oral Implantology since 1998",
    },
    bio: {
      ar: "زميل الكلية الأميركية لزراعة الأسنان منذ عام ١٩٩٨، متخصص في زراعة الأسنان والتعويضات السنية المتقدمة.",
      en: "Fellow of the American College of Oral Implantology since 1998, specialized in dental implants and advanced prosthodontics.",
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