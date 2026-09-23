import servicesRichRaw from "./services-rich.json";
import type { RichMap, RichLang } from "./services-rich.types";
import { homeTestimonials } from "./testimonials";
import { homeFAQ } from "./faq";
import { doctorCatalog } from "./doctors";
import { clinicContactData } from "../site";

// ─── Re-exports للتوافق مع الملفات التي ما زالت تستورد من services.ts ───
export { siteConfig, clinicContactData, getAlternateUrl } from "../site";
export { patientTestimonials } from "./testimonials";
export { faqCatalog } from "./faq";
export type { Testimonial, PatientTestimonial } from "./testimonials";
export type { BilingualFAQItem, LocalizedFAQItem } from "./faq";

export type Locale = "ar" | "en";

// ─── Service Types ───
export interface ServiceItem {
  slug: string;
  category: { ar: string; en: string };
  title: { ar: string; en: string };
  shortDescription: { ar: string; en: string };
  description: { ar: string; en: string };
  image: string;
  sourceUrl: string;
  sourceUrlEn: string;
  highlight: { ar: string[]; en: string[] };
}

const servicesRich = servicesRichRaw as RichMap;

const C = {
  ortho: { ar: "تقويم الأسنان", en: "Orthodontics" },
  medical: { ar: "العلاج الطبي", en: "Medical Treatment" },
  aesthetic: { ar: "التجميل السني", en: "Aesthetic Dentistry" },
  pediatric: { ar: "طب أسنان الأطفال", en: "Pediatric Dentistry" },
  surgery: { ar: "جراحة الفم والأسنان", en: "Oral Surgery" },
  maxillo: { ar: "جراحة الوجه والفكين", en: "Maxillofacial Surgery" },
  endo: { ar: "علاج الجذور", en: "Endodontics" },
  restorative: { ar: "ترميم الأسنان", en: "Restorative Dentistry" },
  emergency: { ar: "طوارئ الأسنان", en: "Dental Emergency" },
  preventive: { ar: "طب الأسنان الوقائي", en: "Preventive Dentistry" },
  perio: { ar: "علاج اللثة", en: "Periodontics" },
  special: { ar: "برامج خاصة", en: "Special Programs" },
};

export const serviceCatalog: ServiceItem[] = [
  // ============ تقويم الأسنان ============
  {
    slug: "علاجات-تقويم-الأسنان",
    category: C.ortho,
    title: { ar: "علاجات تقويم الأسنان", en: "Orthodontic Treatments" },
    shortDescription: {
      ar: "مرحباً بك في عيادة سعودي لطب الأسنان، حيث نمنحك ابتسامة جذابة وصحية. نحن متخصصون في رعاية تقويم الأسنان المتقدمة المناسبة للمرضى من جميع الأعمار.",
      en: "Welcome to Saudi Dental Clinic for an attractive and healthy smile. We specialize in advanced orthodontic care for patients of all ages.",
    },
    description: {
      ar: "مرحباً بك في عيادة سعودي لطب الأسنان، حيث نمنحك ابتسامة جذابة وصحية. نحن متخصصون في رعاية تقويم الأسنان المتقدمة المناسبة للمرضى من جميع الأعمار.",
      en: "Welcome to Saudi Dental Clinic for an attractive and healthy smile. We specialize in advanced orthodontic care for patients of all ages.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2017/09/Orthodontic2.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/علاجات-تقويم-الأسنان/",
    sourceUrlEn: "https://davincidental.ae/services/orthodontics/",
    highlight: {
      ar: [
        "رعاية متقدمة لجميع الأعمار",
        "استعادة وظيفة ومظهر الأسنان",
        "خطط علاجية مخصصة",
      ],
      en: [
        "Advanced care for all ages",
        "Restore tooth function and appearance",
        "Customized treatment plans",
      ],
    },
  },
  {
    slug: "تقويم-أسنان-الأطفال",
    category: C.ortho,
    title: { ar: "تقويم أسنان الأطفال", en: "Children Orthodontics" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات تقويم أسنان الأطفال لتصحيح نمو الأسنان والفكين مبكرًا بأساليب آمنة ومناسبة للأطفال. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus provides early orthodontic correction for children's teeth and jaws safely and comfortably. Book your appointment now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات تقويم أسنان الأطفال لتصحيح نمو الأسنان والفكين مبكرًا بأساليب آمنة ومناسبة للأطفال. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus provides early orthodontic correction for children's teeth and jaws safely and comfortably. Book your appointment now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Children-Orthodontics.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/تقويم-أسنان-الأطفال/",
    sourceUrlEn: "https://davincidental.ae/services/children-orthodontics/",
    highlight: {
      ar: [
        "تصحيح مبكر لنمو الفكين",
        "أساليب آمنة ومناسبة للأطفال",
        "متابعة دقيقة ومستمرة",
      ],
      en: [
        "Early jaw growth correction",
        "Safe methods for kids",
        "Continuous precise follow-up",
      ],
    },
  },
  {
    slug: "التقويم-الثابت",
    category: C.ortho,
    title: { ar: "التقويم الثابت", en: "Fixed Braces" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات التقويم الثابت لتصحيح اصطفاف الأسنان وعلاج مشاكل الإطباق بدقة ونتائج فعّالة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers fixed braces to correct teeth alignment and treat bite issues precisely with effective results. Book your appointment now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات التقويم الثابت لتصحيح اصطفاف الأسنان وعلاج مشاكل الإطباق بدقة ونتائج فعّالة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers fixed braces to correct teeth alignment and treat bite issues precisely with effective results. Book your appointment now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Fixed-Braces.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/التقويم-الثابت/",
    sourceUrlEn: "https://davincidental.ae/services/fixed-braces/",
    highlight: {
      ar: [
        "تصحيح دقيق للاصطفاف",
        "علاج مشاكل الإطباق المعقدة",
        "نتائج طويلة الأمد",
      ],
      en: [
        "Precise alignment correction",
        "Treating complex bite issues",
        "Long-lasting results",
      ],
    },
  },
  {
    slug: "التقويم-الشفاف-إنفزلاين",
    category: C.ortho,
    title: {
      ar: "التقويم الشفاف: إنفزلاين®",
      en: "Invisible Braces: Invisalign®",
    },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق التقويم الشفاف إنفزلاين® لتصحيح الأسنان بشكل غير ملحوظ مع راحة عالية ونتائج دقيقة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers Invisalign® clear aligners for discreet teeth straightening with high comfort and accurate results. Book your appointment now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق التقويم الشفاف إنفزلاين® لتصحيح الأسنان بشكل غير ملحوظ مع راحة عالية ونتائج دقيقة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers Invisalign® clear aligners for discreet teeth straightening with high comfort and accurate results. Book your appointment now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Invisible-Braces.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/التقويم-الشفاف-إنفزلاين/",
    sourceUrlEn:
      "https://davincidental.ae/services/invisible-braces-invisalign/",
    highlight: {
      ar: [
        "تصميم شفاف وغير ملحوظ",
        "قابل للإزالة بسهولة لراحة الأكل والتنظيف",
        "تقنية رقمية متقدمة",
      ],
      en: [
        "Clear and discreet design",
        "Removable for easy eating and cleaning",
        "Advanced digital technology",
      ],
    },
  },
  {
    slug: "حالات-الطوارئ-التقويمية",
    category: C.ortho,
    title: { ar: "حالات الطوارئ التقويمية", en: "Orthodontic Emergencies" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات حالات الطوارئ التقويمية للتعامل السريع مع مشاكل التقويم وتخفيف الألم بأمان واحترافية. تواصل معنا فورًا.",
      en: "Saudi Dental Clinic in Damascus provides orthodontic emergency services for quick handling of braces issues and pain relief safely and professionally. Contact us now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات حالات الطوارئ التقويمية للتعامل السريع مع مشاكل التقويم وتخفيف الألم بأمان واحترافية. تواصل معنا فورًا.",
      en: "Saudi Dental Clinic in Damascus provides orthodontic emergency services for quick handling of braces issues and pain relief safely and professionally. Contact us now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Orthodontic-Emergencies.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/حالات-الطوارئ-التقويمية/",
    sourceUrlEn: "https://davincidental.ae/services/orthodontic-emergencies/",
    highlight: {
      ar: [
        "استجابة سريعة للحالات الطارئة",
        "تخفيف الآلام الناتجة عن الأسلاك أو الأقواس",
        "رعاية احترافية وآمنة",
      ],
      en: [
        "Quick response to emergencies",
        "Pain relief from wires or brackets",
        "Professional and safe care",
      ],
    },
  },

  // ============ العلاج الطبي ============
  {
    slug: "اضطراب-tmj",
    category: C.medical,
    title: { ar: "اضطراب TMJ", en: "TMJ Disorder" },
    shortDescription: {
      ar: "نقدم رعاية خبيرة لاضطراب المفصل الصدغي الفكي (TMJ) في عيادة سعودي لطب الأسنان مع تقييمات شاملة وخطط علاجية مخصصة لاحتياجاتك.",
      en: "Experience expert care for TMJ disorder at Saudi Dental Clinic. Our team provides comprehensive evaluations and personalized treatment plans tailored to your needs.",
    },
    description: {
      ar: "نقدم رعاية خبيرة لاضطراب المفصل الصدغي الفكي (TMJ) في عيادة سعودي لطب الأسنان مع تقييمات شاملة وخطط علاجية مخصصة لاحتياجاتك.",
      en: "Experience expert care for TMJ disorder at Saudi Dental Clinic. Our team provides comprehensive evaluations and personalized treatment plans tailored to your needs.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2024/12/TMJ-Disorder.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/اضطراب-tmj/",
    sourceUrlEn: "https://davincidental.ae/services/tmj-disorder/",
    highlight: {
      ar: [
        "تقييم شامل للمفصل",
        "تخفيف آلام الفك والصداع المرتبط به",
        "حلول مخصصة للراحة",
      ],
      en: [
        "Comprehensive joint evaluation",
        "Relief from jaw pain and headaches",
        "Customized comfort solutions",
      ],
    },
  },

  // ============ التجميل السني ============
  {
    slug: "علاج-التجميل-السني",
    category: C.aesthetic,
    title: { ar: "علاج التجميل السني", en: "Cosmetic Dentistry" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات علاج الأسنان التجميلي لتحسين مظهر الأسنان والابتسامة باستخدام أحدث التقنيات ونتائج طبيعية. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers cosmetic dentistry services to enhance the appearance of your teeth and smile using the latest techniques with natural results. Book now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات علاج الأسنان التجميلي لتحسين مظهر الأسنان والابتسامة باستخدام أحدث التقنيات ونتائج طبيعية. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers cosmetic dentistry services to enhance the appearance of your teeth and smile using the latest techniques with natural results. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Aesthetic-Treatment.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/علاج-الأسنان-التجميلي/",
    sourceUrlEn: "https://davincidental.ae/services/aesthetic-treatment/",
    highlight: {
      ar: [
        "تحسين مظهر الأسنان والابتسامة",
        "تقنيات حديثة ونتائج طبيعية",
        "خطة علاجية مخصصة لكل حالة",
      ],
      en: [
        "Improved teeth and smile appearance",
        "Modern techniques with natural results",
        "Customized treatment plan per case",
      ],
    },
  },
  {
    slug: "الاستشارة-التجميلية",
    category: C.aesthetic,
    title: { ar: "الاستشارة التجميلية", en: "Aesthetic Consultation" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق الاستشارة التجميلية لتقييم ابتسامتك ووضع خطة علاج مخصصة باستخدام أحدث تقنيات تجميل الأسنان. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers aesthetic consultations to evaluate your smile and create a personalized treatment plan using the latest cosmetic dental techniques. Book now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق الاستشارة التجميلية لتقييم ابتسامتك ووضع خطة علاج مخصصة باستخدام أحدث تقنيات تجميل الأسنان. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers aesthetic consultations to evaluate your smile and create a personalized treatment plan using the latest cosmetic dental techniques. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Aesthetic-Consultation.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/الاستشارة-التجميلية/",
    sourceUrlEn: "https://davincidental.ae/services/aesthetic-consultation/",
    highlight: {
      ar: [
        "تقييم شامل للابتسامة",
        "خطة علاجية مخصصة",
        "استخدام أحدث تقنيات التجميل",
      ],
      en: [
        "Comprehensive smile evaluation",
        "Personalized treatment plan",
        "Latest aesthetic technologies",
      ],
    },
  },
  {
    slug: "قشور-الأسنان",
    category: C.aesthetic,
    title: { ar: "قشور الأسنان", en: "Dental Veneers" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات قشور الأسنان (الفينير) لتحسين شكل ولون الأسنان والحصول على ابتسامة طبيعية ومتناسقة.",
      en: "Saudi Dental Clinic in Damascus offers dental veneers to improve tooth shape and color for a natural, harmonious smile.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات قشور الأسنان (الفينير) لتحسين شكل ولون الأسنان والحصول على ابتسامة طبيعية ومتناسقة.",
      en: "Saudi Dental Clinic in Damascus offers dental veneers to improve tooth shape and color for a natural, harmonious smile.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2017/09/Dental-Veneers.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/قشور-الأسنان/",
    sourceUrlEn:
      "https://davincidental.ae/services/veneer-lumineers-zircon-smile-make-over/",
    highlight: {
      ar: [
        "مظهر طبيعي وجذاب",
        "مقاومة عالية للبقع والتلون",
        "إخفاء العيوب والتشققات البسيطة",
      ],
      en: [
        "Natural and attractive look",
        "High resistance to stains",
        "Hiding minor chips and flaws",
      ],
    },
  },
  {
    slug: "تبييض-الأسنان-وتفتيحها",
    category: C.aesthetic,
    title: { ar: "تبييض الأسنان وتفتيحها", en: "Teeth Whitening & Bleaching" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات تبييض الأسنان وتفتيحها بأحدث التقنيات للحصول على ابتسامة أكثر إشراقًا بأمان ونتائج فعّالة.",
      en: "Saudi Dental Clinic in Damascus offers teeth whitening and bleaching using the latest techniques for a brighter, safe and effective smile.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات تبييض الأسنان وتفتيحها بأحدث التقنيات للحصول على ابتسامة أكثر إشراقًا بأمان ونتائج فعّالة.",
      en: "Saudi Dental Clinic in Damascus offers teeth whitening and bleaching using the latest techniques for a brighter, safe and effective smile.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2017/09/Teeth-Whitening-Bleaching.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/تبييض-الأسنان-وتفتيحها/",
    sourceUrlEn: "https://davincidental.ae/services/teeth-whitening/",
    highlight: {
      ar: [
        "نتائج فورية ومرئية",
        "تقنيات آمنة لا تضر المينا",
        "إزالة التصبغات الصعبة",
      ],
      en: [
        "Immediate and visible results",
        "Safe techniques preserving enamel",
        "Removal of stubborn stains",
      ],
    },
  },
  {
    slug: "ابتسامة-هوليود",
    category: C.aesthetic,
    title: { ar: "ابتسامة هوليود", en: "Hollywood Smile" },
    shortDescription: {
      ar: "احصل على ابتسامة هوليود في عيادة سعودي لطب الأسنان في دمشق باستخدام أحدث تقنيات التجميل للحصول على ابتسامة مشرقة وطبيعية تناسبك.",
      en: "Get a Hollywood Smile at Saudi Dental Clinic in Damascus using state-of-the-art aesthetic technology for a radiant, natural look that suits you.",
    },
    description: {
      ar: "احصل على ابتسامة هوليود في عيادة سعودي لطب الأسنان في دمشق باستخدام أحدث تقنيات التجميل للحصول على ابتسامة مشرقة وطبيعية تناسبك.",
      en: "Get a Hollywood Smile at Saudi Dental Clinic in Damascus using state-of-the-art aesthetic technology for a radiant, natural look that suits you.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2017/09/Hollywood-Smile2.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/ابتسامة-هوليود/",
    sourceUrlEn: "https://davincidental.ae/services/hollywood-smile/",
    highlight: {
      ar: [
        "تصميم ابتسامة متناسق بالكامل",
        "مواد عالية الجودة ومتينة",
        "تعزيز الثقة بالنفس بشكل كامل",
      ],
      en: [
        "Fully coordinated smile design",
        "High quality and durable materials",
        "Complete self-confidence boost",
      ],
    },
  },

  // ============ طب أسنان الأطفال ============
  {
    slug: "طب-أسنان-الأطفال",
    category: C.pediatric,
    title: { ar: "طب أسنان الأطفال", en: "Pediatric Dentistry" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات متخصصة في طب أسنان الأطفال ضمن بيئة مريحة وآمنة، مع عناية لطيفة تناسب جميع الأعمار. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers specialized pediatric dentistry in a comfortable and safe environment, with gentle care suitable for all ages. Book now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات متخصصة في طب أسنان الأطفال ضمن بيئة مريحة وآمنة، مع عناية لطيفة تناسب جميع الأعمار. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers specialized pediatric dentistry in a comfortable and safe environment, with gentle care suitable for all ages. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2017/09/Pediatric-Dentistry2.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/طب-أسنان-الأطفال/",
    sourceUrlEn: "https://davincidental.ae/services/pediatric-dentistry/",
    highlight: {
      ar: [
        "بيئة مريحة وآمنة للأطفال",
        "عناية لطيفة تناسب جميع الأعمار",
        "أطباء متخصصون في طب أسنان الأطفال",
      ],
      en: [
        "Comfortable, safe environment for kids",
        "Gentle care for all ages",
        "Specialists in pediatric dentistry",
      ],
    },
  },

  // ============ جراحة الفم والأسنان ============
  {
    slug: "جراحة-الفم-والأسنان",
    category: C.surgery,
    title: { ar: "جراحة الفم والأسنان", en: "Oral Surgery" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات جراحة الفم والأسنان باستخدام تقنيات متقدمة لعلاج الحالات المعقدة بدقة وأمان. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers oral surgery services using advanced techniques to treat complex cases with precision and safety. Book your appointment now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات جراحة الفم والأسنان باستخدام تقنيات متقدمة لعلاج الحالات المعقدة بدقة وأمان. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers oral surgery services using advanced techniques to treat complex cases with precision and safety. Book your appointment now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Oral-Surgical-Procedure.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/جراحة-الفم-والأسنان/",
    sourceUrlEn: "https://davincidental.ae/services/oral-surgical-procedure/",
    highlight: {
      ar: [
        "تقنيات جراحية متقدمة",
        "علاج الحالات المعقدة بدقة",
        "أمان ورعاية عالية",
      ],
      en: [
        "Advanced surgical techniques",
        "Precise complex case treatment",
        "High safety and care",
      ],
    },
  },
  {
    slug: "جراحة-زراعة-الأسنان",
    category: C.surgery,
    title: { ar: "جراحة زراعة الأسنان", en: "Dental Implant Surgery" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات جراحة زراعة الأسنان باستخدام تقنيات متقدمة لتعويض الأسنان المفقودة واستعادة الابتسامة بثبات وأمان.",
      en: "Saudi Dental Clinic in Damascus offers dental implant surgery using advanced techniques to replace missing teeth and restore your smile securely and safely.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات جراحة زراعة الأسنان باستخدام تقنيات متقدمة لتعويض الأسنان المفقودة واستعادة الابتسامة بثبات وأمان.",
      en: "Saudi Dental Clinic in Damascus offers dental implant surgery using advanced techniques to replace missing teeth and restore your smile securely and safely.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2017/09/Dental-Implant-Surgery.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/جراحة-زراعة-الأسنان/",
    sourceUrlEn: "https://davincidental.ae/services/dental-implants/",
    highlight: {
      ar: [
        "تعويض دائم وثابت للأسنان المفقودة",
        "مظهر ووظيفة تشبه الأسنان الطبيعية",
        "تقنيات جراحية متقدمة وآمنة",
      ],
      en: [
        "Permanent and secure replacement",
        "Looks and functions like natural teeth",
        "Advanced and safe surgical tech",
      ],
    },
  },
  {
    slug: "جراحة-الفم-والوجه-والفكين",
    category: C.maxillo,
    title: { ar: "جراحة الفم والوجه والفكين", en: "Maxillofacial Surgery" },
    shortDescription: {
      ar: "في عيادة سعودي لطب الأسنان نقدم خدمات شاملة لجراحة الفم والوجه والفكين لمعالجة الحالات المعقدة واستعادة الوظيفة وتحسين المظهر.",
      en: "At Saudi Dental Clinic, we offer comprehensive maxillofacial surgery services to address complex oral and facial conditions, restoring function and enhancing aesthetics.",
    },
    description: {
      ar: "في عيادة سعودي لطب الأسنان نقدم خدمات شاملة لجراحة الفم والوجه والفكين لمعالجة الحالات المعقدة واستعادة الوظيفة وتحسين المظهر.",
      en: "At Saudi Dental Clinic, we offer comprehensive maxillofacial surgery services to address complex oral and facial conditions, restoring function and enhancing aesthetics.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Maxillofacial-surgery-1000-600.jpg",
    sourceUrl:
      "https://davincidental.ae/ar/services/جراحة-الفم-والوجه-والفكين/",
    sourceUrlEn: "https://davincidental.ae/services/maxillofacial-surgery/",
    highlight: {
      ar: [
        "علاج الحالات المعقدة للفم والوجه",
        "استعادة الوظيفة والمظهر",
        "فريق جراحي متخصص",
      ],
      en: [
        "Treatment of complex oral/facial cases",
        "Restoring function and aesthetics",
        "Specialized surgical team",
      ],
    },
  },
  {
    slug: "خلع-الأسنان",
    category: C.surgery,
    title: { ar: "خلع الأسنان", en: "Tooth Extraction" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات خلع الأسنان بأحدث التقنيات وبدون ألم قدر الإمكان، مع رعاية طبية آمنة وسريعة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers tooth extraction with the latest techniques and minimal pain, providing safe and quick medical care. Book your appointment now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات خلع الأسنان بأحدث التقنيات وبدون ألم قدر الإمكان، مع رعاية طبية آمنة وسريعة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers tooth extraction with the latest techniques and minimal pain, providing safe and quick medical care. Book your appointment now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/05/Tooth-Extraction-1.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/خلع-الأسنان/",
    sourceUrlEn: "https://davincidental.ae/services/tooth-extraction/",
    highlight: {
      ar: [
        "خلع بدون ألم قدر الإمكان",
        "تقنيات حديثة وآمنة",
        "تعافٍ سريع ومتابعة",
      ],
      en: [
        "Minimally painful extraction",
        "Modern and safe techniques",
        "Fast recovery and follow-up",
      ],
    },
  },

  // ============ علاج الجذور ============
  {
    slug: "علاج-جذور-الأسنان",
    category: C.endo,
    title: { ar: "علاج جذور الأسنان", en: "Root Canal Treatment" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات علاج جذور الأسنان باستخدام تقنيات دقيقة لتخفيف الألم والحفاظ على الأسنان الطبيعية. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers root canal treatment using precise techniques to relieve pain and preserve natural teeth. Book your appointment now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات علاج جذور الأسنان باستخدام تقنيات دقيقة لتخفيف الألم والحفاظ على الأسنان الطبيعية. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers root canal treatment using precise techniques to relieve pain and preserve natural teeth. Book your appointment now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/05/Root-Canal-Treatment-1.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/علاج-جذور-الأسنان/",
    sourceUrlEn: "https://davincidental.ae/services/root-canal/",
    highlight: {
      ar: [
        "تخفيف الألم بسرعة",
        "الحفاظ على الأسنان الطبيعية",
        "تقنيات دقيقة وحديثة",
      ],
      en: [
        "Fast pain relief",
        "Preserving natural teeth",
        "Precise, modern techniques",
      ],
    },
  },

  // ============ ترميم الأسنان ============
  {
    slug: "ترميم-الأسنان",
    category: C.restorative,
    title: { ar: "ترميم الأسنان", en: "Tooth Restoration" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات ترميم الأسنان لإصلاح التلف واستعادة الوظيفة والمظهر الطبيعي باستخدام تقنيات ومواد حديثة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers tooth restoration to repair damage and restore function and natural appearance using modern techniques and materials. Book now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات ترميم الأسنان لإصلاح التلف واستعادة الوظيفة والمظهر الطبيعي باستخدام تقنيات ومواد حديثة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers tooth restoration to repair damage and restore function and natural appearance using modern techniques and materials. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Dental-Tooth-Restoration-1.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/ترميم-الأسنان/",
    sourceUrlEn: "https://davincidental.ae/services/dental-tooth-restoration/",
    highlight: {
      ar: [
        "إصلاح التلف واستعادة الوظيفة",
        "مواد حديثة وعالية الجودة",
        "مظهر طبيعي متكامل",
      ],
      en: [
        "Repair damage and restore function",
        "Modern, high-quality materials",
        "Fully natural appearance",
      ],
    },
  },
  {
    slug: "حشوات-الأسنان-المركبة",
    category: C.restorative,
    title: { ar: "حشوات الأسنان المركبة", en: "Composite Dental Fillings" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق حشوات الأسنان المركبة بلون طبيعي ومواد عالية الجودة لاستعادة وظيفة الأسنان ومظهرها الجمالي. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers composite dental fillings with natural color and high-quality materials to restore tooth function and aesthetics. Book now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق حشوات الأسنان المركبة بلون طبيعي ومواد عالية الجودة لاستعادة وظيفة الأسنان ومظهرها الجمالي. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers composite dental fillings with natural color and high-quality materials to restore tooth function and aesthetics. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Composite-Dental-Fillings.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/حشوات-الأسنان-المركبة/",
    sourceUrlEn: "https://davincidental.ae/services/composite-dental-fillings/",
    highlight: {
      ar: [
        "لون طبيعي يطابق الأسنان",
        "مواد عالية الجودة",
        "استعادة الوظيفة والمظهر الجمالي",
      ],
      en: [
        "Natural color matching teeth",
        "High-quality materials",
        "Restores function and aesthetics",
      ],
    },
  },
  {
    slug: "تيجان-الأسنان",
    category: C.restorative,
    title: { ar: "تيجان الأسنان", en: "Dental Crowns" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات تيجان الأسنان باستخدام مواد عالية الجودة لاستعادة قوة الأسنان ومظهرها الطبيعي بدقة واحترافية. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers dental crowns using high-quality materials to restore tooth strength and natural appearance with precision. Book now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات تيجان الأسنان باستخدام مواد عالية الجودة لاستعادة قوة الأسنان ومظهرها الطبيعي بدقة واحترافية. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers dental crowns using high-quality materials to restore tooth strength and natural appearance with precision. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/05/Dental-Crowns.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/تيجان-الأسنان/",
    sourceUrlEn: "https://davincidental.ae/services/dental-crowns/",
    highlight: {
      ar: ["استعادة قوة الأسنان", "مظهر طبيعي متكامل", "مواد عالية الجودة"],
      en: [
        "Restores tooth strength",
        "Fully natural appearance",
        "High-quality materials",
      ],
    },
  },
  {
    slug: "جسور-الأسنان",
    category: C.restorative,
    title: { ar: "جسور الأسنان", en: "Dental Bridges" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق حلول جسور الأسنان لتعويض الأسنان المفقودة واستعادة الوظيفة والمظهر الطبيعي بدقة ومواد عالية الجودة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers dental bridges to replace missing teeth and restore function and natural appearance with precision and high-quality materials. Book now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق حلول جسور الأسنان لتعويض الأسنان المفقودة واستعادة الوظيفة والمظهر الطبيعي بدقة ومواد عالية الجودة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers dental bridges to replace missing teeth and restore function and natural appearance with precision and high-quality materials. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Dental-Bridges.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/جسور-الأسنان/",
    sourceUrlEn: "https://davincidental.ae/services/dental-bridges/",
    highlight: {
      ar: [
        "تعويض الأسنان المفقودة",
        "استعادة الوظيفة والمظهر",
        "مواد عالية الجودة",
      ],
      en: [
        "Replacing missing teeth",
        "Restoring function and appearance",
        "High-quality materials",
      ],
    },
  },
  {
    slug: "الحشوات-والحشوات-الإضافية",
    category: C.restorative,
    title: { ar: "الحشوات والحشوات الإضافية", en: "Inlays & Onlays" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات الحشوات والحشوات الإضافية باستخدام مواد حديثة وآمنة لاستعادة وظيفة الأسنان ومظهرها الطبيعي. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers inlays and onlays using modern, safe materials to restore tooth function and natural appearance. Book your appointment now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات الحشوات والحشوات الإضافية باستخدام مواد حديثة وآمنة لاستعادة وظيفة الأسنان ومظهرها الطبيعي. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers inlays and onlays using modern, safe materials to restore tooth function and natural appearance. Book your appointment now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Inlays-and-Onlays.jpg",
    sourceUrl:
      "https://davincidental.ae/ar/services/الحشوات-والحشوات-الإضافية/",
    sourceUrlEn: "https://davincidental.ae/services/inlays-and-onlays/",
    highlight: {
      ar: ["مواد حديثة وآمنة", "استعادة وظيفة الأسنان", "مظهر طبيعي متكامل"],
      en: [
        "Modern and safe materials",
        "Restoring tooth function",
        "Fully natural appearance",
      ],
    },
  },

  // ============ طوارئ الأسنان ============
  {
    slug: "طوارئ-الأسنان",
    category: C.emergency,
    title: { ar: "طوارئ الأسنان", en: "Dental Emergency" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات طوارئ الأسنان للتعامل السريع مع الألم، الكسور، والتهابات الأسنان على يد أطباء متخصصين. تواصل معنا فورًا.",
      en: "Saudi Dental Clinic in Damascus provides dental emergency services for quick handling of pain, fractures, and tooth infections by specialist doctors. Contact us now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات طوارئ الأسنان للتعامل السريع مع الألم، الكسور، والتهابات الأسنان على يد أطباء متخصصين. تواصل معنا فورًا.",
      en: "Saudi Dental Clinic in Damascus provides dental emergency services for quick handling of pain, fractures, and tooth infections by specialist doctors. Contact us now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Dental-Emergency-1.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/طوارئ-الأسنان/",
    sourceUrlEn: "https://davincidental.ae/services/dental-emergency/",
    highlight: {
      ar: [
        "استجابة سريعة للألم والكسور",
        "علاج التهابات الأسنان",
        "أطباء متخصصون في الطوارئ",
      ],
      en: [
        "Fast response to pain and fractures",
        "Treating dental infections",
        "Specialist emergency doctors",
      ],
    },
  },

  // ============ طب الأسنان الوقائي ============
  {
    slug: "تنظيف-الأسنان-والعناية-بصحة-الفم",
    category: C.preventive,
    title: {
      ar: "تنظيف الأسنان والعناية بصحة الفم",
      en: "Dental Cleaning & Oral Hygiene",
    },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات تنظيف الأسنان والعناية بصحة الفم باستخدام تقنيات حديثة للحفاظ على أسنان صحية وابتسامة نظيفة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers dental cleaning and oral hygiene using modern techniques to maintain healthy teeth and a clean smile. Book your appointment now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق خدمات تنظيف الأسنان والعناية بصحة الفم باستخدام تقنيات حديثة للحفاظ على أسنان صحية وابتسامة نظيفة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers dental cleaning and oral hygiene using modern techniques to maintain healthy teeth and a clean smile. Book your appointment now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/05/Dental-Cleaning-Hygiene.jpg",
    sourceUrl:
      "https://davincidental.ae/ar/services/تنظيف-الأسنان-والعناية-بصحة-الفم/",
    sourceUrlEn: "https://davincidental.ae/services/dental-cleaning-exams/",
    highlight: {
      ar: [
        "إزالة الجير والبلاك",
        "الحفاظ على صحة اللثة",
        "ابتسامة نظيفة ومشرقة",
      ],
      en: [
        "Removes plaque and tartar",
        "Maintains gum health",
        "Clean and bright smile",
      ],
    },
  },
  {
    slug: "الوقاية-من-تسوس-الأسنان-والتجاويف",
    category: C.preventive,
    title: {
      ar: "الوقاية من تسوّس الأسنان والتجاويف",
      en: "Cavities & Tooth Decay Prevention",
    },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق حلولًا فعّالة للوقاية من تسوّس الأسنان والتجاويف للحفاظ على صحة أسنانك ومنع المضاعفات المستقبلية. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers effective solutions to prevent tooth decay and cavities, protecting your dental health and preventing future complications. Book now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق حلولًا فعّالة للوقاية من تسوّس الأسنان والتجاويف للحفاظ على صحة أسنانك ومنع المضاعفات المستقبلية. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers effective solutions to prevent tooth decay and cavities, protecting your dental health and preventing future complications. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Cavities-Prevention.jpg",
    sourceUrl:
      "https://davincidental.ae/ar/services/الوقاية-من-تسوّس-الأسنان-والتجاويف/",
    sourceUrlEn:
      "https://davincidental.ae/services/tooth-decay-cavities-prevention/",
    highlight: {
      ar: [
        "حماية من التسوّس والتجاويف",
        "منع المضاعفات المستقبلية",
        "نصائح وقائية مخصصة",
      ],
      en: [
        "Protection against decay and cavities",
        "Preventing future complications",
        "Personalized preventive advice",
      ],
    },
  },
  {
    slug: "واقيات-الفم",
    category: C.preventive,
    title: { ar: "واقيات الفم", en: "Mouth Guards" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق واقيات فم مخصصة لحماية الأسنان أثناء الرياضة أو علاج صرير الأسنان، بتصميم مريح ومواد طبية آمنة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers custom mouth guards to protect teeth during sports or treat bruxism, with comfortable design and safe medical materials. Book now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق واقيات فم مخصصة لحماية الأسنان أثناء الرياضة أو علاج صرير الأسنان، بتصميم مريح ومواد طبية آمنة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers custom mouth guards to protect teeth during sports or treat bruxism, with comfortable design and safe medical materials. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Mouth-guards.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/واقيات-الفم/",
    sourceUrlEn: "https://davincidental.ae/services/mouth-guards/",
    highlight: {
      ar: [
        "حماية للأسنان أثناء الرياضة",
        "علاج صرير الأسنان",
        "تصميم مريح ومواد آمنة",
      ],
      en: [
        "Protects teeth during sports",
        "Treats bruxism",
        "Comfortable design and safe materials",
      ],
    },
  },

  // ============ علاج اللثة ============
  {
    slug: "علاج-أمراض-اللثة",
    category: C.perio,
    title: { ar: "علاج أمراض اللثة", en: "Gum Disease Treatment" },
    shortDescription: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق علاج أمراض اللثة باستخدام تقنيات حديثة للحفاظ على صحة اللثة والأسنان ومنع المضاعفات. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus provides gum disease treatment using modern techniques to maintain gum and teeth health and prevent complications. Book your appointment now.",
    },
    description: {
      ar: "توفر عيادة سعودي لطب الأسنان في دمشق علاج أمراض اللثة باستخدام تقنيات حديثة للحفاظ على صحة اللثة والأسنان ومنع المضاعفات. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus provides gum disease treatment using modern techniques to maintain gum and teeth health and prevent complications. Book your appointment now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/05/Gum-Disease-Treatment-1.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/علاج-أمراض-اللثة/",
    sourceUrlEn: "https://davincidental.ae/services/gum-disease-treatment/",
    highlight: {
      ar: [
        "علاج التهابات اللثة",
        "الحفاظ على صحة الأسنان",
        "منع المضاعفات المستقبلية",
      ],
      en: [
        "Treating gum inflammation",
        "Maintaining dental health",
        "Preventing future complications",
      ],
    },
  },

  // ============ برامج خاصة ============
  {
    slug: "دافينشي-كير",
    category: C.special,
    title: { ar: "دافينشي كير©", en: "Davinci Care©" },
    shortDescription: {
      ar: "برنامج دافينشي كير© في عيادة سعودي لطب الأسنان في دمشق يوفر رعاية شاملة ومتابعة مخصصة للحفاظ على صحة الفم والأسنان على المدى الطويل. احجز الآن.",
      en: "The Davinci Care© program at Saudi Dental Clinic in Damascus provides comprehensive care and personalized follow-up to maintain long-term oral and dental health. Book now.",
    },
    description: {
      ar: "برنامج دافينشي كير© في عيادة سعودي لطب الأسنان في دمشق يوفر رعاية شاملة ومتابعة مخصصة للحفاظ على صحة الفم والأسنان على المدى الطويل. احجز الآن.",
      en: "The Davinci Care© program at Saudi Dental Clinic in Damascus provides comprehensive care and personalized follow-up to maintain long-term oral and dental health. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/DavinciCare.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/دافينشي-كير/",
    sourceUrlEn: "https://davincidental.ae/services/davincicare/",
    highlight: {
      ar: [
        "رعاية شاملة ومتكاملة",
        "متابعة مخصصة طويلة الأمد",
        "برنامج وقائي للحفاظ على صحة الفم",
      ],
      en: [
        "Comprehensive integrated care",
        "Personalized long-term follow-up",
        "Preventive program for oral health",
      ],
    },
  },
  {
    slug: "طب-الأسنان-بدون-ألم",
    category: C.special,
    title: { ar: "طب الأسنان بدون ألم", en: "Pain-Free Dentistry" },
    shortDescription: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات طب الأسنان بدون ألم باستخدام تقنيات تخدير حديثة لضمان راحة المريض وتجربة علاج آمنة ومريحة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers pain-free dentistry using modern anesthesia techniques to ensure patient comfort and a safe, comfortable treatment experience. Book now.",
    },
    description: {
      ar: "تقدم عيادة سعودي لطب الأسنان في دمشق خدمات طب الأسنان بدون ألم باستخدام تقنيات تخدير حديثة لضمان راحة المريض وتجربة علاج آمنة ومريحة. احجز موعدك الآن.",
      en: "Saudi Dental Clinic in Damascus offers pain-free dentistry using modern anesthesia techniques to ensure patient comfort and a safe, comfortable treatment experience. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/Pain-free-dentistry.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/طب-الأسنان-بدون-ألم/",
    sourceUrlEn: "https://davincidental.ae/services/pain-free-dentistry/",
    highlight: {
      ar: ["تقنيات تخدير حديثة", "تجربة علاج مريحة", "أمان وراحة للمريض"],
      en: [
        "Modern anesthesia techniques",
        "Comfortable treatment experience",
        "Patient safety and comfort",
      ],
    },
  },
  {
    slug: "فحص-دافنشي-الشامل",
    category: C.special,
    title: { ar: "فحص دافنشي الشامل", en: "Davinci Comprehensive Checkup" },
    shortDescription: {
      ar: "يقدم فحص دافنشي الشامل في عيادة سعودي لطب الأسنان في دمشق تقييمًا دقيقًا لصحة الفم والأسنان باستخدام تقنيات متقدمة للكشف المبكر ووضع خطة علاج متكاملة. احجز الآن.",
      en: "The Davinci comprehensive checkup at Saudi Dental Clinic in Damascus provides an accurate assessment of oral and dental health using advanced techniques for early detection and an integrated treatment plan. Book now.",
    },
    description: {
      ar: "يقدم فحص دافنشي الشامل في عيادة سعودي لطب الأسنان في دمشق تقييمًا دقيقًا لصحة الفم والأسنان باستخدام تقنيات متقدمة للكشف المبكر ووضع خطة علاج متكاملة. احجز الآن.",
      en: "The Davinci comprehensive checkup at Saudi Dental Clinic in Damascus provides an accurate assessment of oral and dental health using advanced techniques for early detection and an integrated treatment plan. Book now.",
    },
    image:
      "https://davincidental.ae/wp-content/uploads/2023/06/DavinciCheck.jpg",
    sourceUrl: "https://davincidental.ae/ar/services/فحص-دافنشي-الشامل/",
    sourceUrlEn: "https://davincidental.ae/services/davincicheck/",
    highlight: {
      ar: ["تقييم دقيق لصحة الفم", "كشف مبكر للمشكلات", "خطة علاج متكاملة"],
      en: [
        "Accurate oral health assessment",
        "Early problem detection",
        "Integrated treatment plan",
      ],
    },
  },
];

export function getServiceBySlug(locale: Locale, slug: string) {
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  const service = serviceCatalog.find(
    (s) =>
      s.slug === slug ||
      s.slug === decodedSlug ||
      decodeURIComponent(s.slug) === decodedSlug ||
      s.title.ar.includes(decodedSlug) ||
      s.title.en.toLowerCase().includes(decodedSlug.toLowerCase()),
  );

  if (!service) return undefined;

  const rich: RichLang | null = servicesRich[service.slug]?.[locale] ?? null;

  return {
    ...service,
    title: service.title[locale],
    category: service.category[locale],
    shortDescription: service.shortDescription[locale],
    description: service.description[locale],
    highlight: service.highlight[locale],
    rich,
  };
}

// ─── Categories ───
export type CategoryItem = {
  slug: string;
  label: string;
  count: number;
  image: string;
};

export function getCategories(locale: Locale): CategoryItem[] {
  const map = new Map<string, CategoryItem>();

  for (const s of serviceCatalog) {
    const key = s.category.en;
    const slug = key.toLowerCase().replace(/\s+/g, "-");
    const existing = map.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, {
        slug,
        label: s.category[locale],
        count: 1,
        image: s.image,
      });
    }
  }

  return Array.from(map.values());
}

export function getCategorySlug(categoryEn: string): string {
  return categoryEn.toLowerCase().replace(/\s+/g, "-");
}

// ─── Home Page Content ───
export function getPageContent(locale: Locale) {
  const isAr = locale === "ar";

  const services = serviceCatalog.slice(0, 6).map((s) => ({
    slug: s.slug,
    title: s.title[locale],
    description: s.shortDescription[locale],
    image: s.image,
  }));

  const features = serviceCatalog.slice(0, 6).map((s) => ({
    title: s.title[locale],
    description: s.shortDescription[locale],
  }));

  const doctors = doctorCatalog.map((d) => ({
    name: d.name,
    specialty: d.specialization[locale],
    initials: d.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  }));

  return {
    hero: {
      badge: isAr ? "رعاية متقدمة في دمشق" : "Advanced Care in Damascus",
      title: isAr
        ? "ابتسامة صحية وواثقة تبدأ من هنا"
        : "A Healthy, Confident Smile Starts Here",
      description: isAr
        ? "نقدم أحدث تقنيات طب الأسنان وتقويم الأسنان لضمان راحتك وصحة أسنانك بأعلى معايير الجودة."
        : "We offer state-of-the-art dental and orthodontic technologies to ensure your comfort and oral health.",
      badges: isAr
        ? ["تقويم الأسنان", "زراعة الأسنان", "تجميل"]
        : ["Orthodontics", "Implants", "Aesthetics"],
    },
    services,
    features,
    about: {
      eyebrow: isAr ? "من نحن" : "About Us",
      title: isAr
        ? "رعاية تركّز على راحة المريض"
        : "Care designed around comfort and confidence",
      description: isAr
        ? "فريقنا يقدم رعاية شخصية ومتكاملة مع تركيز واضح على الراحة والنتائج العلاجية طويلة الأمد."
        : "Our team provides personalised, integrated care with a clear focus on comfort and long-term outcomes.",
      stats: [
        { value: `${doctors.length}+`, label: isAr ? "أطباء" : "Doctors" },
        {
          value: `${serviceCatalog.length}+`,
          label: isAr ? "خدمات" : "Services",
        },
        { value: "20+", label: isAr ? "سنوات خبرة" : "Years experience" },
      ],
    },
    overview: {
      title: isAr ? "نهج علاجي متكامل" : "An integrated clinical approach",
      list: serviceCatalog
        .slice(0, 6)
        .map((s) => s.highlight[locale][0] || s.shortDescription[locale]),
    },
    whyUs: isAr
      ? ["رعاية متخصصة", "تقنيات متقدمة", "تجربة مريحة للمرضى"]
      : [
          "Specialised care",
          "Advanced technology",
          "Comfort-focused experience",
        ],
    testimonials: homeTestimonials,
    faq: homeFAQ[isAr ? "ar" : "en"],
    blog: isAr
      ? [
          { title: "نصائح للعناية بالأسنان", meta: "نشر · 3 دقائق" },
          { title: "اختر تقويم مناسب", meta: "نشر · 5 دقائق" },
        ]
      : [
          { title: "Oral care tips", meta: "Posted · 3 min" },
          { title: "Choosing the right orthodontics", meta: "Posted · 5 min" },
        ],
    footer: clinicContactData,
    doctors,
  };
}

// ================== clinicValues ==================
export const clinicValues = [
  {
    title: { ar: "الشفافية", en: "Transparency" },
    text: {
      ar: "نشرح كل خطوة علاجية بوضوح، ونشارك المريض في اتخاذ القرار دون مفاجآت.",
      en: "We explain every treatment step clearly and involve the patient in decisions without surprises.",
    },
  },
  {
    title: { ar: "الراحة", en: "Comfort" },
    text: {
      ar: "نصمم كل تفصيل في العيادة ليكون مريحاً نفسياً وجسدياً، من الاستقبال حتى ما بعد العلاج.",
      en: "Every detail in the clinic is designed for physical and emotional comfort, from reception to aftercare.",
    },
  },
  {
    title: { ar: "التخطيط الدقيق", en: "Thoughtful Planning" },
    text: {
      ar: "لا نبدأ أي علاج قبل تقييم شامل ووضع خطة واضحة تناسب حالة المريض وظروفه.",
      en: "No treatment begins before a thorough assessment and a clear plan tailored to the patient's case.",
    },
  },
  {
    title: { ar: "الاحترام", en: "Respect" },
    text: {
      ar: "نحترم وقت المريض وأهدافه ومخاوفه، ونبني العلاقة العلاجية على الثقة المتبادلة.",
      en: "We respect the patient's time, goals, and concerns, building care on mutual trust.",
    },
  },
  {
    title: { ar: "التعليم", en: "Education" },
    text: {
      ar: "نمنح المريض المعرفة الكافية للعناية بأسنانه بين الزيارات، ونشرح له خياراته بوضوح.",
      en: "We empower patients with the knowledge to care for their teeth between visits and understand their options.",
    },
  },
  {
    title: { ar: "الاستمرارية", en: "Continuity" },
    text: {
      ar: "نرافق المريض على المدى الطويل بمتابعة منتظمة وخطط وقائية تحافظ على النتائج.",
      en: "We accompany patients long-term with regular follow-up and preventive plans that preserve results.",
    },
  },
];

// ================== Blog ==================
export type BlogPost = {
  slug: string;
  title: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  content: { ar: string; en: string };
  image: string;
  date: string;
  readTime: { ar: string; en: string };
};

export const blogCatalog: BlogPost[] = [];

export function getBlogPostBySlug(locale: Locale, slug: string) {
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  const post = blogCatalog.find(
    (p) => p.slug === slug || p.slug === decodedSlug,
  );
  if (!post) return undefined;

  return {
    ...post,
    title: post.title[locale],
    excerpt: post.excerpt[locale],
    content: post.content[locale],
    readTime: post.readTime[locale],
  };
}