
import type { MetadataRoute } from "next";
import { serviceCatalog } from "@/data/mock/services";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://davincidental.org";

const locales = ["en", "ar"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/doctors",
    "/services",
    "/gallery",
  ];

  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.7,
    }))
  );

  const serviceRoutes: MetadataRoute.Sitemap = serviceCatalog.flatMap(
    (service) =>
      locales.map((locale) => ({
        url: `${BASE_URL}/${locale}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
  );

  return [...staticRoutes, ...serviceRoutes];
}
