export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminServer } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await requireAdminServer();
  return (
      <SettingsClient user={session.user} />
  );
}
