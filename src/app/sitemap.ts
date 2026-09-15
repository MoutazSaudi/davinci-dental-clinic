import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return [
    { url: `${base}/en`, lastModified: new Date() },
    { url: `${base}/ar`, lastModified: new Date() },
    { url: `${base}/en/services`, lastModified: new Date() },
    { url: `${base}/ar/services`, lastModified: new Date() },
  ];
}
