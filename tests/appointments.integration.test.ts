import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID, createHmac } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { clinicTimeToIso, clinicDateInput, DAY_MS } from "../src/lib/appointments/time";
import type { AdminUserPublic } from "../src/lib/auth";

declare global { var __appointmentTestToken: string | undefined; }

test("appointment services and APIs against isolated PostgreSQL schema", { timeout: 120000 }, async t => {
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required for integration tests");
  const url = new URL(process.env.DATABASE_URL);
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname), "Integration tests only allow a local database");
  const schema = `appointment_test_${randomUUID().replaceAll("-", "")}`;
  const root = new PrismaClient();
  await root.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);
  url.searchParams.set("schema", schema);
  process.env.DATABASE_URL = url.toString();
  process.env.AUTH_ENABLED = "true";
  process.env.AUTH_SECRET = "appointment-test-only-secret-at-least-32-characters";
  process.env.APPOINTMENT_TEST_AUTH = "true";
  process.env.RESEND_API_KEY = "test-no-real-requests";
  process.env.RESEND_FROM_EMAIL = "Test <test@example.com>";
  const originalFetch = globalThis.fetch;
  try {
    execFileSync(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], { env: process.env, stdio: "pipe" });
    const { default: db } = await import("../src/lib/prisma");
    const { createAppointment, updateAppointment, listAppointments } = await import("../src/lib/services/appointment.service");
    const { processEmailReminders, appointmentsNeedingReminders, markWhatsAppReminder } = await import("../src/lib/services/appointment-reminder.service");
    const { signSession } = await import("../src/lib/auth");
    const route = await import("../src/app/api/admin/appointments/route");
    const webhook = await import("../src/app/api/webhooks/resend/route");
    const cron = await import("../src/app/api/cron/appointment-reminders/route");
    const accounts = await import("../src/app/api/admin/accounts/route");
    const category = await db.serviceCategory.create({ data: { slug: "test" } });
    await db.service.create({ data: { slug: "test-service", image: "/test.jpg", categoryId: category.id } });
    const d1 = await db.doctor.create({ data: { slug: "test-doctor-1" } });
    const d2 = await db.doctor.create({ data: { slug: "test-doctor-2" } });
    const staff = await db.adminUser.create({ data: { username: "test-doctor", passwordHash: "unused", doctorId: d1.id, permissions: ["APPOINTMENTS", "APPOINTMENTS_UPDATE_OWN", "APPOINTMENTS_STATUS"] } });
    const manager = await db.adminUser.create({ data: { username: "test-manager", passwordHash: "unused", role: "ADMIN" } });
    const user: AdminUserPublic = staff;
    const admin: AdminUserPublic = manager;
    const future = new Date(Date.now() + 3 * DAY_MS);
    while (new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Damascus", weekday: "long" }).format(future) === "Friday") future.setUTCDate(future.getUTCDate() + 1);
    const date = clinicDateInput(future).slice(0, 10);
    const at = (time: string) => clinicTimeToIso(`${date}T${time}`);
    const input = { patientName: "Test Patient", patientPhone: "+963944123456", patientEmail: "patient@example.com", scheduledAt: at("12:00"), serviceSlug: "test-service", doctorId: d1.id, emailReminderConsent: true, whatsappReminderConsent: true, locale: "ar" as const };
    const guest = await createAppointment(input);
    const id = guest.id;
    await t.test("guest bookings remain pending with no reminders before confirmation", async () => {
      assert.equal((await db.appointment.findUniqueOrThrow({ where: { id } })).status, "PENDING");
      assert.equal(await db.appointmentReminder.count(), 0);
      await assert.rejects(createAppointment({ ...input, doctorId: "invalid" }), /invalidDoctor/);
      await assert.rejects(createAppointment({ ...input, serviceSlug: "invalid" }), /invalidService/);
      await assert.rejects(createAppointment({ ...input, scheduledAt: at("08:00") }), /outsideHours/);
    });
    await t.test("ownership, contact redaction and privilege escalation enforced through APIs", async () => {
      globalThis.__appointmentTestToken = signSession({ uid: staff.id, role: "EDITOR" });
      const response = await route.GET(new Request("http://localhost/api/admin/appointments"));
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.equal(body.items[0].patientPhone, null);
      assert.equal(body.items[0].patientEmail, null);
      const other = await createAppointment({ ...input, doctorId: d2.id, patientPhone: "+963944123457" });
      const patch = (appointmentId: string, body: object) => route.PATCH(new Request(`http://localhost/api/admin/appointments?id=${appointmentId}`, { method: "PATCH", body: JSON.stringify(body) }));
      assert.equal((await patch(other.id, { clinicalNotes: "forbidden" })).status, 403);
      assert.equal((await patch(other.id, { status: "PENDING" })).status, 403);
      assert.equal((await patch(other.id, { doctorId: d1.id, clinicalNotes: "forged ownership" })).status, 403);
      assert.equal((await patch(id, { patientEmail: "steal@example.com" })).status, 403);
      assert.equal((await patch(id, { clinicalNotes: "authorized own notes" })).status, 200);
      assert.equal((await patch(id, { status: "CANCELLED" })).status, 403);
      assert.equal((await accounts.PATCH(new Request(`http://localhost/api/admin/accounts?id=${staff.id}`, { method: "PATCH", body: JSON.stringify({ role: "ADMIN" }) }))).status, 403);
      assert.equal((await cron.GET(new Request("http://localhost/api/cron/appointment-reminders"))).status, 401);
      assert.equal(route.DELETE().status, 405);
      await updateAppointment(other.id, { status: "CANCELLED" }, admin);
    });
    await t.test("simultaneous doctor bookings cannot overlap", async () => {
      const outcomes = await Promise.allSettled([
        createAppointment({ ...input, scheduledAt: at("14:00"), patientPhone: "+963944123458" }),
        createAppointment({ ...input, scheduledAt: at("14:15"), patientPhone: "+963944123459" }),
      ]);
      assert.equal(outcomes.filter(r => r.status === "fulfilled").length, 1);
      assert.equal(outcomes.filter(r => r.status === "rejected").length, 1);
    });
    await t.test("confirmation creates one reminder per channel and unchanged edits never duplicate", async () => {
      await updateAppointment(id, { status: "CONFIRMED" }, user);
      await updateAppointment(id, { patientEmail: input.patientEmail, notes: "admin note" }, admin);
      assert.equal(await db.appointmentReminder.count({ where: { appointmentId: id } }), 2);
      await assert.rejects(updateAppointment(id, { status: "COMPLETED" }, user), /tooEarly/);
      await assert.rejects(updateAppointment(id, { scheduledAt: at("08:00") }, admin), /outsideHours/);
    });
    await t.test("rescheduling cancels the old generation, cancellation retains records", async () => {
      await updateAppointment(id, { scheduledAt: at("13:00") }, admin);
      const reminders = await db.appointmentReminder.findMany({ where: { appointmentId: id } });
      assert.equal(reminders.length, 4);
      assert.equal(reminders.filter(r => r.status === "CANCELLED").length, 2);
      await updateAppointment(id, { status: "CANCELLED" }, admin);
      assert.equal(await db.appointmentReminder.count({ where: { appointmentId: id, status: "PENDING" } }), 0);
      assert.ok(await db.appointment.findUnique({ where: { id } }));
      await updateAppointment(id, { status: "PENDING" }, admin);
      await updateAppointment(id, { status: "CONFIRMED" }, admin);
      assert.equal(await db.appointmentReminder.count({ where: { appointmentId: id } }), 4);
    });
    // Near-term fixtures intentionally bypass booking-hours checks to exercise scheduler timing independent of the time tests are run.
    async function reminderFixture(phone: string, emailConsent = true) {
      const a = await db.appointment.create({ data: { patientName: "Reminder Test", patientPhone: phone, patientEmail: "test@example.com", emailReminderConsent: emailConsent, whatsappReminderConsent: true, scheduledAt: new Date(Date.now() + 3600000), status: "CONFIRMED", serviceSlug: "test-service" } });
      await db.appointmentReminder.createMany({ data: [
        ...(emailConsent ? [{ appointmentId: a.id, channel: "EMAIL" as const, revision: 0, scheduledAt: new Date(Date.now() - 60000) }] : []),
        { appointmentId: a.id, channel: "WHATSAPP" as const, revision: 0, scheduledAt: new Date(Date.now() - 60000) },
      ] });
      return a;
    }
    const email = await reminderFixture("+963944123460");
    let requests = 0;
    const providerKeys = new Set<string>();
    globalThis.fetch = async (_url, init) => {
      requests++;
      const key = new Headers(init?.headers).get("Idempotency-Key");
      assert.ok(key); providerKeys.add(key);
      const body = JSON.parse(String(init?.body));
      assert.ok(!body.text.includes("clinical"));
      return Response.json({ id: `provider-${key.split("/").pop()}` });
    };
    await t.test("concurrent cron workers send only once and record acceptance rather than delivery", async () => {
      await Promise.all([processEmailReminders(), processEmailReminders()]);
      const r = await db.appointmentReminder.findFirstOrThrow({ where: { appointmentId: email.id, channel: "EMAIL" } });
      assert.equal(r.status, "SENT"); assert.equal(r.deliveredAt, null); assert.equal(requests, 1); assert.equal(providerKeys.size, 1);
      await processEmailReminders(); assert.equal(requests, 1);
      assert.equal((await appointmentsNeedingReminders(admin)).items.some(a => a.id === email.id), false);
      const late = await reminderFixture("+963944123461", false);
      assert.equal((await appointmentsNeedingReminders(admin)).items.some(a => a.id === late.id), true);
      assert.deepEqual((await appointmentsNeedingReminders(user)).items, []);
      await assert.rejects(markWhatsAppReminder(late.id, false, user), /forbidden/);
      await markWhatsAppReminder(late.id, false, admin);
      await markWhatsAppReminder(late.id, false, admin);
      assert.equal((await db.appointmentReminder.findFirstOrThrow({ where: { appointmentId: late.id } })).attempts, 1);
      await markWhatsAppReminder(late.id, true, admin);
      assert.equal(await db.appointmentEvent.count({ where: { appointmentId: late.id } }), 2);
      assert.equal((await appointmentsNeedingReminders(admin)).items.some(a => a.id === late.id), false);
    });
    await t.test("delivery changes only after a valid signed webhook; duplicates and tampering are safe", async () => {
      const r = await db.appointmentReminder.findFirstOrThrow({ where: { appointmentId: email.id, channel: "EMAIL" } });
      const raw = JSON.stringify({ type: "email.delivered", created_at: new Date().toISOString(), data: { email_id: r.providerMessageId } });
      const secret = Buffer.from("appointment-test-webhook-signing-secret");
      process.env.RESEND_WEBHOOK_SECRET = `whsec_${secret.toString("base64")}`;
      const timestamp = String(Math.floor(Date.now() / 1000));
      const signature = createHmac("sha256", secret).update(`test-event.${timestamp}.${raw}`).digest("base64");
      const headers = { "svix-id": "test-event", "svix-timestamp": timestamp, "svix-signature": `v1,${signature}` };
      assert.equal((await webhook.POST(new Request("http://localhost/api/webhooks/resend", { method: "POST", headers, body: raw + " " }))).status, 401);
      for (let i = 0; i < 2; i++) assert.equal((await webhook.POST(new Request("http://localhost/api/webhooks/resend", { method: "POST", headers, body: raw }))).status, 200);
      assert.equal((await db.appointmentReminder.findUniqueOrThrow({ where: { id: r.id } })).status, "DELIVERED");
    });
    await t.test("failed sends retry with stable payload/key; cancellation prevents later sends", async () => {
      const a = await reminderFixture("+963944123462");
      globalThis.fetch = async () => new Response("unavailable", { status: 503 });
      await processEmailReminders();
      const r = await db.appointmentReminder.findFirstOrThrow({ where: { appointmentId: a.id, channel: "EMAIL" } });
      assert.equal(r.status, "FAILED"); assert.equal(r.error, "emailProvider_503"); assert.ok(r.nextAttemptAt);
      await db.appointmentReminder.update({ where: { id: r.id }, data: { nextAttemptAt: new Date(Date.now() - 1000) } });
      globalThis.fetch = async (_url, init) => {
        assert.equal(new Headers(init?.headers).get("Idempotency-Key"), `appointment-reminder/${r.id}`);
        assert.deepEqual(JSON.parse(String(init?.body)), r.payload);
        return Response.json({ id: "provider-retried" });
      };
      await processEmailReminders();
      assert.equal((await db.appointmentReminder.findUniqueOrThrow({ where: { id: r.id } })).status, "SENT");
      const cancel = await reminderFixture("+963944123463");
      await updateAppointment(cancel.id, { status: "CANCELLED" }, admin);
      globalThis.fetch = async () => { throw new Error("must not send cancelled reminder"); };
      assert.equal((await processEmailReminders()).processed, 0);
      await assert.rejects(markWhatsAppReminder(cancel.id, false, admin), /reminderIneligible/);
    });
    await t.test("consent revocation cancels pending reminders and expired retries never send", async () => {
      const a = await reminderFixture("+963944123464");
      await updateAppointment(a.id, { emailReminderConsent: false, whatsappReminderConsent: false }, admin);
      assert.equal(await db.appointmentReminder.count({ where: { appointmentId: a.id, status: "PENDING" } }), 0);
      assert.equal((await appointmentsNeedingReminders(admin)).items.some(r => r.id === a.id), false);
      await updateAppointment(a.id, { emailReminderConsent: true }, admin);
      const r = await db.appointmentReminder.findFirstOrThrow({ where: { appointmentId: a.id, channel: "EMAIL" } });
      assert.ok(Math.abs(r.scheduledAt.getTime() - Date.now()) < 10000);
      await db.appointmentReminder.update({ where: { id: r.id }, data: { firstAttemptAt: new Date(Date.now() - 24 * 3600000), attempts: 1 } });
      let sends = 0;
      globalThis.fetch = async () => { sends++; throw new Error("expired retries must not send"); };
      await processEmailReminders();
      assert.equal(sends, 0);
      assert.equal((await db.appointmentReminder.findUniqueOrThrow({ where: { id: r.id } })).error, "retryWindowExpired");
    });
    await t.test("clinical notes remain editable after the appointment starts", async () => {
      const a = await db.appointment.create({ data: { patientName: "Past appointment", patientPhone: "+963944123465", doctorId: d1.id, scheduledAt: new Date(Date.now() - 3600000), status: "CONFIRMED", serviceSlug: "test-service" } });
      await updateAppointment(a.id, { clinicalNotes: "Follow up", durationMinutes: 30 }, user);
      await updateAppointment(a.id, { status: "COMPLETED" }, user);
      await assert.rejects(updateAppointment(a.id, { status: "CANCELLED" }, admin), /invalidTransition/);
    });
    await t.test("database uniqueness prevents duplicate reminders", async () => {
      await assert.rejects(db.appointmentReminder.create({ data: { appointmentId: email.id, channel: "EMAIL", revision: 0, scheduledAt: new Date() } }));
      await assert.rejects(db.appointment.delete({ where: { id: email.id } }));
      const listing = await listAppointments({ page: 1, pageSize: 1, reminderPage: 1 }, admin);
      assert.equal(listing.items.length, 1); assert.ok(listing.total > 1);
    });
    await db.$disconnect();
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.__appointmentTestToken = undefined;
    await root.$executeRawUnsafe(`DROP SCHEMA "${schema}" CASCADE`);
    await root.$disconnect();
  }
});
