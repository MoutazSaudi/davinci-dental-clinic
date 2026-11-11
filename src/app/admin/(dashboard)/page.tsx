export const dynamic = "force-dynamic";

import React from "react";
import { requirePermissionServer } from "@/lib/auth";
import AnalyticsDashboardClient from "./AnalyticsDashboardClient";

export default async function AdminDashboardPage() {
  await requirePermissionServer("OVERVIEW");
  return (
    <div className="container mx-auto">
      <AnalyticsDashboardClient />
    </div>
  );
}