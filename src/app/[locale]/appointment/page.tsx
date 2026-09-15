import React from "react";

export default async function AppointmentPage({ params }: { params: Promise<{ locale: string }> }) {
  void params;
  return (
    <div>
      <h1 className="text-2xl font-semibold">Appointment</h1>
      <p>Appointment booking UI will be implemented later.</p>
    </div>
  );
}
