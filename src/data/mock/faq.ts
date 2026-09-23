// ─── نص ثنائي اللغة (للـ faqCatalog) ───
export type BilingualFAQItem = {
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
};

// ─── نص أحادي اللغة (لصفحة الرئيسية) ───
export type LocalizedFAQItem = {
  question: string;
  answer: string;
};

// ─── أسئلة الصفحة الرئيسية ───
export const homeFAQ: Record<"ar" | "en", LocalizedFAQItem[]> = {
  ar: [
    {
      question: "كيف أحجز موعدًا؟",
      answer: "يمكنك الحجز عبر نموذج الاتصال أو الهاتف.",
    },
    {
      question: "هل تقبلون الأطفال؟",
      answer: "نعم، لدينا برنامج رعاية خاص بالأطفال.",
    },
  ],
  en: [
    {
      question: "How do I book?",
      answer: "You can book via the contact form or by phone.",
    },
    {
      question: "Do you treat children?",
      answer: "Yes — we offer a dedicated children's care program.",
    },
  ],
};

// ─── أسئلة صفحة /faq ───
export const faqCatalog: BilingualFAQItem[] = [];