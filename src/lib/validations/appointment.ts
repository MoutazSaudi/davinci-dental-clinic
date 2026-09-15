import { z } from "zod";

export const appointmentSchema = z.object({
  patientName: z.string().min(1),
  patientPhone: z.string().min(5),
  scheduledAt: z.string(),
  notes: z.string().optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
