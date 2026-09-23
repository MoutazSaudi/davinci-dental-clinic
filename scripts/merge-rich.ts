import fs from "node:fs/promises";

type ScrapedSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

type ScrapedFAQ = {
  question: string;
  answer: string;
};

type ScrapedLang = {
  pageTitle: string;
  intro: string;
  sections: ScrapedSection[];
  faqs: ScrapedFAQ[];
};

type ScrapedService = {
  slug: string;
  sourceUrl: string;
  sourceUrlEn: string;
  ar: ScrapedLang;
  en: ScrapedLang;
};

type RichLang = {
  intro: string;
  sections: ScrapedSection[];
  faqs: ScrapedFAQ[];
};

type RichService = {
  ar: RichLang;
  en: RichLang;
};

type RichMap = Record<string, RichService>;

async function main() {
  const raw = await fs.readFile("scripts/scraped/_all.json", "utf8");
  const scraped: ScrapedService[] = JSON.parse(raw);

  const map: RichMap = {};

  for (const s of scraped) {
    map[s.slug] = {
      ar: {
        intro: s.ar.intro,
        sections: s.ar.sections.filter(
          (sec) => sec.paragraphs.length > 0 || sec.bullets.length > 0
        ),
        faqs: s.ar.faqs,
      },
      en: {
        intro: s.en.intro,
        sections: s.en.sections.filter(
          (sec) => sec.paragraphs.length > 0 || sec.bullets.length > 0
        ),
        faqs: s.en.faqs,
      },
    };
  }

  await fs.mkdir("src/data/mock", { recursive: true });
  await fs.writeFile(
    "src/data/mock/services-rich.json",
    JSON.stringify(map, null, 2),
    "utf8"
  );

  console.log(`✅ Merged ${scraped.length} services → src/data/mock/services-rich.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});