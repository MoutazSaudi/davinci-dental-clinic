export const dynamic = "force-dynamic";

import React from "react";
import { requirePermissionServer } from "@/lib/auth";
import DoctorsAdminClient from "./DoctorsAdminClient";

export default async function DoctorsAdminPage() {
  await requirePermissionServer("DOCTORS");
  return (
    <div className="container mx-auto">
      <DoctorsAdminClient />
    </div>
  );
}