export type DoctorAdmin = {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  specialization: { en: string; ar: string };
  bio: { en: string; ar: string };
  image: string | null;
  instagram: string | null;
  linkedin: string | null;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export type DoctorDraft = Omit<DoctorAdmin, "id">;

export const emptyDoctorDraft: DoctorDraft = {
  slug: "",
  name: { en: "", ar: "" },
  specialization: { en: "", ar: "" },
  bio: { en: "", ar: "" },
  image: null,
  instagram: null,
  linkedin: null,
  sortOrder: 0,
  status: "PUBLISHED",
};

export const STATUS_LABEL: Record<DoctorAdmin["status"], string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};