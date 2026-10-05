import React from "react";
import { listServices } from "@/lib/services/admin/servicesMock";
import ServicesAdminClient from "./ServicesAdminClient";

export default async function ServicesPage() {
  const initial = await listServices();

  return (
    <div className="container mx-auto">
      <ServicesAdminClient initial={initial} />
    </div>
  );
}
