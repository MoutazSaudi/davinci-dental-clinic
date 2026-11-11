export const dynamic = "force-dynamic";

import React from "react";
import { requirePermissionServer } from "@/lib/auth";
import ServicesAdminClient from "./ServicesAdminClient";

export default async function ServicesPage() {
  await requirePermissionServer("SERVICES");
  return (
    <div className="container mx-auto">
      <ServicesAdminClient />
    </div>
  );
}