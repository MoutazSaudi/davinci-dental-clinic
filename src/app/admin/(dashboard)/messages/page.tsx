export const dynamic = "force-dynamic";

import React from "react";
import { requirePermissionServer } from "@/lib/auth";
import MessagesAdminClient from "./MessagesAdminClient";

export default async function MessagesPage() {
  await requirePermissionServer("MESSAGES");
  return (
    <div className="container mx-auto">
      <MessagesAdminClient />
    </div>
  );
}