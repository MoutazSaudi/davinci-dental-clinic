import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePermissionApi } from "@/lib/auth";
import { appointmentResponse, appointmentFailure } from "@/lib/appointments/http";
import { markWhatsAppReminder } from "@/lib/services/appointment-reminder.service";
const schema = z.object({ id: z.string().min(1).max(100), retry: z.boolean().default(false) }).strict();
export async function POST(req: Request) {
  const auth = await requirePermissionApi("APPOINTMENTS");
  if (auth instanceof NextResponse) return auth;
  try { const data = schema.parse(await req.json()); return appointmentResponse(await markWhatsAppReminder(data.id, data.retry, auth.user)); }
  catch (error) { return appointmentFailure(error); }
}
