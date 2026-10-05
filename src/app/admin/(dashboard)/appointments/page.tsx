import React from "react";
import AppointmentsAdminClient from "./AppointmentsAdminClient";

export default async function AppointmentsPage() {
  // يمكنك جلب البيانات الأولية هنا إن وجدت أو تركها لتجلببها مكون العميل
  const initial: any[] = []; 

  return (
    <div className="container mx-auto">
      <AppointmentsAdminClient initial={initial} />
    </div>
  );
}