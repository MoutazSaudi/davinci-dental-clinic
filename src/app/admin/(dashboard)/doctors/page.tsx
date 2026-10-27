export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminServer } from "@/lib/auth";
import DoctorsAdminClient from "./DoctorsAdminClient";

export default async function DoctorsAdminPage() {
  await requireAdminServer();
  return (
    <div className="container mx-auto">
      <DoctorsAdminClient initial={[]} />
    </div>
  );
}