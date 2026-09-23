// =========================================================
// Gallery Data — Services with image collections
// =========================================================

export interface GalleryService {
  slug: string;
  title: { ar: string; en: string };
  category: { ar: string; en: string };
  description: { ar: string; en: string };
  images: string[];
}

// صور تقويم الأسنان المتاحة حالياً
const orthodonticsImages = [
  "/images/gallary/g01.webp",
  "/images/gallary/g02.webp",
  "/images/gallary/g03.webp",
  "/images/gallary/g04.webp",
  "/images/gallary/g05.webp",
  "/images/gallary/g06.webp",
  "/images/gallary/g07.webp",
  "/images/gallary/g08.webp",
  "/images/gallary/g09.webp",
  "/images/gallary/g10.webp",
  "/images/gallary/g11.webp",
  "/images/gallary/g12.webp",
];

export const galleryServices: GalleryService[] = [
  {
    slug: "orthodontics",
    category: { ar: "تقويم الأسنان", en: "Orthodontics" },
    title: { ar: "تقويم الأسنان", en: "Orthodontics" },
    description: {
      ar: "نماذج من نتائج علاجات التقويم في العيادة، توضح تصحيح الاصطفاف وتحسين الإطباق والحصول على ابتسامة متناسقة.",
      en: "Representative orthodontic treatment results showing alignment correction, bite improvement, and a harmonious smile.",
    },
    images: orthodonticsImages,
  },

  // 🔽 أضف خدمات جديدة هنا عند توفر صور لها بنفس الهيكل:
  //
  // {
  //   slug: "aesthetic",
  //   category: { ar: "التجميل السني", en: "Aesthetic Dentistry" },
  //   title: { ar: "التجميل السني", en: "Aesthetic Dentistry" },
  //   description: { ar: "...", en: "..." },
  //   images: ["/images/gallary/aesthetic-01.webp", ...],
  // },
];