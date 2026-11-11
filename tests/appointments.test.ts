import { test } from "node:test";
import assert from "node:assert/strict";
import { can, canEditAppointment, canViewSchedule, validTransition } from "../src/lib/appointments/policy";
import { clinicDateInput, clinicTimeToIso, reminderTime, normalizePhone, DAY_MS } from "../src/lib/appointments/time";
import { appointmentSchema, appointmentPatchSchema } from "../src/lib/validations/appointment";
import { whatsappReminderUrl } from "../src/lib/appointments/whatsapp";
import type { AdminUserPublic } from "../src/lib/auth";
const doctor: AdminUserPublic = { id: "staff", username: "staff", name: null, role: "EDITOR", permissions: ["APPOINTMENTS", "APPOINTMENTS_UPDATE_OWN", "APPOINTMENTS_STATUS"], doctorId: "doctor-a", isActive: true, mustChangePassword: false };

test("shared schedules do not grant editing another doctor's appointment", () => {
  assert.equal(canViewSchedule(doctor), true);
  assert.equal(canEditAppointment(doctor, "doctor-a"), true);
  assert.equal(canEditAppointment(doctor, "doctor-b"), false);
  assert.equal(canEditAppointment(doctor, null), false);
  assert.equal(can(doctor, "APPOINTMENTS_CONTACT"), false);
  assert.equal(canEditAppointment({ ...doctor, doctorId: null }, "doctor-a"), false);
  assert.equal(canViewSchedule({ ...doctor, doctorId: null }), false);
  assert.equal(canEditAppointment({ ...doctor, permissions: ["APPOINTMENTS_UPDATE_ANY"] }, "doctor-b"), true);
  assert.equal(canEditAppointment({ ...doctor, role: "ADMIN", permissions: [] }, null), true);
});
test("status transitions retain completed appointments and require review when rebooking", () => {
  assert.equal(validTransition("PENDING", "CONFIRMED"), true);
  assert.equal(validTransition("PENDING", "COMPLETED"), false);
  assert.equal(validTransition("CONFIRMED", "NO_SHOW"), true);
  assert.equal(validTransition("COMPLETED", "PENDING"), false);
  assert.equal(validTransition("CANCELLED", "CONFIRMED"), false);
  assert.equal(validTransition("CANCELLED", "PENDING"), true);
});
test("Damascus wall time crosses UTC day/year boundaries without depending on host timezone", () => {
  assert.equal(clinicTimeToIso("2027-01-01T00:30"), "2026-12-31T21:30:00.000Z");
  assert.equal(clinicDateInput(new Date("2026-12-31T21:30:00Z")), "2027-01-01T00:30");
  assert.equal(clinicTimeToIso("2027-02-30T10:00"), "");
  assert.equal(clinicTimeToIso("bad"), "");
});
test("reminders schedule 24 hours before or immediately for short-notice confirmation", () => {
  const now = new Date("2027-01-01T20:00:00Z");
  assert.equal(reminderTime(new Date(now.getTime() + 2 * DAY_MS), now).getTime(), now.getTime() + DAY_MS);
  assert.equal(reminderTime(new Date(now.getTime() + 3600000), now).getTime(), now.getTime());
});
test("phone normalization supports Syrian and explicitly international numbers", () => {
  assert.equal(normalizePhone("0944 123 456"), "963944123456");
  assert.equal(normalizePhone("+971 50 123 4567"), "971501234567");
  assert.equal(normalizePhone("00963 944 123 456"), "963944123456");
  assert.equal(normalizePhone("123"), null);
  assert.equal(normalizePhone("call 0944123456"), null);
});
test("booking validation allows guests and optional email; rejects invalid references/privileged fields", () => {
  const booking = { patientName: "Test Patient", patientPhone: "+963944123456", scheduledAt: "2099-01-01T10:00:00Z", serviceSlug: "service" };
  const parsed = appointmentSchema.parse(booking);
  assert.equal(parsed.emailReminderConsent, false);
  assert.equal(parsed.whatsappReminderConsent, false);
  assert.equal(appointmentSchema.safeParse({ ...booking, patientEmail: "" }).success, true);
  for (const bad of [{ patientEmail: "bad" }, { serviceSlug: "" }, { scheduledAt: "yesterday" }, { scheduledAt: "2020-01-01T10:00:00Z" }, { status: "CONFIRMED" }, { accountId: "someone" }, { patientId: "someone" }, { emailReminderConsent: "true" }]) {
    assert.equal(appointmentSchema.safeParse({ ...booking, ...bad }).success, false);
  }
  assert.equal(appointmentPatchSchema.safeParse({}).success, false);
  assert.equal(appointmentPatchSchema.safeParse({ durationMinutes: 0 }).success, false);
});

test("manual WhatsApp links encode a neutral Arabic reminder and international phone", () => {
  const link = whatsappReminderUrl("0944 123 456", "2027-01-01T10:00:00Z");
  assert.ok(link);
  const url = new URL(link);
  assert.equal(url.pathname, "/963944123456");
  assert.ok(url.searchParams.get("text")?.includes("بتوقيت دمشق"));
  assert.equal(whatsappReminderUrl("invalid", "2027-01-01T10:00:00Z"), null);
});
