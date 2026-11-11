export const dynamic = "force-dynamic";

import React from "react";
import { requirePermissionServer } from "@/lib/auth";
import FAQAdminClient from "./FAQAdminClient";

export default async function FAQPage() {
  await requirePermissionServer("FAQ");
  return (
    <div className="container mx-auto">
      <FAQAdminClient />
    </div>
  );
}