import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifyResendSignature } from "@/lib/integrations/email/resend";
import { appointmentResponse, appointmentFailure } from "@/lib/appointments/http";
const eventSchema = z.object({ type: z.string(), created_at: z.string().datetime({ offset: true }), data: z.object({ email_id: z.string().min(1) }) });
export async function POST(req: Request) {
  try {
    const raw = await req.text();
    if (!verifyResendSignature(raw, req.headers)) return appointmentResponse({ error: "invalidSignature" }, 401);
    const event = eventSchema.parse(JSON.parse(raw));
    if (!["email.delivered", "email.bounced", "email.failed", "email.complained"].includes(event.type)) return appointmentResponse({ ok: true });
    const r = await prisma.appointmentReminder.findUnique({ where: { providerMessageId: event.data.email_id } });
    // Includes unrelated messages on the same Resend account. A short retry covers an event arriving before the send transaction commits.
    if (!r) return appointmentResponse({ error: "messageNotRecorded" }, 503);
    if (event.type === "email.delivered") {
      await prisma.appointmentReminder.updateMany({ where: { id: r.id, status: "SENT" }, data: { status: "DELIVERED", deliveredAt: new Date(event.created_at) } });
    } else {
      await prisma.appointmentReminder.updateMany({ where: { id: r.id, status: { in: ["SENT", "DELIVERED"] } }, data: { status: "FAILED", error: event.type } });
    }
    return appointmentResponse({ ok: true });
  } catch (error) { return appointmentFailure(error); }
}
