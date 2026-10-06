export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminServer } from "@/lib/auth";
import MessagesAdminClient from "./MessagesAdminClient";

export default async function MessagesPage() {
  await requireAdminServer();

  const initial = [];

  return (
    <div className="container mx-auto">
      <MessagesAdminClient initial={initial} />
    </div>
  );
}
