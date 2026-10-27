export type GalleryAlbum = {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  category: { en: string; ar: string };
  description: { en: string; ar: string };
  images: string[];
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export type GalleryDraft = Omit<GalleryAlbum, "id">;

export const emptyDraft: GalleryDraft = {
  slug: "",
  title: { en: "", ar: "" },
  category: { en: "", ar: "" },
  description: { en: "", ar: "" },
  images: [],
  sortOrder: 0,
  status: "PUBLISHED",
};

export const STATUS_LABEL: Record<GalleryAlbum["status"], string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};