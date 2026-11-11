export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminRoleServer } from "@/lib/auth";
import AccountsAdminClient from "./AccountsAdminClient";

export default async function AccountsPage() {
  const session = await requireAdminRoleServer();
  return (
    <div className="container mx-auto">
      <AccountsAdminClient currentUserId={session.user.id} />
    </div>
  );
}