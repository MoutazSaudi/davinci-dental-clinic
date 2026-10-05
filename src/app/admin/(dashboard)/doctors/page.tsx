import React from "react";
import { requireAdminServer, isAdminAuthEnabled } from "@/lib/auth";
import DoctorsAdminClient from "./DoctorsAdminClient";

export default async function DoctorsPage() {
  const enabled = isAdminAuthEnabled();
  if (enabled) {
    requireAdminServer();
  }

  const initial: any[] = [];

  return (
    <div className="container mx-auto">
      <DoctorsAdminClient initial={initial} />
    </div>
  );
}