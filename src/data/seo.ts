import type { Metadata } from "next";
import { clinicContactData, siteConfig } from "./site";

export type Locale = "ar" | "en";

export type PageKey =
  | "home"
  | "about"
  | "contact"
  | "doctors"
  | "gallery"
  | "services"
  | "orthodontics"
  | "implants"
  | "tmj";

export type LocalizedString = { ar: string; en: string };
export type LocalizedList = { ar: string[]; en: string[] };

export type FaqItem = {
  question: LocalizedString;
  answer: LocalizedString;
};

export type PageSeoEntry = {
  path: string;
  title: LocalizedString;
  description: LocalizedString;
  keywords: LocalizedList;
  ogImage?: string;
  schemaType?:
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "MedicalWebPage"
    | "CollectionPage";
  faqs?: FaqItem[];
};

export const seoDefaults = {
  defaultOgImage: "/images/doctors/DrMuhanad.jpeg",
  defaultOgImageAlt: {
    ar: "عيادة دافينشي لطب الأسنان — دمشق",
    en: "Davinci Dental Clinic — Damascus",
  },
  logoPath: "/logo.png",
  whatsappNumber: clinicContactData.whatsapp.replace(/\D/g, ""),
  callNumber: clinicContactData.call.replace(/\s/g, ""),
} as const;

export const geoData = {
  region: "SY",
  placename: { ar: "دمشق", en: "Damascus" } as LocalizedString,
  position: "33.5138;36.2765",
  ICBM: "33.5138, 36.2765",
  latitude: 33.5138,
  longitude: 36.2765,
  addressCountry: "SY",
  streetAddress: { ar: "المزرعة", en: "Al-Mazraa" } as LocalizedString,
  mapsUrl: "https://maps.google.com/?q=Al-Mazraa+Damascus+Syria",
  areaServed: {
    ar: ["سوريا", "دمشق", "الإمارات", "أبوظبي"],
    en: ["Syria", "Damascus", "UAE", "Abu Dhabi"],
  } as LocalizedList,
  openingHours: [
    {
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "10:00",
      closes: "20:00",
    },
    { days: ["Saturday"], opens: "10:00", closes: "18:00" },
  ],
} as const;

export const keywordClusters: Record<
  "orthodontics" | "implants" | "tmj",
  LocalizedList
> = {
  orthodontics: {
    ar: [
      "أفضل طبيب تقويم أسنان في سوريا",
      "أخصائي تقويم أسنان في دمشق",
      "تقويم الأسنان في سوريا",
      "تقويم الأسنان الشفاف",
      "تقويم الأسنان بدون أسلاك",
      "تقويم الأسنان المعدني",
      "تقويم الأسنان للكبار",
      "تقويم الأسنان للأطفال",
      "علاج تزاحم الأسنان",
      "علاج بروز الأسنان",
      "علاج العضة المفتوحة",
      "تصحيح إطباق الأسنان",
      "سعر تقويم الأسنان في سوريا",
      "تكلفة التقويم الشفاف في دمشق",
      "استشارة أخصائي تقويم الأسنان",
      "مدة علاج تقويم الأسنان",
      "تقويم الأسنان مع بروز الفك",
      "تقويم الأسنان ومشاكل المفصل الفكي",
    ],
    en: [
      "best orthodontist in Syria",
      "orthodontist in Damascus",
      "orthodontics in Syria",
      "clear aligners",
      "braces without wires",
      "metal braces",
      "adult orthodontics",
      "kids orthodontics",
      "teeth crowding treatment",
      "teeth protrusion treatment",
      "open bite treatment",
      "bite correction",
      "braces cost in Syria",
      "clear aligners cost in Damascus",
      "orthodontist consultation",
      "orthodontic treatment duration",
      "orthodontics with jaw protrusion",
      "orthodontics and TMJ problems",
    ],
  },
  implants: {
    ar: [
      "زراعة الأسنان في سوريا",
      "أفضل طبيب زراعة أسنان في دمشق",
      "أخصائي زراعة الأسنان",
      "تكلفة زراعة الأسنان في سوريا",
      "سعر زرعة الأسنان",
      "زراعة الأسنان الفورية",
      "زراعة الأسنان بدون عظم",
      "زراعة الأسنان مع ترقيع العظم",
      "تعويض الأسنان المفقودة",
      "زراعة الأسنان للفك الكامل",
      "زراعة الأسنان All-on-4",
      "زراعة الأسنان All-on-6",
      "أفضل أنواع زراعة الأسنان",
      "زراعة الأسنان بعد الخلع",
      "زراعة الأسنان لكبار السن",
      "ألم زراعة الأسنان ومدة الشفاء",
      "زراعة الأسنان الأمامية",
      "تكلفة زراعة الفك الكامل في سوريا",
    ],
    en: [
      "dental implants in Syria",
      "best implant dentist in Damascus",
      "dental implant specialist",
      "dental implant cost in Syria",
      "implant price",
      "immediate implants",
      "implants without bone",
      "implants with bone graft",
      "missing teeth replacement",
      "full arch implants",
      "All-on-4 implants",
      "All-on-6 implants",
      "best dental implant brands",
      "implants after extraction",
      "implants for elderly",
      "implant pain and recovery time",
      "front teeth implants",
      "full mouth implant cost in Syria",
    ],
  },
  tmj: {
    ar: [
      "علاج المفصل الفكي الصدغي",
      "طبيب مفصل الفك في سوريا",
      "علاج طقطقة الفك",
      "علاج ألم الفك",
      "علاج انزلاق غضروف الفك",
      "تقويم الأسنان ومشاكل المفصل الفكي",
    ],
    en: [
      "TMJ treatment",
      "TMJ specialist in Syria",
      "jaw clicking treatment",
      "jaw pain treatment",
      "TMJ disc displacement treatment",
      "orthodontics and TMJ problems",
    ],
  },
};

export const pageSeo: Record<PageKey, PageSeoEntry> = {
  home: {
    path: "",
    schemaType: "WebPage",
    title: {
      ar: "دافينشي لطب الأسنان — تقويم وزراعة وعلاج المفصل الفكي | دمشق",
      en: "Davinci Dental Clinic — Orthodontics, Implants & TMJ Care | Damascus",
    },
    description: {
      ar: "عيادة دافينشي لطب الأسنان في دمشق — أخصائي تقويم أسنان، تقويم شفاف ومعدني للكبار والأطفال، زراعة أسنان، وعلاج المفصل الفكي الصدغي. احجز استشارتك.",
      en: "Davinci Dental Clinic in Damascus — orthodontist, clear & metal braces for adults and kids, dental implants, and TMJ treatment. Book your consultation.",
    },
    keywords: {
      ar: [
        "أفضل طبيب تقويم أسنان في سوريا",
        "أخصائي تقويم أسنان في دمشق",
        "زراعة الأسنان في سوريا",
        "علاج المفصل الفكي الصدغي",
        "عيادة أسنان في دمشق",
        "دافينشي لطب الأسنان",
      ],
      en: [
        "best orthodontist in Syria",
        "orthodontist in Damascus",
        "dental implants Syria",
        "TMJ treatment Damascus",
        "dental clinic Damascus",
        "Davinci Dental Clinic",
      ],
    },
    faqs: [
      {
        question: {
          ar: "كم تبلغ تكلفة تقويم الأسنان في سوريا؟",
          en: "How much do braces cost in Syria?",
        },
        answer: {
          ar: "تختلف التكلفة حسب نوع التقويم وحالة الأسنان. التقويم المعدني أقل تكلفة من الشفاف. نقدم استشارة أولى لتقييم الحالة وتحديد السعر بدقة.",
          en: "Cost varies by brace type and case complexity. Metal braces are more affordable than clear aligners. We provide an initial consultation for an accurate quote.",
        },
      },
      {
        question: {
          ar: "كم تستغرق مدة علاج تقويم الأسنان؟",
          en: "How long does orthodontic treatment take?",
        },
        answer: {
          ar: "تتراوح المدة عادة بين 12 و24 شهرًا حسب شدة الحالة واستجابة المريض، مع متابعة دورية كل 4–6 أسابيع.",
          en: "Treatment usually lasts 12 to 24 months depending on case severity and response, with follow-ups every 4–6 weeks.",
        },
      },
      {
        question: {
          ar: "هل زراعة الأسنان مؤلمة؟ وكم تستغرق مدة الشفاء؟",
          en: "Are dental implants painful? How long is recovery?",
        },
        answer: {
          ar: "تُجرى زراعة الأسنان تحت تخدير موضعي، لذا لا يشعر المريض بألم أثناء الإجراء. قد يستمر التورم والألم الخفيف بضعة أيام، ويتم الشفاء الكامل خلال 3–6 أشهر لالتحام الزرعة بالعظم.",
          en: "Implants are placed under local anesthesia, so there is no pain during the procedure. Mild swelling may last a few days, with full healing over 3–6 months as the implant fuses with bone.",
        },
      },
    ],
  },

  about: {
    path: "about",
    schemaType: "AboutPage",
    title: {
      ar: "من نحن | دافينشي لطب الأسنان — دمشق وأبوظبي",
      en: "About Us | Davinci Dental Clinic — Damascus & Abu Dhabi",
    },
    description: {
      ar: "دافينشي لطب الأسنان — رعاية متخصصة في تقويم الأسنان وآلام الوجه والمفصل الفكي الصدغي. فرعان في دمشق وأبوظبي، بخبرة أكاديمية من جامعة USC.",
      en: "Davinci Dental Clinic — specialized care in orthodontics, orofacial pain and TMJ. Two branches in Damascus and Abu Dhabi, with academic training from USC.",
    },
    keywords: {
      ar: [
        "عن دافينشي لطب الأسنان",
        "عيادة أسنان دمشق",
        "د. مهند سعودي",
        "استشاري TMJ",
        "آلام الوجه",
      ],
      en: [
        "about Davinci Dental Clinic",
        "dental clinic Damascus",
        "Dr. Mouhannad Saudi",
        "TMJ specialist",
        "orofacial pain",
      ],
    },
  },

  contact: {
    path: "contact",
    schemaType: "ContactPage",
    title: {
      ar: "تواصل معنا | دافينشي لطب الأسنان — دمشق",
      en: "Contact Us | Davinci Dental Clinic — Damascus",
    },
    description: {
      ar: "تواصل مع دافينشي لطب الأسنان عبر واتساب، الهاتف، البريد الإلكتروني، أو نموذج مباشر. عيادتنا في المزرعة، دمشق، سوريا.",
      en: "Contact Davinci Dental Clinic via WhatsApp, phone, email, or direct form. Our clinic is in Al-Mazraa, Damascus, Syria.",
    },
    keywords: {
      ar: [
        "تواصل عيادة أسنان",
        "حجز موعد أسنان دمشق",
        "رقم عيادة دافينشي",
        "عيادة أسنان المزرعة",
      ],
      en: [
        "dental clinic contact",
        "book dental appointment Damascus",
        "dental clinic WhatsApp",
        "dental clinic Al-Mazraa",
      ],
    },
  },

  doctors: {
    path: "doctors",
    schemaType: "MedicalWebPage",
    title: {
      ar: "الأطباء | دافينشي لطب الأسنان — د. مهند سعودي",
      en: "Doctors | Davinci Dental Clinic — Dr. Mouhannad Saudi",
    },
    description: {
      ar: "د. مهند سعودي — أخصائي تقويم الأسنان، وأخصائي آلام الوجه والفكين والمفصل الفكي الصدغي، حاصل على شهادة الاختصاص من جامعة جنوب كاليفورنيا (USC). متخصص في TMJ، الصداع، وآلام الأسنان.",
      en: "Dr. Mouhannad Saudi — Orthodontist and  Orofacial pain & TMJ specialist, with a diploma from the University of Southern California (USC). Specialized in TMJ, headaches, and dental pain.",
    },
    keywords: {
      ar: ["أطباء أسنان دمشق", "د. مهند سعودي", "استشاري TMJ", "آلام الوجه"],
      en: [
        "dental doctors Damascus",
        "Dr. Mouhannad Saudi",
        "TMJ specialist",
        "orofacial pain",
      ],
    },
  },

  gallery: {
    path: "gallery",
    schemaType: "CollectionPage",
    title: {
      ar: "المعرض | دافينشي لطب الأسنان — دمشق",
      en: "Gallery | Davinci Dental Clinic — Damascus",
    },
    description: {
      ar: "تصفح أمثلة على نتائج علاجات التقويم والابتسامة في عيادة دافينشي لطب الأسنان في دمشق.",
      en: "Explore representative orthodontic and smile treatment results from Davinci Dental Clinic in Damascus.",
    },
    keywords: {
      ar: ["نتائج تقويم أسنان", "قبل وبعد تقويم", "معرض عيادة أسنان"],
      en: ["orthodontic results", "before and after braces", "dental clinic gallery"],
    },
  },

  services: {
    path: "services",
    schemaType: "CollectionPage",
    title: {
      ar: "الخدمات | دافينشي لطب الأسنان — دمشق",
      en: "Services | Davinci Dental Clinic — Damascus",
    },
    description: {
      ar: "اكتشف مجموعة خدماتنا الشاملة: تقويم الأسنان، زراعة الأسنان، علاج المفصل الفكي الصدغي، تجميل الأسنان، والجراحة.",
      en: "Explore our comprehensive dental services including orthodontics, dental implants, TMJ treatment, cosmetic dentistry, and surgery.",
    },
    keywords: {
      ar: ["خدمات أسنان", "تقويم الأسنان", "زراعة الأسنان", "تجميل الأسنان"],
      en: ["dental services", "orthodontics", "dental implants", "cosmetic dentistry"],
    },
  },

  orthodontics: {
    path: "services/orthodontics",
    schemaType: "MedicalWebPage",
    title: {
      ar: "أفضل طبيب تقويم أسنان في سوريا | دافينشي — دمشق",
      en: "Best Orthodontist in Syria | Davinci Dental Clinic — Damascus",
    },
    description: {
      ar: "أخصائي تقويم أسنان في دمشق. تقويم شفاف، معدني، للكبار والأطفال، علاج تزاحم وبروز الأسنان والعضة المفتوحة. تعرّف على الأسعار والمدة.",
      en: "Orthodontist in Damascus. Clear and metal braces for adults and children, treatment for crowding, protrusion, and open bite. Learn about prices and duration.",
    },
    keywords: keywordClusters.orthodontics,
    faqs: [
      {
        question: {
          ar: "ما الفرق بين التقويم الشفاف والمعدني؟",
          en: "What is the difference between clear aligners and metal braces?",
        },
        answer: {
          ar: "التقويم الشفاف غير مرئي تقريباً وقابل للإزالة، لكنه مناسب للحالات البسيطة والمتوسطة. المعدني أكثر فعالية للحالات المعقدة وأقل تكلفة.",
          en: "Clear aligners are nearly invisible and removable, but are best for mild to moderate cases. Metal braces are more effective for complex cases and less expensive.",
        },
      },
      {
        question: {
          ar: "هل يمكن تركيب تقويم الأسنان للكبار؟",
          en: "Can adults get braces?",
        },
        answer: {
          ar: "نعم، يمكن تركيب التقويم في أي عمر طالما أن اللثة والعظم بحالة سليمة. نحو 30% من مرضى التقويم في العيادة هم من البالغين.",
          en: "Yes, braces can be fitted at any age as long as gums and bone are healthy. About 30% of our orthodontic patients are adults.",
        },
      },
      {
        question: {
          ar: "ما هو سعر تقويم الأسنان في سوريا؟",
          en: "What is the cost of braces in Syria?",
        },
        answer: {
          ar: "يبدأ التقويم المعدني من سعر أقل من الشفاف. التكلفة النهائية تعتمد على نوع التقويم ومدة العلاج. نقدم خطة دفع مرنة بعد الاستشارة الأولى.",
          en: "Metal braces are less expensive than clear aligners. The final cost depends on the type and treatment duration. We offer flexible payment plans after the initial consultation.",
        },
      },
    ],
  },

  implants: {
    path: "services/dental-implants",
    schemaType: "MedicalWebPage",
    title: {
      ar: "زراعة الأسنان في سوريا | All-on-4 وزراعة فورية",
      en: "Dental Implants in Syria | All-on-4 & Immediate Implants",
    },
    description: {
      ar: "زراعة أسنان في دمشق: زراعة فورية، بدون عظم، مع ترقيع، والفك الكامل All-on-4/6. تعرّف على التكلفة ومدة الشفاء.",
      en: "Dental implants in Damascus: immediate, without bone, with grafting, and full-arch All-on-4/6. Learn about cost and recovery time.",
    },
    keywords: keywordClusters.implants,
    faqs: [
      {
        question: {
          ar: "ما تكلفة زراعة الأسنان في سوريا؟",
          en: "What is the cost of dental implants in Syria?",
        },
        answer: {
          ar: "تختلف التكلفة حسب نوع الزرعة والطبيب والحاجة لترقيع عظم. نقدم عرض سعر دقيق بعد الفحص والأشعة.",
          en: "Cost varies by implant brand, surgeon, and need for bone grafting. We provide an accurate quote after examination and imaging.",
        },
      },
      {
        question: {
          ar: "ما الفرق بين All-on-4 وAll-on-6؟",
          en: "What is the difference between All-on-4 and All-on-6?",
        },
        answer: {
          ar: "All-on-4 يستخدم 4 زرعات لدعم فك كامل، بينما All-on-6 يستخدم 6 زرعات لتوزيع أفضل للضغط ومناسب للحالات الأكثر تعقيداً.",
          en: "All-on-4 uses 4 implants to support a full arch, while All-on-6 uses 6 implants for better force distribution and more complex cases.",
        },
      },
    ],
  },

  tmj: {
    path: "services/tmj-treatment",
    schemaType: "MedicalWebPage",
    title: {
      ar: "علاج المفصل الفكي الصدغي في دمشق | دافينشي",
      en: "TMJ Treatment in Damascus | Davinci Dental Clinic",
    },
    description: {
      ar: "تخصص في علاج المفصل الفكي الصدغي، طقطقة الفك، ألم الفك، وانزلاق الغضروف. د. مهند سعودي — خبير USC في آلام الوجه.",
      en: "Specialized TMJ treatment: jaw clicking, jaw pain, and disc displacement. Dr. Mouhannad Saudi — USC-trained orofacial pain expert.",
    },
    keywords: keywordClusters.tmj,
    faqs: [
      {
        question: {
          ar: "ما هي أعراض اضطراب المفصل الفكي الصدغي؟",
          en: "What are the symptoms of TMJ disorder?",
        },
        answer: {
          ar: "طقطقة أو فرقعة عند فتح الفم، ألم في الفك أو الأذن، صداع متكرر، صعوبة في المضغ، وانحراف الفك عند الفتح.",
          en: "Clicking or popping when opening the mouth, jaw or ear pain, recurring headaches, difficulty chewing, and jaw deviation when opening.",
        },
      },
      {
        question: {
          ar: "هل تقويم الأسنان يعالج مشاكل المفصل الفكي؟",
          en: "Does orthodontics treat TMJ problems?",
        },
        answer: {
          ar: "في بعض الحالات نعم، لأن سوء الإطباق قد يساهم في اضطراب المفصل. يتم التقييم من قِبل استشاري TMJ قبل بدء العلاج التقويمي.",
          en: "In some cases yes, as malocclusion can contribute to TMJ disorder. Evaluation by a TMJ specialist is done before starting orthodontic treatment.",
        },
      },
    ],
  },
};

export function buildPageUrl(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+/, "");
  return clean
    ? `${siteConfig.baseUrl}/${locale}/${clean}`
    : `${siteConfig.baseUrl}/${locale}`;
}

export function buildMetadata(pageKey: PageKey, locale: Locale): Metadata {
  const entry = pageSeo[pageKey];
  const canonical = buildPageUrl(locale, entry.path);
  const ogImagePath = entry.ogImage ?? seoDefaults.defaultOgImage;
  const ogImageUrl = `${siteConfig.baseUrl}${ogImagePath}`;

  const alternates = {
    ar: buildPageUrl("ar", entry.path),
    en: buildPageUrl("en", entry.path),
  };

  return {
    title: entry.title[locale],
    description: entry.description[locale],
    keywords: entry.keywords[locale],
    alternates: {
      canonical,
      languages: {
        [siteConfig.hreflang.ar]: alternates.ar,
        [siteConfig.hreflang.en]: alternates.en,
        "x-default": alternates.en,
      },
    },
    openGraph: {
      type: "website",
      title: entry.title[locale],
      description: entry.description[locale],
      url: canonical,
      siteName: siteConfig.siteName[locale],
      locale: siteConfig.ogLocale[locale],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: entry.title[locale],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title[locale],
      description: entry.description[locale],
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "geo.region": geoData.region,
      "geo.placename": geoData.placename[locale],
      "geo.position": geoData.position,
      ICBM: geoData.ICBM,
    },
  };
}

export function buildOrganizationSchema(locale: Locale) {
  const isArabic = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalBusiness", "LocalBusiness"],
    "@id": `${siteConfig.baseUrl}/#organization`,
    name: siteConfig.siteName[locale],
    alternateName: isArabic ? "Davinci Dental Clinic" : "دافينشي لطب الأسنان",
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}${seoDefaults.logoPath}`,
    image: [`${siteConfig.baseUrl}${seoDefaults.defaultOgImage}`],
    telephone: clinicContactData.phone,
    email: clinicContactData.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: geoData.streetAddress[locale],
      addressLocality: geoData.placename[locale],
      addressCountry: geoData.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geoData.latitude,
      longitude: geoData.longitude,
    },
    hasMap: geoData.mapsUrl,
    areaServed: geoData.areaServed[locale].map((name) => ({
      "@type": "Country",
      name,
    })),
    sameAs: [
      clinicContactData.social.facebook,
      clinicContactData.social.instagram,
    ],
    medicalSpecialty: [
      "Orthodontic",
      "OralSurgery",
      "Pediatric",
      "CosmeticDentistry",
      "PainMedicine",
      "Periodontic",
      "Endodontic",
    ],
    availableLanguage: ["ar", "en"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: clinicContactData.call,
        contactType: isArabic ? "خدمة العملاء" : "customer service",
        availableLanguage: ["ar", "en"],
        areaServed: ["SY", "AE"],
      },
    ],
    openingHoursSpecification: geoData.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
  };
}

export function buildWebPageSchema(pageKey: PageKey, locale: Locale) {
  const entry = pageSeo[pageKey];
  const url = buildPageUrl(locale, entry.path);
  const isArabic = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": entry.schemaType ?? "WebPage",
    "@id": `${url}/#webpage`,
    url,
    name: entry.title[locale],
    description: entry.description[locale],
    inLanguage: isArabic ? "ar-SY" : "en-US",
    isPartOf: { "@id": `${siteConfig.baseUrl}/#website` },
    about: { "@id": `${siteConfig.baseUrl}/#organization` },
  };
}

export function buildWebsiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.baseUrl}/#website`,
    url: siteConfig.baseUrl,
    name: siteConfig.siteName[locale],
    inLanguage: locale === "ar" ? "ar-SY" : "en-US",
    publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
  };
}

export function buildBreadcrumbSchema(
  locale: Locale,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: buildPageUrl(locale, item.path),
    })),
  };
}

export function buildFaqSchema(pageKey: PageKey, locale: Locale) {
  const entry = pageSeo[pageKey];
  if (!entry.faqs || entry.faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faqs.map((f) => ({
      "@type": "Question",
      name: f.question[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer[locale],
      },
    })),
  };
}

export function buildPageJsonLd(
  pageKey: PageKey,
  locale: Locale,
  extra: object[] = [],
) {
  const blocks = [
    buildOrganizationSchema(locale),
    buildWebsiteSchema(locale),
    buildWebPageSchema(pageKey, locale),
    buildFaqSchema(pageKey, locale),
    ...extra,
  ].filter(Boolean);
  return blocks;
}