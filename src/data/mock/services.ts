export type Locale = "ar" | "en";

export interface ServiceItem {
  slug: string;
  category: {
    ar: string;
    en: string;
  };
  title: {
    ar: string;
    en: string;
  };
  shortDescription: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  image: string;
  sourceUrl: string;
  highlight: {
    ar: string[];
    en: string[];
  };
}

export const clinicContactData = {
  phone: "+971 2 000 0000",
  email: "info@davincidental.ae",
  address: {
    ar: "أبو ظبي، الإمارات العربية المتحدة",
    en: "Abu Dhabi, United Arab Emirates",
  },
};

export const serviceCatalog: ServiceItem[] = [
  {
    slug: "علاجات-تقويم-الأسنان",
    category: { ar: "تقويم الأسنان", en: "Orthodontics" },
    title: { ar: "علاجات تقويم الأسنان", en: "Orthodontic Treatments" },
    shortDescription: {
      ar: "مرحباً بك في عيادة دافنشي لطب الأسنان، حيث نمنحك ابتسامة جذابة وصحية. نحن متخصصون في رعاية تقويم الأسنان المتقدمة المناسبة للمرضى من جميع الأعمار.",
      en: "Welcome to Davinci Dental Clinic for an attractive and healthy smile. We specialize in advanced orthodontic care for patients of all ages."
    },
    description: {
      ar: "مرحباً بك في عيادة دافنشي لطب الأسنان، حيث نمنحك ابتسامة جذابة وصحية. نحن متخصصون في رعاية تقويم الأسنان المتقدمة المناسبة للمرضى من جميع الأعمار.",
      en: "Welcome to Davinci Dental Clinic for an attractive and healthy smile. We specialize in advanced orthodontic care for patients of all ages."
    },
    image: "https://davincidental.ae/wp-content/uploads/2017/09/Orthodontic2.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d8%b9%d9%84%d8%a7%d8%ac%d8%a7%d8%aa-%d8%aa%d9%82%d9%88%d9%8a%d9%85-%d8%a7%d9%84%d8%a3%d8%b3%d9%86%d8%a7%d9%86/",
    highlight: {
      ar: ["رعاية متقدمة لجميع الأعمار", "استعادة وظيفة ومظهر الأسنان", "خطط علاجية مخصصة"],
      en: ["Advanced care for all ages", "Restore tooth function and appearance", "Customized treatment plans"]
    }
  },
  {
    slug: "تقويم-أسنان-الأطفال",
    category: { ar: "تقويم الأسنان", en: "Orthodontics" },
    title: { ar: "تقويم أسنان الأطفال", en: "Children Orthodontics" },
    shortDescription: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات تقويم أسنان الأطفال لتصحيح نمو الأسنان والفكين مبكرًا بأساليب آمنة ومناسبة للأطفال. احجز موعدك الآن.",
      en: "Davinci Dental Clinic provides early orthodontic correction for children's teeth and jaws safely and comfortably. Book your appointment now."
    },
    description: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات تقويم أسنان الأطفال لتصحيح نمو الأسنان والفكين مبكرًا بأساليب آمنة ومناسبة للأطفال. احجز موعدك الآن.",
      en: "Davinci Dental Clinic provides early orthodontic correction for children's teeth and jaws safely and comfortably. Book your appointment now."
    },
    image: "https://davincidental.ae/wp-content/uploads/2023/06/Children-Orthodontics.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d8%aa%d9%82%d9%88%d9%8a%d9%85-%d8%a3%d8%b3%d9%86%d8%a7%d9%86-%d8%a7%d9%84%d8%a3%d8%b7%d9%81%d8%a7%d9%84/",
    highlight: {
      ar: ["تصحيح مبكر لنمو الفكين", "أساليب آمنة ومناسبة للأطفال", "متابعة دقيقة ومستمرة"],
      en: ["Early jaw growth correction", "Safe methods for kids", "Continuous precise follow-up"]
    }
  },
  {
    slug: "التقويم-الثابت",
    category: { ar: "تقويم الأسنان", en: "Orthodontics" },
    title: { ar: "التقويم الثابت", en: "Fixed Braces" },
    shortDescription: {
      ar: "تقدم عيادة دافنشي لطب الأسنان في أبو ظبي خدمات التقويم الثابت لتصحيح اصطفاف الأسنان وعلاج مشاكل الإطباق بدقة ونتائج فعّالة. احجز موعدك الآن.",
      en: "Fixed braces services to correct teeth alignment and bite issues precisely with effective results."
    },
    description: {
      ar: "تقدم عيادة دافنشي لطب الأسنان في أبو ظبي خدمات التقويم الثابت لتصحيح اصطفاف الأسنان وعلاج مشاكل الإطباق بدقة ونتائج فعّالة. احجز موعدك الآن.",
      en: "Fixed braces services to correct teeth alignment and bite issues precisely with effective results."
    },
    image: "https://davincidental.ae/wp-content/uploads/2023/06/Fixed-Braces.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d8%a7%d9%84%d8%aa%d9%82%d9%88%d9%8a%d9%85-%d8%a7%d9%84%d8%ab%d8%a7%d8%a8%d8%aa/",
    highlight: {
      ar: ["تصحيح دقيق للاصطفاف", "علاج مشاكل الإطباق المعقدة", "نتائج طويلة الأمد"],
      en: ["Precise alignment correction", "Treating complex bite issues", "Long-lasting results"]
    }
  },
  {
    slug: "التقويم-الشفاف-إنفزلاين",
    category: { ar: "تقويم الأسنان", en: "Orthodontics" },
    title: { ar: "التقويم الشفاف: إنفزلاين®", en: "Invisible Braces: Invisalign®" },
    shortDescription: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي التقويم الشفاف إنفزلاين® لتصحيح الأسنان بشكل غير ملحوظ مع راحة عالية ونتائج دقيقة. احجز موعدك الآن.",
      en: "Invisible Invisalign® braces for discreet teeth straightening with high comfort and accurate results."
    },
    description: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي التقويم الشفاف إنفزلاين® لتصحيح الأسنان بشكل غير ملحوظ مع راحة عالية ونتائج دقيقة. احجز موعدك الآن.",
      en: "Invisible Invisalign® braces for discreet teeth straightening with high comfort and accurate results."
    },
    image: "https://davincidental.ae/wp-content/uploads/2023/06/Invisible-Braces.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d8%a7%d9%84%d8%aa%d9%82%d9%88%d9%8a%d9%85-%d8%a7%d9%84%d8%b4%d9%81%d8%a7%d9%81-%d8%a5%d9%86%d9%81%d8%b2%d9%84%d8%a7%d9%8a%d9%86/",
    highlight: {
      ar: ["تصميم شفاف وغير ملحوظ", "قابل للإزالة بسهولة لراحة الأكل والتنظيف", "تقنية رقمية متقدمة"],
      en: ["Clear and discreet design", "Removable for easy eating and cleaning", "Advanced digital technology"]
    }
  },
  {
    slug: "حالات-الطوارئ-التقويمية",
    category: { ar: "تقويم الأسنان", en: "Orthodontics" },
    title: { ar: "حالات الطوارئ التقويمية", en: "Orthodontic Emergencies" },
    shortDescription: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات حالات الطوارئ التقويمية للتعامل السريع مع مشاكل التقويم وتخفيف الألم بأمان واحترافية. تواصل معنا فورًا.",
      en: "Quick handling of orthodontic issues and pain relief safely and professionally."
    },
    description: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات حالات الطوارئ التقويمية للتعامل السريع مع مشاكل التقويم وتخفيف الألم بأمان واحترافية. تواصل معنا فورًا.",
      en: "Quick handling of orthodontic issues and pain relief safely and professionally."
    },
    image: "https://davincidental.ae/wp-content/uploads/2023/06/Orthodontic-Emergencies.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d8%ad%d8%a7%d9%84%d8%a7%d8%aa-%d8%a7%d9%84%d8%b7%d9%88%d8%a7%d8%b1%d8%a6-%d8%a7%d9%84%d8%aa%d9%82%d9%88%d9%8a%d9%85%d9%8a%d8%a9/",
    highlight: {
      ar: ["استجابة سريعة للحالات الطارئة", "تخفيف الآلام الناتجة عن الأسلاك أو الأقواس", "رعاية احترافية وآمنة"],
      en: ["Quick response to emergencies", "Pain relief from wires or brackets", "Professional and safe care"]
    }
  },
  {
    slug: "اضطراب-tmj",
    category: { ar: "العلاج الطبي", en: "Medical Treatment" },
    title: { ar: "اضطراب TMJ", en: "TMJ Disorder" },
    shortDescription: {
      ar: "نقدم رعاية خبيرة لاضطراب المفصل الصدغي الصدغي (TMJ) في عيادة دافنشي لطب الأسنان مع تقييمات شاملة وخطط علاجية مخصصة لاحتياجاتك.",
      en: "Experience expert care for TMJ disorder at Davinci Dental Clinic. Our team provides comprehensive evaluations and personalized treatment plans."
    },
    description: {
      ar: "نقدم رعاية خبيرة لاضطراب المفصل الصدغي الصدغي (TMJ) في عيادة دافنشي لطب الأسنان مع تقييمات شاملة وخطط علاجية مخصصة لاحتياجاتك.",
      en: "Experience expert care for TMJ disorder at Davinci Dental Clinic. Our team provides comprehensive evaluations and personalized treatment plans."
    },
    image: "https://davincidental.ae/wp-content/uploads/2024/12/TMJ-Disorder.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d8%a7%d8%b6%d8%b7%d8%b1%d8%a7%d8%a8-tmj/",
    highlight: {
      ar: ["تقييم شامل للمفصل", "تخفيف آلام الفك والصداع المرتبط به", "حلول مخصصة للراحة"],
      en: ["Comprehensive joint evaluation", "Relief from jaw pain and headaches", "Customized comfort solutions"]
    }
  },
  {
    slug: "قشور-الأسنان",
    category: { ar: "التجميل السني", en: "Aesthetic Dentistry" },
    title: { ar: "قشور الأسنان", en: "Dental Veneers" },
    shortDescription: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات قشور الأسنان (الفينير) لتحسين شكل ولون الأسنان والحصول على ابتسامة طبيعية ومتناسقة.",
      en: "Dental veneers (porcelain/composite) to improve tooth shape and color for a natural, harmonious smile."
    },
    description: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات قشور الأسنان (الفينير) لتحسين شكل ولون الأسنان والحصول على ابتسامة طبيعية ومتناسقة.",
      en: "Dental veneers (porcelain/composite) to improve tooth shape and color for a natural, harmonious smile."
    },
    image: "https://davincidental.ae/wp-content/uploads/2017/09/Dental-Veneers.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d9%82%d8%b4%d9%88%d8%b1-%d8%a7%d9%84%d8%a3%d8%b3%d9%86%d8%a7%d9%86/",
    highlight: {
      ar: ["مظهر طبيعي وجذاب", "مقاومة عالية للبقع والتلون", "إخفاء العيوب والتشققات البسيطة"],
      en: ["Natural and attractive look", "High resistance to stains", "Hiding minor chips and flaws"]
    }
  },
  {
    slug: "تبييض-الأسنان-وتفتيحها",
    category: { ar: "التجميل السني", en: "Aesthetic Dentistry" },
    title: { ar: "تبييض الأسنان وتفتيحها", en: "Teeth Whitening & Bleaching" },
    shortDescription: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات تبييض الأسنان وتفتيحها بأحدث التقنيات للحصول على ابتسامة أكثر إشراقًا بأمان ونتائج فعّالة.",
      en: "Teeth whitening and bleaching services using modern techniques for a brighter, safe smile."
    },
    description: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات تبييض الأسنان وتفتيحها بأحدث التقنيات للحصول على ابتسامة أكثر إشراقًا بأمان ونتائج فعّالة.",
      en: "Teeth whitening and bleaching services using modern techniques for a brighter, safe smile."
    },
    image: "https://davincidental.ae/wp-content/uploads/2017/09/Teeth-Whitening-Bleaching.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d8%aa%d8%a8%d9%8a%d9%8a%d8%b6-%d8%a7%d9%84%d8%a3%d8%b3%d9%86%d8%a7%d9%86-%d9%88%d8%aa%d9%81%d8%aa%d9%8a%d8%ad%d9%87%d8%a7/",
    highlight: {
      ar: ["نتائج فورية ومرئية", "تقنيات آمنة لا تضر المينا", "إزالة التصبغات الصعبة"],
      en: ["Immediate and visible results", "Safe techniques preserving enamel", "Removal of stubborn stains"]
    }
  },
  {
    slug: "ابتسامة-هوليود",
    category: { ar: "التجميل السني", en: "Aesthetic Dentistry" },
    title: { ar: "ابتسامة هوليود", en: "Hollywood Smile" },
    shortDescription: {
      ar: "احصل على ابتسامة هوليود في عيادة دافنشي لطب الأسنان في أبو ظبي باستخدام أحدث تقنيات التجميل للحصول على ابتسامة مشرقة وطبيعية تناسبك.",
      en: "Get a Hollywood Smile at Davinci Dental Clinic using state-of-the-art aesthetic tech for a radiant look."
    },
    description: {
      ar: "احصل على ابتسامة هوليود في عيادة دافنشي لطب الأسنان في أبو ظبي باستخدام أحدث تقنيات التجميل للحصول على ابتسامة مشرقة وطبيعية تناسبك.",
      en: "Get a Hollywood Smile at Davinci Dental Clinic using state-of-the-art aesthetic tech for a radiant look."
    },
    image: "https://davincidental.ae/wp-content/uploads/2017/09/Hollywood-Smile2.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d8%a7%d8%a8%d8%aa%d8%b3%d8%a7%d9%85%d8%a9-%d9%87%d9%88%d9%84%d9%8a%d9%88%d8%af/",
    highlight: {
      ar: ["تصميم ابتسامة متناسق بالكامل", "مواد عالية الجودة ومتينة", "تعزيز الثقة بالنفس بشكل كامل"],
      en: ["Fully coordinated smile design", "High quality and durable materials", "Complete self-confidence boost"]
    }
  },
  {
    slug: "زراعة-الأسنان",
    category: { ar: "جراحة الفم والأسنان", en: "Oral Surgery" },
    title: { ar: "جراحة زراعة الأسنان", en: "Dental Implant Surgery" },
    shortDescription: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات جراحة زراعة الأسنان باستخدام تقنيات متقدمة لتعويض الأسنان المفقودة واستعادة الابتسامة بثبات وأمان.",
      en: "Dental implant surgery to replace missing teeth and restore your smile securely and safely."
    },
    description: {
      ar: "توفر عيادة دافنشي لطب الأسنان في أبو ظبي خدمات جراحة زراعة الأسنان باستخدام تقنيات متقدمة لتعويض الأسنان المفقودة واستعادة الابتسامة بثبات وأمان.",
      en: "Dental implant surgery to replace missing teeth and restore your smile securely and safely."
    },
    image: "https://davincidental.ae/wp-content/uploads/2017/09/Dental-Implant-Surgery.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/%d8%ac%d8%b1%d8%a7%d8%ad%d8%a9-%d8%b2%d8%b1%d8%a7%d8%b9%d8%a9-%d8%a7%d9%84%d8%a3%d8%b3%d9%86%d8%a7%d9%86/",
    highlight: {
      ar: ["تعويض دائم وثابت للأسنان المفقودة", "مظهر ووظيفة تشبه الأسنان الطبيعية", "تقنيات جراحية متقدمة وآمنة"],
      en: ["Permanent and secure replacement", "Looks and functions like natural teeth", "Advanced and safe surgical tech"]
    }
  }
];

export function getServiceBySlug(locale: Locale, slug: string) {
  const service = serviceCatalog.find((s) => s.slug === slug);
  if (!service) return undefined;

  return {
    ...service,
    title: service.title[locale],
    category: service.category[locale],
    shortDescription: service.shortDescription[locale],
    description: service.description[locale],
    highlight: service.highlight[locale],
  };
}

export function getPageContent(locale: Locale) {
  return {
    hero: {
      badge: locale === "ar" ? "رعاية متقدمة في أبو ظبي" : "Advanced Care in Abu Dhabi",
      title: locale === "ar" ? "ابتسامة صحية وواثقة تبدأ من هنا" : "A Healthy, Confident Smile Starts Here",
      description:
        locale === "ar"
          ? "نقدم أحدث تقنيات طب الأسنان وتقويم الأسنان لضمان راحتك وصحة أسنانك بأعلى معايير الجودة."
          : "We offer state-of-the-art dental and orthodontic technologies to ensure your comfort and oral health.",
    },
  };
}