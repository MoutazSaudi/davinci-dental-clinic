import fs from "node:fs/promises";
import * as cheerio from "cheerio";

const SERVICES_INDEX = "https://davincidental.ae/services/";

async function main() {
  console.log(`▶ Fetching: ${SERVICES_INDEX}`);

  const res = await fetch(SERVICES_INDEX, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ContentMigration/1.0)",
      "Accept-Language": "en,ar;q=0.9",
    },
  });

  if (!res.ok) {
    console.error(`✗ HTTP ${res.status}`);
    process.exit(1);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  type ServiceLink = { title: string; url: string };
  const services: ServiceLink[] = [];
  const seen = new Set<string>();

  // نبحث عن كل رابط يحتوي /services/ في المسار
  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    // نبني URL مطلق
    const url = href.startsWith("http")
      ? href
      : `https://davincidental.ae${href.startsWith("/") ? "" : "/"}${href}`;

    // نستبعد:
    // - صفحة /services/ نفسها
    // - أي رابط يحتوي /ar/
    // - أي رابط يحتوي /services/page/ (pagination)
    // - أي رابط لا ينتهي بـ / بعد /services/
    if (
      url === SERVICES_INDEX ||
      url.includes("/ar/") ||
      url.includes("/services/page/") ||
      !/\/services\/[^/]+\/?$/.test(url)
    ) {
      return;
    }

    if (seen.has(url)) return;
    seen.add(url);

    const title = $(el).text().trim().replace(/\s+/g, " ");
    if (!title) return;

    services.push({ title, url });
  });

  console.log(`  ✓ Found ${services.length} service links`);

  await fs.mkdir("scripts/scraped", { recursive: true });
  await fs.writeFile(
    "scripts/scraped/en-urls.json",
    JSON.stringify(services, null, 2),
    "utf8"
  );

  console.log(`\n✅ Output: scripts/scraped/en-urls.json`);
  console.log("\nPreview:");
  services.slice(0, 10).forEach((s) => console.log(`  ${s.title} → ${s.url}`));
  if (services.length > 10) console.log(`  ... and ${services.length - 10} more`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});