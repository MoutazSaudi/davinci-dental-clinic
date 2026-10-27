import prisma from "@/lib/prisma";

export type PublicGalleryService = {
  slug: string;
  title: { ar: string; en: string };
  category: { ar: string; en: string };
  description: { ar: string; en: string };
  images: string[];
};

export async function getPublishedGalleryAlbums(): Promise<PublicGalleryService[]> {
  const albums = await prisma.galleryAlbum.findMany({
    where: { status: "PUBLISHED" },
    include: {
      translations: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return albums.map((album) => {
    const en = album.translations.find((t) => t.locale === "en");
    const ar = album.translations.find((t) => t.locale === "ar");
    return {
      slug: album.slug,
      title: {
        en: en?.title ?? ar?.title ?? "",
        ar: ar?.title ?? en?.title ?? "",
      },
      category: {
        en: en?.category ?? ar?.category ?? "",
        ar: ar?.category ?? en?.category ?? "",
      },
      description: {
        en: en?.description ?? "",
        ar: ar?.description ?? "",
      },
      images: album.images.map((i) => i.url),
    };
  });
}