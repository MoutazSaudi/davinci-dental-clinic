import "server-only";
import { randomUUID } from "node:crypto";
import { Prisma, type Appointment } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";
import type { AdminUserPublic } from "@/lib/auth";
import { can } from "@/lib/appointments/policy";
import { DAY_MS, normalizePhone, reminderTime } from "@/lib/appointments/time";
import { whatsappReminderUrl } from "@/lib/appointments/whatsapp";
import { demand, lockAppointment } from "@/lib/appointments/server";
import { reminderEmail, sendReminderEmail, emailPayloadSchema } from "@/lib/integrations/email/resend";

export async function syncReminders(tx: Prisma.TransactionClient, a: Appointment, now = new Date()) {
  await tx.appointmentReminder.updateMany({
    where: { appointmentId: a.id, status: { in: ["PENDING", "FAILED"] }, ...(a.status !== "CONFIRMED" || a.scheduledAt <= now ? {} : { OR: [
      { revision: { not: a.reminderRevision } },
      ...(!a.emailReminderConsent || !a.patientEmail ? [{ channel: "EMAIL" as const }] : []),
      ...(!a.whatsappReminderConsent || !normalizePhone(a.patientPhone) ? [{ channel: "WHATSAPP" as const }] : []),
    ] }) },
    data: { status: "CANCELLED", lockedUntil: null, leaseToken: null },
  });
  if (a.status !== "CONFIRMED" || a.scheduledAt <= now) return;
  const channels = [
    ...(a.emailReminderConsent && a.patientEmail && z.string().email().safeParse(a.patientEmail).success ? ["EMAIL" as const] : []),
    ...(a.whatsappReminderConsent && normalizePhone(a.patientPhone) ? ["WHATSAPP" as const] : []),
  ];
  for (const channel of channels) {
    await tx.appointmentReminder.upsert({
      where: { appointmentId_channel_revision: { appointmentId: a.id, channel, revision: a.reminderRevision } },
      create: { appointmentId: a.id, channel, revision: a.reminderRevision, scheduledAt: reminderTime(a.scheduledAt, now) }, update: {},
    });
    await tx.appointmentReminder.updateMany({
      where: { appointmentId: a.id, channel, revision: a.reminderRevision, status: "CANCELLED", providerMessageId: null, sentAt: null },
      data: { status: "PENDING", scheduledAt: reminderTime(a.scheduledAt, now) },
    });
  }
}

export async function processEmailReminders(now = new Date()) {
  demand(!!process.env.RESEND_API_KEY && !!process.env.RESEND_FROM_EMAIL, "emailNotConfigured", 503);
  // Expired records stay in history and can never be sent late.
  await prisma.appointmentReminder.updateMany({ where: { status: { in: ["PENDING", "FAILED"] }, appointment: { scheduledAt: { lte: now } } }, data: { status: "CANCELLED" } });
  const due = await prisma.appointmentReminder.findMany({
    where: { channel: "EMAIL", status: { in: ["PENDING", "FAILED"] }, providerMessageId: null, scheduledAt: { lte: now },
      AND: [{ OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }] }, { OR: [{ lockedUntil: null }, { lockedUntil: { lte: now } }] }], attempts: { lt: 5 } },
    orderBy: { scheduledAt: "asc" }, take: 20, select: { id: true, appointmentId: true },
  });
  let sent = 0;
  let failed = 0;
  for (const candidate of due) {
    // Persist a frozen request and attempt before contacting the provider. A crash can safely retry the same key/body.
    const lease = await prisma.$transaction(async tx => {
      await lockAppointment(tx, candidate.appointmentId);
      const r = await tx.appointmentReminder.findUniqueOrThrow({ where: { id: candidate.id }, include: { appointment: true } });
      const a = r.appointment;
      const currentTime = new Date();
      if (!["PENDING", "FAILED"].includes(r.status) || r.providerMessageId || r.attempts >= 5 || (r.lockedUntil && r.lockedUntil > currentTime) || (r.nextAttemptAt && r.nextAttemptAt > currentTime)) return null;
      if (a.status !== "CONFIRMED" || a.scheduledAt <= currentTime || a.reminderRevision !== r.revision || !a.emailReminderConsent || !a.patientEmail) {
        await tx.appointmentReminder.update({ where: { id: r.id }, data: { status: "CANCELLED" } }); return null;
      }
      // Resend retains idempotency keys for 24 hours. Never retry an ambiguous send outside that window.
      if (r.firstAttemptAt && currentTime.getTime() - r.firstAttemptAt.getTime() >= 23 * 60 * 60 * 1000) {
        await tx.appointmentReminder.update({ where: { id: r.id }, data: { status: "FAILED", attempts: 5, error: "retryWindowExpired" } }); return null;
      }
      const payload = r.payload ? emailPayloadSchema.parse(r.payload) : reminderEmail(a.patientEmail, a.scheduledAt, a.locale);
      const token = randomUUID();
      await tx.appointmentReminder.update({ where: { id: r.id }, data: { payload, firstAttemptAt: r.firstAttemptAt ?? currentTime, attempts: { increment: 1 }, leaseToken: token, lockedUntil: new Date(currentTime.getTime() + 120000) } });
      return token;
    });
    if (!lease) continue;
    await prisma.$transaction(async tx => {
      // Mutations use the same lock: cancellation/rescheduling cannot race a send in progress.
      await lockAppointment(tx, candidate.appointmentId);
      const r = await tx.appointmentReminder.findUniqueOrThrow({ where: { id: candidate.id }, include: { appointment: true } });
      if (r.leaseToken !== lease || !["PENDING", "FAILED"].includes(r.status)) return;
      if (r.appointment.status !== "CONFIRMED" || !r.appointment.emailReminderConsent || r.appointment.reminderRevision !== r.revision || r.appointment.scheduledAt <= new Date()) {
        await tx.appointmentReminder.update({ where: { id: r.id }, data: { status: "CANCELLED", lockedUntil: null, leaseToken: null } }); return;
      }
      try {
        const providerMessageId = await sendReminderEmail(r.id, emailPayloadSchema.parse(r.payload));
        await tx.appointmentReminder.update({ where: { id: r.id }, data: { status: "SENT", sentAt: new Date(), providerMessageId, error: null, lockedUntil: null, leaseToken: null } }); sent++;
      } catch (error) {
        const safeError = error instanceof Error && /^emailProvider_\d+$/.test(error.message) ? error.message : "emailSendFailed";
        await tx.appointmentReminder.update({ where: { id: r.id }, data: { status: "FAILED", error: safeError, lockedUntil: null, leaseToken: null, nextAttemptAt: new Date(Date.now() + Math.min(60, 5 * 2 ** (r.attempts - 1)) * 60000) } }); failed++;
      }
    }, { timeout: 25000 });
  }
  return { processed: due.length, sent, failed };
}

export async function appointmentsNeedingReminders(user: AdminUserPublic, now = new Date(), page = 1) {
  const empty = { items: [], page, nextPage: null };
  if (!can(user, "APPOINTMENTS_REMIND") || !can(user, "APPOINTMENTS_CONTACT")) return empty;
  // Correlate reminders to the current revision before paginating so old sent reminders
  // and already-reminded appointments cannot hide eligible patients on later pages.
  const items = await prisma.$queryRaw<Array<{ id: string; patientName: string; scheduledAt: Date; phone: string }>>`
    WITH candidates AS (
      SELECT a."id", a."patientName", a."scheduledAt",
        regexp_replace(a."patientPhone", '[^0-9]', '', 'g') AS digits
      FROM "Appointment" a
      WHERE a."status" = 'CONFIRMED' AND a."whatsappReminderConsent" = true
        AND a."scheduledAt" > ${now} AND a."scheduledAt" <= ${new Date(now.getTime() + DAY_MS)}
        AND a."patientPhone" ~ '^[+0-9[:space:]().-]+$'
        AND NOT EXISTS (
          SELECT 1 FROM "AppointmentReminder" r
          WHERE r."appointmentId" = a."id" AND r."revision" = a."reminderRevision"
            AND r."status" IN ('SENT', 'DELIVERED')
        )
    ), normalized AS (
      SELECT "id", "patientName", "scheduledAt",
        CASE WHEN digits LIKE '00%' THEN substring(digits FROM 3)
          WHEN digits LIKE '0%' THEN '963' || substring(digits FROM 2)
          WHEN digits ~ '^9[0-9]{8}$' THEN '963' || digits
          ELSE digits END AS phone
      FROM candidates
    )
    SELECT * FROM normalized WHERE phone ~ '^[1-9][0-9]{7,14}$'
    ORDER BY "scheduledAt", "id" LIMIT 21 OFFSET ${(page - 1) * 20}
  `;
  return {
    page, nextPage: items.length > 20 ? page + 1 : null,
    items: items.slice(0, 20).map(a => {
      return { id: a.id, patientName: a.patientName, scheduledAt: a.scheduledAt.toISOString(), whatsappUrl: whatsappReminderUrl(a.phone, a.scheduledAt) ?? "" };
    }),
  };
}

export async function markWhatsAppReminder(id: string, retry: boolean, user: AdminUserPublic) {
  demand(can(user, "APPOINTMENTS_REMIND") && can(user, "APPOINTMENTS_CONTACT"));
  return prisma.$transaction(async tx => {
    await lockAppointment(tx, id);
    const a = await tx.appointment.findUnique({ where: { id }, include: { reminders: true } });
    demand(!!a, "notFound", 404);
    demand(a.status === "CONFIRMED" && a.whatsappReminderConsent && !!normalizePhone(a.patientPhone) && a.scheduledAt > new Date() && a.scheduledAt.getTime() <= Date.now() + DAY_MS, "reminderIneligible", 409);
    const existing = a.reminders.find(r => r.channel === "WHATSAPP" && r.revision === a.reminderRevision);
    if (!retry && existing && ["SENT", "DELIVERED"].includes(existing.status)) return { ok: true };
    demand(!retry || !!existing?.sentAt, "reminderIneligible", 409);
    await tx.appointmentReminder.upsert({ where: { appointmentId_channel_revision: { appointmentId: id, channel: "WHATSAPP", revision: a.reminderRevision } },
      create: { appointmentId: id, channel: "WHATSAPP", revision: a.reminderRevision, scheduledAt: new Date(), status: "SENT", sentAt: new Date(), staffId: user.id === "dev" ? null : user.id, attempts: 1 },
      update: { status: "SENT", sentAt: new Date(), staffId: user.id === "dev" ? null : user.id, attempts: { increment: 1 }, error: null } });
    await tx.appointmentEvent.create({ data: { appointmentId: id, actorId: user.id === "dev" ? null : user.id, action: retry ? "WHATSAPP_RETRIED" : "WHATSAPP_MARKED_SENT" } });
    return { ok: true };
  });
}
