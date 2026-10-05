import React from "react";
import GalleryAdminClient from "./GalleryAdminClient";
import { listGalleryItems } from "@/lib/services/admin/galleryMock";

export default async function GalleryAdminPage() {
  // جلب بيانات الـ Mock الحالية لعرضها مباشرة في الجدول
  const initial = await listGalleryItems();

  return (
    <div className="container mx-auto">
      <GalleryAdminClient initial={initial} />
    </div>
  );
}