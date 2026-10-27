export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminServer } from "@/lib/auth";
import PasswordChangeForm from "./PasswordChangeForm";

export default async function PasswordPage() {
  await requireAdminServer();
  return (
    <div className="container mx-auto max-w-xl">
      <PasswordChangeForm />
    </div>
  );
}