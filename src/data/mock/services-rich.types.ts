export type RichSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

export type RichFAQ = {
  question: string;
  answer: string;
};

export type RichLang = {
  intro: string;
  sections: RichSection[];
  faqs: RichFAQ[];
};

export type RichService = {
  ar: RichLang;
  en: RichLang;
};

export type RichMap = Record<string, RichService>;