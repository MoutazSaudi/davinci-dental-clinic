import { z } from "zod";
import { normalizePhone } from "@/lib/appointments/time";

export const appointmentStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"] as const;
const futureDate = z.string().datetime({ offset: true }).refine(v => Date.parse(v) > Date.now(), "futureDate");
const fields = {
  patientName: z.string().trim().min(2, "patientName").max(150),
  patientPhone: z.string().trim().max(40).refine(v => normalizePhone(v) !== null, "patientPhone"),
  patientEmail: z.string().trim().max(254).email("patientEmail").or(z.literal("")).optional(),
  scheduledAt: futureDate,
  serviceSlug: z.string().trim().min(1, "serviceSlug").max(200),
  doctorId: z.string().trim().min(1).max(100).nullable().optional(),
  notes: z.string().trim().max(5000).optional(),
  emailReminderConsent: z.boolean().default(false),
  whatsappReminderConsent: z.boolean().default(false),
  locale: z.enum(["ar", "en"]).default("ar"),
};
// Unknown account IDs or privileged fields are rejected; this project has no patient accounts.
export const appointmentSchema = z.object(fields).strict();
export const adminAppointmentSchema = z.object({
  ...fields,
  durationMinutes: z.number().int().min(5).max(480).default(30),
  status: z.enum(["PENDING", "CONFIRMED"]).default("PENDING"),
  clinicalNotes: z.string().trim().max(10000).optional(),
}).strict();
export const appointmentPatchSchema = z.object({
  patientName: fields.patientName.optional(),
  patientPhone: fields.patientPhone.optional(),
  patientEmail: fields.patientEmail,
  scheduledAt: futureDate.optional(),
  serviceSlug: fields.serviceSlug.optional(),
  doctorId: fields.doctorId,
  notes: fields.notes,
  clinicalNotes: z.string().trim().max(10000).optional(),
  durationMinutes: z.number().int().min(5).max(480).optional(),
  status: z.enum(appointmentStatuses).optional(),
  // Consent changes are accepted only with contact + appointment update permissions.
  emailReminderConsent: z.boolean().optional(),
  whatsappReminderConsent: z.boolean().optional(),
  locale: z.enum(["ar", "en"]).optional(),
}).strict().refine(v => Object.keys(v).length > 0);
export const appointmentQuerySchema = z.object({
  doctorId: z.string().max(100).optional(),
  status: z.enum(appointmentStatuses).optional(),
  patient: z.string().trim().max(150).optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  reminderPage: z.coerce.number().int().min(1).max(1000000).default(1),
  page: z.coerce.number().int().min(1).max(1000000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type AdminAppointmentInput = z.infer<typeof adminAppointmentSchema>;
export type AppointmentPatch = z.infer<typeof appointmentPatchSchema>;
