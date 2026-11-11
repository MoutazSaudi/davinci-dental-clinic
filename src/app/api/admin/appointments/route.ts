export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/lib/auth";
import { can } from "@/lib/appointments/policy";
import { appointmentResponse, appointmentFailure } from "@/lib/appointments/http";
import { adminAppointmentSchema, appointmentPatchSchema, appointmentQuerySchema } from "@/lib/validations/appointment";
import { createAppointment, listAppointments, updateAppointment } from "@/lib/services/appointment.service";
import { appointmentsNeedingReminders } from "@/lib/services/appointment-reminder.service";
import { demand } from "@/lib/appointments/server";
import { getDoctorsForSelect, getServicesForSelect } from "@/lib/services/select";

export async function GET(req: Request) {
  const auth = await requirePermissionApi("APPOINTMENTS");
  if (auth instanceof NextResponse) return auth;
  try {
    const query = appointmentQuerySchema.parse(Object.fromEntries(new URL(req.url).searchParams));
    const [data, doctors, services, needingReminders] = await Promise.all([
      listAppointments(query, auth.user), getDoctorsForSelect(), getServicesForSelect(), appointmentsNeedingReminders(auth.user, new Date(), query.reminderPage),
    ]);
    return appointmentResponse({ ...data, doctors, services, needingReminders: needingReminders.items, reminderPage: needingReminders.page, reminderNextPage: needingReminders.nextPage, capabilities: {
      create: can(auth.user, "APPOINTMENTS_CREATE"), assign: can(auth.user, "APPOINTMENTS_ASSIGN"),
      contact: can(auth.user, "APPOINTMENTS_CONTACT"), status: can(auth.user, "APPOINTMENTS_STATUS"),
      reminders: can(auth.user, "APPOINTMENTS_REMIND") && can(auth.user, "APPOINTMENTS_CONTACT"),
    } });
  } catch (error) { return appointmentFailure(error); }
}
export async function POST(req: Request) {
  const auth = await requirePermissionApi("APPOINTMENTS");
  if (auth instanceof NextResponse) return auth;
  try { return appointmentResponse(await createAppointment(adminAppointmentSchema.parse(await req.json()), auth.user), 201); }
  catch (error) { return appointmentFailure(error); }
}
export async function PATCH(req: Request) {
  const auth = await requirePermissionApi("APPOINTMENTS");
  if (auth instanceof NextResponse) return auth;
  try {
    const id = new URL(req.url).searchParams.get("id"); demand(!!id && id.length <= 100, "invalidInput", 400);
    return appointmentResponse(await updateAppointment(id, appointmentPatchSchema.parse(await req.json()), auth.user));
  } catch (error) { return appointmentFailure(error); }
}
// Appointment history is retained. Cancellation is a permission-checked PATCH.
export function DELETE() { return appointmentResponse({ error: "Use cancellation instead." }, 405); }
