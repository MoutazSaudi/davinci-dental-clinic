export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminServer } from "@/lib/auth";
import GalleryAdminClient from "./GalleryAdminClient";

export default async function GalleryAdminPage() {
  await requireAdminServer();
  return (
    <div className="container mx-auto">
      <GalleryAdminClient initial={[]} />
    </div>
  );
}