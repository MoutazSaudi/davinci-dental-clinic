import { appointmentSchema } from "@/lib/validations/appointment";
import { createAppointment } from "@/lib/services/appointment.service";
import { appointmentResponse, appointmentFailure } from "@/lib/appointments/http";
export async function POST(req: Request) {
  try {
    const data = await createAppointment(appointmentSchema.parse(await req.json()));
    return appointmentResponse({ success: true, message: "Appointment request received. Staff will review and confirm it.", data: { id: data.id } }, 201);
  } catch (error) { return appointmentFailure(error); }
}
