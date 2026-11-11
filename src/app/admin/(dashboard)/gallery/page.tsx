export const dynamic = "force-dynamic";

import React from "react";
import { requirePermissionServer } from "@/lib/auth";
import GalleryAdminClient from "./GalleryAdminClient";

export default async function GalleryAdminPage() {
  await requirePermissionServer("GALLERY");
  return (
    <div className="container mx-auto">
      <GalleryAdminClient />
    </div>
  );
}