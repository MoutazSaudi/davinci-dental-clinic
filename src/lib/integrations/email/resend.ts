import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { formatClinicTime } from "@/lib/appointments/time";

export const emailPayloadSchema = z.object({ from: z.string(), to: z.array(z.string().email()), subject: z.string(), text: z.string() });
export function reminderEmail(to: string, scheduledAt: Date, locale: string) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from || !process.env.RESEND_API_KEY) throw new Error("emailNotConfigured");
  const time = formatClinicTime(scheduledAt, locale === "en" ? "en" : "ar");
  return { from, to: [to], subject: locale === "en" ? "Appointment reminder" : "تذكير بالموعد",
    text: locale === "en" ? `This is a reminder of your appointment on ${time} (Damascus time). Please contact the clinic if you need to reschedule.` : `تذكير بموعدكم بتاريخ ${time} بتوقيت دمشق. يرجى التواصل مع العيادة عند الحاجة لتغيير الموعد.` };
}
export async function sendReminderEmail(id: string, payload: z.infer<typeof emailPayloadSchema>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `appointment-reminder/${id}` },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(10000),
  });
  // Never persist provider response bodies: they can contain recipient data or credentials.
  if (!response.ok) throw new Error(`emailProvider_${response.status}`);
  const result = z.object({ id: z.string().min(1) }).parse(await response.json());
  return result.id;
}
export function verifyResendSignature(body: string, headers: Headers, now = Date.now()) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signatures = headers.get("svix-signature");
  if (!secret || !id || !timestamp || !signatures || !/^\d+$/.test(timestamp) || Math.abs(now / 1000 - Number(timestamp)) > 300) return false;
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  return signatures.split(" ").some(sig => {
    const [version, value] = sig.split(",");
    if (version !== "v1" || !value) return false;
    const actual = Buffer.from(value, "base64");
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  });
}
