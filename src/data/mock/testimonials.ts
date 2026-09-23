// ─── الصفحة الرئيسية (اقتباسات أحادية اللغة — لا تُترجَم) ───
export type Testimonial = {
  name: string;
  text: string;
  source?: "google" | "instagram" | "in-person";
  rating?: number;
};

// ─── صفحة "من نحن" (نص ثنائي اللغة) ───
export type PatientTestimonial = {
  name: string;
  text: { ar: string; en: string };
};

// ─── آراء الرئيسية: مراجعات Google الحقيقية ───
export const homeTestimonials: Testimonial[] = [
  {
    name: "bo sale7",
    text: "كانت تجربتي في العيادة ممتازة بكل المقاييس. أجريت تقويم الأسنان تحت إشراف الدكتور مهند سعودي، وأود أن أشيد بمهارته العالية واهتمامه بالتفاصيل، ويتعامل باحترافية وراحة تامة للمريض. الطاقم متعاون والأجواء مريحة ومنظمة. أنصح بشدة بالزيارة لمن يبحث عن جودة ورعاية مميزة.",
    source: "google",
    rating: 5,
  },
  {
    name: "Maryam Altunaiji",
    text: "دكتور مهند أخصائي تقويم، بصراحة شغله كتير حلو وفنان، ومرتب ونظيف. تعامل راقي، وأنصح فيه كتير.",
    source: "google",
    rating: 5,
  },
  {
    name: "TX. W",
    text: "شكر خاص لدكتور مهند السعودي، ما طوّل معي ولا حسيت بأي ألم وقت تركيب التقويم، وحتى بعد التركيب ما أحس بألم.",
    source: "google",
    rating: 5,
  },
  {
    name: "Salem Alsereidi",
    text: "الصراحة شغل عدل ورهيب جدًا. أنصح الجميع في هذه العيادة، ورح تلاحظ فرق شاسع خلال انتهائك من العلاج.",
    source: "google",
    rating: 5,
  },
];

// ─── آراء صفحة "من نحن" ───
export const patientTestimonials: PatientTestimonial[] = [
  {
    name: "مريم",
    text: {
      ar: "تجربة مريحة جداً، والفريق شرح لي كل خطوة قبل البدء بالعلاج. النتيجة كانت أفضل مما توقعت.",
      en: "A very comfortable experience. The team explained every step before starting. Results exceeded my expectations.",
    },
  },
  {
    name: "خالد",
    text: {
      ar: "خدمة احترافية ومتابعة دقيقة بعد العلاج. شعرت أنني في أيدٍ أمينة من أول زيارة.",
      en: "Professional service and thorough follow-up after treatment. I felt in safe hands from the first visit.",
    },
  },
  {
    name: "سارة",
    text: {
      ar: "أفضل ما يميز العيادة هو الهدوء والاهتمام بالتفاصيل. أنصح بها لكل من يخاف من طبيب الأسنان.",
      en: "What sets this clinic apart is the calm atmosphere and attention to detail. Perfect for anyone anxious about dentists.",
    },
  },
  {
    name: "عمر",
    text: {
      ar: "الشفافية في الأسعار والخطة العلاجية جعلتني أثق بهم منذ اللحظة الأولى. شكراً للفريق.",
      en: "Transparency in pricing and treatment plan made me trust them from the first moment. Thanks to the team.",
    },
  },
];