export const dynamic = "force-dynamic";

import React from "react";
import { requirePermissionServer } from "@/lib/auth";
import AppointmentsAdminClient from "./AppointmentsAdminClient";

export default async function AppointmentsPage() {
  await requirePermissionServer("APPOINTMENTS");
  return (
    <div className="container mx-auto">
      <AppointmentsAdminClient />
    </div>
  );
}