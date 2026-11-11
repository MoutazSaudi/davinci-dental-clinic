import { timingSafeEqual } from "node:crypto";
import { appointmentResponse, appointmentFailure } from "@/lib/appointments/http";
import { processEmailReminders } from "@/lib/services/appointment-reminder.service";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!secret || Buffer.byteLength(auth) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(auth), Buffer.from(expected))) return appointmentResponse({ error: "unauthorized" }, 401);
  try { return appointmentResponse(await processEmailReminders()); }
  catch (error) { return appointmentFailure(error); }
}
