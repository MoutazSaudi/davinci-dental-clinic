import "server-only";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { AdminUserPublic } from "@/lib/auth";
import { can, canViewSchedule, canEditAppointment, validTransition } from "@/lib/appointments/policy";
import { clinicDateInput, CLINIC_TIMEZONE, normalizePhone, DAY_MS } from "@/lib/appointments/time";
import { geoData } from "@/data/seo";
import { syncReminders } from "./appointment-reminder.service";
import type { AppointmentInput, AdminAppointmentInput, AppointmentPatch } from "@/lib/validations/appointment";
import { appointmentQuerySchema } from "@/lib/validations/appointment";
import type { z } from "zod";

import { demand, lockAppointment } from "@/lib/appointments/server";

async function referencesAndAvailability(tx: Prisma.TransactionClient, data: {
  serviceSlug: string | null; doctorId: string | null; scheduledAt: Date; durationMinutes: number; status: string;
}, excludeId?: string) {
  if (data.serviceSlug) {
    demand(!!await tx.service.findFirst({ where: { slug: data.serviceSlug, status: "PUBLISHED" } }), "invalidService", 400);
  } else demand(!!excludeId, "invalidService", 400); // Legacy appointments may have no service.
  if (data.doctorId) {
    demand(!!await tx.doctor.findFirst({ where: { id: data.doctorId, status: "PUBLISHED" } }), "invalidDoctor", 400);
  }
  if (!["PENDING", "CONFIRMED"].includes(data.status)) return;
  demand(data.scheduledAt.getTime() > Date.now(), "futureDate", 400);
  const day = new Intl.DateTimeFormat("en-US", { timeZone: CLINIC_TIMEZONE, weekday: "long" }).format(data.scheduledAt);
  const hours = geoData.openingHours.find(h => (h.days as readonly string[]).includes(day));
  const start = clinicDateInput(data.scheduledAt);
  const end = clinicDateInput(new Date(data.scheduledAt.getTime() + data.durationMinutes * 60000));
  demand(!!hours && start.slice(0, 10) === end.slice(0, 10) && start.slice(11) >= hours.opens && end.slice(11) <= hours.closes, "outsideHours", 409);
  if (!data.doctorId) return;
  // All writes for a doctor's schedule serialize, including simultaneous guest requests.
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`doctor:${data.doctorId}`}))::text`;
  const conflicts = await tx.appointment.findMany({
    where: { doctorId: data.doctorId, status: { in: ["PENDING", "CONFIRMED"] },
      id: excludeId ? { not: excludeId } : undefined,
      scheduledAt: { lt: new Date(data.scheduledAt.getTime() + data.durationMinutes * 60000), gt: new Date(data.scheduledAt.getTime() - 480 * 60000) } },
    select: { scheduledAt: true, durationMinutes: true },
  });
  demand(!conflicts.some(a => a.scheduledAt.getTime() + a.durationMinutes * 60000 > data.scheduledAt.getTime()), "overlap", 409);
}

const include = { doctor: { include: { translations: true } }, reminders: { orderBy: { createdAt: "asc" as const } }, events: { orderBy: { createdAt: "desc" as const }, take: 30, include: { actor: { select: { name: true, username: true } } } } };
type FullAppointment = Prisma.AppointmentGetPayload<{ include: typeof include }>;
export function serializeAppointment(a: FullAppointment, user: AdminUserPublic) {
  const edit = canEditAppointment(user, a.doctorId);
  const contact = can(user, "APPOINTMENTS_CONTACT");
  const now = Date.now();
  const remind = can(user, "APPOINTMENTS_REMIND") && contact && a.status === "CONFIRMED" && a.whatsappReminderConsent && !!normalizePhone(a.patientPhone) && a.scheduledAt.getTime() > now && a.scheduledAt.getTime() <= now + DAY_MS;
  return {
    id: a.id, patientName: a.patientName,
    patientPhone: contact ? a.patientPhone : null, patientEmail: contact ? a.patientEmail : null,
    scheduledAt: a.scheduledAt.toISOString(), reminderRevision: a.reminderRevision, durationMinutes: a.durationMinutes, status: a.status,
    notes: edit ? a.notes : null, clinicalNotes: edit ? a.clinicalNotes : null,
    emailReminderConsent: contact ? a.emailReminderConsent : false,
    whatsappReminderConsent: contact ? a.whatsappReminderConsent : false,
    locale: a.locale, serviceSlug: a.serviceSlug, createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString(),
    doctor: a.doctor ? { id: a.doctor.id, slug: a.doctor.slug, name: {
      en: a.doctor.translations.find(t => t.locale === "en")?.name ?? a.doctor.translations[0]?.name ?? "",
      ar: a.doctor.translations.find(t => t.locale === "ar")?.name ?? a.doctor.translations[0]?.name ?? "",
    } } : null,
    capabilities: { edit, contact, remind, assign: can(user, "APPOINTMENTS_ASSIGN"), cancel: can(user, "APPOINTMENTS_CANCEL"), status: edit && can(user, "APPOINTMENTS_STATUS") },
    reminders: contact ? a.reminders.map(r => ({ id: r.id, revision: r.revision, channel: r.channel, status: r.status, scheduledAt: r.scheduledAt, sentAt: r.sentAt, deliveredAt: r.deliveredAt, attempts: r.attempts, error: r.error, staffId: r.staffId, providerMessageId: r.providerMessageId })) : [],
    events: edit ? a.events.map(e => ({ id: e.id, action: e.action, changes: e.changes, createdAt: e.createdAt, actor: e.actor?.name || e.actor?.username || null })) : [],
  };
}

export async function createAppointment(input: AppointmentInput | AdminAppointmentInput, user?: AdminUserPublic) {
  const adminInput = "status" in input ? input : null;
  if (user) {
    demand(can(user, "APPOINTMENTS_CREATE"));
    if (input.doctorId) demand(can(user, "APPOINTMENTS_ASSIGN"));
    if (adminInput?.status === "CONFIRMED") demand(can(user, "APPOINTMENTS_STATUS"));
    if (adminInput?.clinicalNotes) demand(can(user, "APPOINTMENTS_UPDATE_ANY") || (!!user.doctorId && user.doctorId === input.doctorId && can(user, "APPOINTMENTS_UPDATE_OWN")));
  }
  return prisma.$transaction(async tx => {
    const data = { ...input, patientPhone: `+${normalizePhone(input.patientPhone)}`, scheduledAt: new Date(input.scheduledAt), doctorId: input.doctorId || null, patientEmail: input.patientEmail || null, durationMinutes: adminInput?.durationMinutes ?? 30, status: adminInput?.status ?? "PENDING" as const };
    await referencesAndAvailability(tx, data);
    // Debounce identical guest requests under a database lock (no in-process rate-limit assumptions).
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`booking:${data.patientPhone}`}))::text`;
    if (!user) {
      const recentCount = await tx.appointment.count({ where: { patientPhone: data.patientPhone, createdAt: { gt: new Date(Date.now() - 15 * 60000) } } });
      demand(recentCount < 5, "rateLimited", 429);
    }
    const duplicate = await tx.appointment.findFirst({ where: { patientPhone: data.patientPhone, scheduledAt: data.scheduledAt, status: { in: ["PENDING", "CONFIRMED"] } } });
    demand(!duplicate, "duplicate", 409);
    const appointment = await tx.appointment.create({ data });
    await tx.appointmentEvent.create({ data: { appointmentId: appointment.id, actorId: user?.id === "dev" ? null : user?.id, action: user ? "CREATED" : "REQUESTED" } });
    await syncReminders(tx, appointment);
    if (!user) return { id: appointment.id };
    return serializeAppointment(await tx.appointment.findUniqueOrThrow({ where: { id: appointment.id }, include }), user);
  });
}

export async function updateAppointment(id: string, input: AppointmentPatch, user: AdminUserPublic) {
  return prisma.$transaction(async tx => {
    await lockAppointment(tx, id);
    const current = await tx.appointment.findUnique({ where: { id } });
    demand(!!current, "notFound", 404);
    const keys = Object.keys(input);
    // Ownership comes exclusively from the persisted appointment and authenticated account.
    if (keys.some(k => !["doctorId", "status"].includes(k))) demand(canEditAppointment(user, current.doctorId));
    if (input.doctorId !== undefined) demand(can(user, "APPOINTMENTS_ASSIGN"));
    if (keys.some(k => ["patientPhone", "patientEmail", "emailReminderConsent", "whatsappReminderConsent"].includes(k))) demand(can(user, "APPOINTMENTS_CONTACT"));
    if (input.status !== undefined) {
      demand(validTransition(current.status, input.status), "invalidTransition", 409);
      if (input.status === "CANCELLED") demand(can(user, "APPOINTMENTS_CANCEL"));
      else demand(canEditAppointment(user, current.doctorId) && can(user, "APPOINTMENTS_STATUS"));
      if (["COMPLETED", "NO_SHOW"].includes(input.status)) demand(current.scheduledAt.getTime() <= Date.now(), "tooEarly", 409);
    }
    if (input.patientPhone) input = { ...input, patientPhone: `+${normalizePhone(input.patientPhone)}` };
    const next = { ...current, ...input, patientEmail: input.patientEmail === "" ? null : input.patientEmail ?? current.patientEmail, scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : current.scheduledAt };
    const schedulingChanged = next.scheduledAt.getTime() !== current.scheduledAt.getTime() || next.doctorId !== current.doctorId || next.durationMinutes !== current.durationMinutes || next.serviceSlug !== current.serviceSlug || (input.status !== undefined && input.status !== current.status && ["PENDING", "CONFIRMED"].includes(input.status));
    if (schedulingChanged) await referencesAndAvailability(tx, next, id);
    const revisionChanged = next.scheduledAt.getTime() !== current.scheduledAt.getTime() || next.patientEmail !== current.patientEmail;
    const updated = await tx.appointment.update({ where: { id }, data: { ...input, scheduledAt: next.scheduledAt, patientEmail: next.patientEmail, reminderRevision: revisionChanged ? { increment: 1 } : undefined } });
    await syncReminders(tx, updated);
    await tx.appointmentEvent.create({ data: { appointmentId: id, actorId: user.id === "dev" ? null : user.id, action: "UPDATED", changes: { fields: keys, ...(input.status ? { fromStatus: current.status, toStatus: updated.status } : {}), ...(input.scheduledAt ? { fromTime: current.scheduledAt.toISOString(), toTime: updated.scheduledAt.toISOString() } : {}) } } });
    return serializeAppointment(await tx.appointment.findUniqueOrThrow({ where: { id }, include }), user);
  }, { maxWait: 10000, timeout: 20000 });
}

export async function listAppointments(query: z.infer<typeof appointmentQuerySchema>, user: AdminUserPublic) {
  demand(canViewSchedule(user));
  const where: Prisma.AppointmentWhereInput = {
    doctorId: query.doctorId, status: query.status,
    patientName: query.patient ? { contains: query.patient, mode: "insensitive" } : undefined,
    scheduledAt: query.from || query.to ? { gte: query.from ? new Date(query.from) : undefined, lt: query.to ? new Date(query.to) : undefined } : undefined,
  };
  const [items, total] = await prisma.$transaction([
    prisma.appointment.findMany({ where, include, orderBy: [{ scheduledAt: "asc" }, { id: "asc" }], skip: (query.page - 1) * query.pageSize, take: query.pageSize }),
    prisma.appointment.count({ where }),
  ]);
  return { items: items.map(a => serializeAppointment(a, user)), total, page: query.page, pageSize: query.pageSize };
}
