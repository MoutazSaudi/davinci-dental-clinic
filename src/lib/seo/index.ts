export function buildMetadata({ title, description, pathname, locale }: { title?: string; description?: string; pathname?: string; locale?: string }) {
  return {
    title: title ?? "",
    description: description ?? "",
    openGraph: {
      title,
      description,
      url: pathname ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}${pathname}` : undefined,
    },
    alternates: {
      canonical: pathname ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}${pathname}` : undefined,
      languages: {
        ...(locale ? { [locale]: pathname ?? "/" } : {}),
      },
    },
  };
}

export function jsonLd(schema: object) {
  return { "@context": "https://schema.org", ...schema };
}
