import * as cheerio from "cheerio";
import { serviceCatalog } from "../src/data/mock/services";

const TARGET_SLUG = process.argv[2];
const LANG = (process.argv[3] as "ar" | "en") || "ar";

async function main() {
  const service = serviceCatalog.find((s) => s.slug === TARGET_SLUG);
  if (!service) {
    console.error(`Not found: ${TARGET_SLUG}`);
    process.exit(1);
  }

  const url = LANG === "ar" ? service.sourceUrl : service.sourceUrlEn;
  console.log(`\n🔍 Inspecting: ${url}\n`);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ContentMigration/1.0)",
    },
  });

  if (!res.ok) {
    console.error(`HTTP ${res.status}`);
    process.exit(1);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  console.log("─── h1 / h2 / h3 على الصفحة ───\n");

  $("h1, h2, h3").each((_, el) => {
    const tag = (el as any).tagName?.toUpperCase?.() || "?";
    const text = $(el).text().trim().replace(/\s+/g, " ");
    if (text.length > 100) return;
    console.log(`[${tag}] ${text}`);
  });

  console.log("\n─── الحاويات المحتملة للمحتوى ───\n");

  for (const sel of [".entry-content", "article", "main", ".elementor-widget-theme-post-content", ".post-content"]) {
    const found = $(sel).first();
    const len = found.length ? found.text().trim().length : 0;
    console.log(`${sel.padEnd(40)} → length: ${len}`);
  }

  console.log("\n─── عناصر details/accordion ───\n");
  console.log(`details: ${$("details").length}`);
  console.log(`.faq-item: ${$(".faq-item").length}`);
  console.log(`.accordion-item: ${$(".accordion-item").length}`);
  console.log(`.elementor-accordion: ${$(".elementor-accordion").length}`);
  console.log(`.elementor-toggle: ${$(".elementor-toggle").length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});