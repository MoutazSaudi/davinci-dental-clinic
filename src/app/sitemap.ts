import type { MetadataRoute } from "next";
import { serviceCatalog } from "@/data/mock/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://saudidental.sy";
  const staticRoutes = [
    "/en",
    "/ar",
    "/en/about",
    "/ar/about",
    "/en/contact",
    "/ar/contact",
    "/en/doctors",
    "/ar/doctors",
    "/en/services",
    "/ar/services",
  ];

  const serviceRoutes = serviceCatalog.flatMap((service) => [
    `${base}/en/services/${service.slug}`,
    `${base}/ar/services/${service.slug}`,
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route.includes("/services") ? 0.8 : 0.7,
    })),
    ...serviceRoutes.map((url) => ({
      url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
