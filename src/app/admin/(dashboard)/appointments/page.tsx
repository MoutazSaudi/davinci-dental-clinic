export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminServer } from "@/lib/auth";
import AppointmentsAdminClient from "./AppointmentsAdminClient";

export default async function AppointmentsPage() {
  await requireAdminServer();
  return (
    <div className="container mx-auto">
      <AppointmentsAdminClient />
    </div>
  );
}