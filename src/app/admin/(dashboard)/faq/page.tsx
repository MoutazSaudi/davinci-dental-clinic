export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminServer } from "@/lib/auth";
import FAQAdminClient from "./FAQAdminClient";

export default async function FAQPage() {
  await requireAdminServer();

  return (
    <div className="container mx-auto">
      <FAQAdminClient initial={[]} />
    </div>
  );
}