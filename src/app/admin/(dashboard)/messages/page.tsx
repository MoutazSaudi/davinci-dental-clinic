export const dynamic = "force-dynamic";

import React from "react";
import { requireAdminServer } from "@/lib/auth";
import MessagesAdminClient from "./MessagesAdminClient";

// استخراج نوع العنصر من props المكوّن MessagesAdminClient
type Message = React.ComponentProps<typeof MessagesAdminClient>["initial"][number];

export default async function MessagesPage() {
  await requireAdminServer();

  const initial: Message[] = [];

  return (
    <div className="container mx-auto">
      <MessagesAdminClient initial={initial} />
    </div>
  );
}