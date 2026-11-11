import type { appointmentStatuses } from "@/lib/validations/appointment";
export type AppointmentStatus = (typeof appointmentStatuses)[number];
export type DoctorOption = { id: string; slug: string; name: { en: string; ar: string } };
export type ServiceOption = { slug: string; title: { en: string; ar: string } };
export type Reminder = { id: string; revision: number; channel: "EMAIL" | "WHATSAPP"; status: "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "CANCELLED"; scheduledAt: string; sentAt: string | null; deliveredAt: string | null; staffId: string | null; providerMessageId: string | null; attempts: number; error: string | null };
export type AppointmentAdmin = {
  id: string; patientName: string; patientPhone: string | null; patientEmail: string | null;
  scheduledAt: string; reminderRevision: number; durationMinutes: number; status: AppointmentStatus;
  notes: string | null; clinicalNotes: string | null; serviceSlug: string | null;
  emailReminderConsent: boolean; whatsappReminderConsent: boolean; locale: "ar" | "en";
  createdAt: string; updatedAt: string; doctor: DoctorOption | null;
  capabilities: { edit: boolean; contact: boolean; remind: boolean; assign: boolean; cancel: boolean; status: boolean };
  reminders: Reminder[];
  events: Array<{ id: string; action: string; createdAt: string; actor: string | null; changes: { fields?: string[]; fromStatus?: AppointmentStatus; toStatus?: AppointmentStatus; fromTime?: string; toTime?: string } | null }>;
};
export type AppointmentData = {
  items: AppointmentAdmin[]; total: number; page: number; pageSize: number;
  doctors: DoctorOption[]; services: ServiceOption[];
  capabilities: { create: boolean; assign: boolean; contact: boolean; status: boolean; reminders: boolean };
  reminderPage: number; reminderNextPage: number | null;
  needingReminders: Array<{ id: string; patientName: string; scheduledAt: string; whatsappUrl: string }>;
};
