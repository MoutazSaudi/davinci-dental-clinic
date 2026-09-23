import fs from "node:fs/promises";
import * as cheerio from "cheerio";
import { serviceCatalog } from "../src/data/mock/services";

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

const IGNORE_HEADINGS = [
  "طلب التفاصيل",
  "Request for Detailes",
  "Request for Details",
  "لينكات هامة",
  "روابط هامة",
  "Important Links",
  "Useful Links",
];

function isQuestion(text: string): boolean {
  const t = text.trim();
  return t.endsWith("؟") || t.endsWith("?");
}

function shouldIgnore(heading: string): boolean {
  const h = heading.trim();
  return IGNORE_HEADINGS.some((ig) => h === ig || h.startsWith(ig));
}

async function scrapeLang(url: string): Promise<ScrapedLang> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ContentMigration/1.0)",
      "Accept-Language": "ar,en;q=0.9",
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

  const html = await res.text();
  const $ = cheerio.load(html);

  const pageTitle = $("h1").first().text().trim() || $("title").text().trim();

  let $content = $();
  for (const sel of [".entry-content", "article", "main", ".elementor-widget-theme-post-content"]) {
    const found = $(sel).first();
    if (found.length && found.text().trim().length > 200) {
      $content = found;
      break;
    }
  }
  if (!$content.length) $content = $("body");

  $content.find("script, style, nav, header, footer, form, iframe, .breadcrumbs, .menu").remove();

  const intro = $content.find("p").first().text().trim().replace(/\s+/g, " ");
  const sections: ScrapedSection[] = [];
  const faqs: ScrapedFAQ[] = [];
  let current: ScrapedSection | null = null;
  let currentFaq: ScrapedFAQ | null = null;
  let faqHeadingSeen = false;

  $content.find("h2, h3, h4, p, ul, ol, details").each((_, el) => {
    const tag = (el as any).tagName?.toLowerCase?.() || "";
    const $el = $(el);

    if (tag === "h2" || tag === "h3" || tag === "h4") {
      const heading = $el.text().trim().replace(/\s+/g, " ");
      if (!heading) return;

      if (shouldIgnore(heading)) {
        current = null;
        currentFaq = null;
        return;
      }

      if (/الأسئلة الشائعة|Frequently asked|FAQ/i.test(heading)) {
        current = null;
        currentFaq = null;
        faqHeadingSeen = true;
        return;
      }

      if (isQuestion(heading)) {
        const isFaq =
          tag === "h3" ||
          tag === "h4" ||
          (tag === "h2" && faqHeadingSeen);

        if (isFaq) {
          const faq: ScrapedFAQ = { question: heading, answer: "" };
          faqs.push(faq);
          currentFaq = faq;
          return;
        }
      }

      current = { heading, paragraphs: [], bullets: [] };
      sections.push(current);
      currentFaq = null;
      return;
    }

    if (tag === "details") {
      const q = $el.find("summary").first().text().trim();
      const a = $el.clone().children("summary").remove().end().text().trim();
      if (q && a) {
        const faq = { question: q, answer: a.replace(/\s+/g, " ") };
        faqs.push(faq);
        currentFaq = faq;
      }
      return;
    }

    if (tag === "p") {
      let text = $el.text().trim().replace(/\s+/g, " ");
      text = text.replace(/^\\+/, "");
      if (text.length < 20) return;

      if (currentFaq) {
        currentFaq.answer = currentFaq.answer ? `${currentFaq.answer} ${text}` : text;
        return;
      }

      if (current) current.paragraphs.push(text);
      return;
    }

    if (tag === "ul" || tag === "ol") {
      const items = $el
        .find("li")
        .map((_, li) => $(li).text().trim().replace(/\s+/g, " "))
        .get()
        .filter(Boolean);
      if (!items.length) return;
      if (currentFaq) return;
      if (current) current.bullets.push(...items);
      return;
    }
  });

  return { pageTitle, intro, sections, faqs };
}

async function main() {
  await fs.mkdir("scripts/scraped", { recursive: true });

  const allResults: ScrapedService[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const service of serviceCatalog) {
    console.log(`\n▶ [${successCount + failCount + 1}/${serviceCatalog.length}] ${service.slug}`);
    try {
      console.log(`  AR: ${service.sourceUrl}`);
      const ar = await scrapeLang(service.sourceUrl);
      console.log(`    ✓ ${ar.sections.length} sections, ${ar.faqs.length} FAQs`);

      console.log(`  EN: ${service.sourceUrlEn}`);
      const en = await scrapeLang(service.sourceUrlEn);
      console.log(`    ✓ ${en.sections.length} sections, ${en.faqs.length} FAQs`);

      const result: ScrapedService = {
        slug: service.slug,
        sourceUrl: service.sourceUrl,
        sourceUrlEn: service.sourceUrlEn,
        ar,
        en,
      };

      const outPath = `scripts/scraped/${service.slug}.json`;
      await fs.writeFile(outPath, JSON.stringify(result, null, 2), "utf8");
      allResults.push(result);
      successCount++;
    } catch (e: any) {
      console.error(`    ✗ Failed: ${e.message}`);
      failCount++;
    }
  }

  const summaryPath = "scripts/scraped/_all.json";
  await fs.writeFile(summaryPath, JSON.stringify(allResults, null, 2), "utf8");

  console.log(`\n═══════════════════════════════`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed:  ${failCount}`);
  console.log(`📄 Summary: ${summaryPath}`);
  console.log(`📁 Individual files: scripts/scraped/*.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});