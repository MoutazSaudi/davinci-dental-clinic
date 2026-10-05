import { GalleryItem } from "@/app/admin/(dashboard)/gallery/GalleryAdminClient";
import { galleryServices } from "@/data/mock/gallery";

export async function listGalleryItems(): Promise<GalleryItem[]> {
  const items: GalleryItem[] = [];

  // المرور على جميع الخدمات في المعرض وفك مصفوفة الصور الخاصة بكل خدمة
  galleryServices.forEach((service) => {
    service.images.forEach((img, index) => {
      items.push({
        id: `${service.slug}-${index}`, // إنشاء معرف فريد لكل صورة
        title: service.title.en, // استخدام العنوان الإنجليزي (أو يمكنك جعله service.title.ar)
        category: service.category.en, // استخدام الفئة الإنجليزية
        image: img, // رابط الصورة المفردة
      });
    });
  });

  return items;
}