export const dynamic = "force-dynamic";

import React from "react";
import { redirect } from "next/navigation";
import { requireAdminServer, getDefaultAdminRoute } from "@/lib/auth";
import FirstLoginClient from "./FirstLoginClient";

export default async function FirstLoginPage() {
  const session = await requireAdminServer();

  // If the user has already set a password, no need to see this page.
  if (!session.user.mustChangePassword) {
    redirect(getDefaultAdminRoute(session.user));
  }

  const redirectTo = getDefaultAdminRoute(session.user);

  return (
    <FirstLoginClient
      username={session.user.username}
      redirectTo={redirectTo}
    />
  );
}