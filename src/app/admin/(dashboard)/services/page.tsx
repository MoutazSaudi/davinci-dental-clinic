export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminServer } from "@/lib/auth";
import ServicesAdminClient from "./ServicesAdminClient";

export default async function ServicesPage() {
  await requireAdminServer();

  return (
    <div className="container mx-auto">
      <ServicesAdminClient initial={[]} />
    </div>
  );
}
