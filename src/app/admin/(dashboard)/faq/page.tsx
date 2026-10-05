import React from "react";
import { requireAdminServer, isAdminAuthEnabled } from "@/lib/auth";
import FAQAdminClient from "./FAQAdminClient";
import { faqCatalog } from "@/data/mock/faq"; // استيراد البيانات الحالية للـ FAQ

export default async function FAQPage() {
  const enabled = isAdminAuthEnabled();
  if (enabled) {
    requireAdminServer();
  }

  const initial = faqCatalog || [];

  return (
    <div className="container mx-auto">
      <FAQAdminClient initial={initial} />
    </div>
  );
}