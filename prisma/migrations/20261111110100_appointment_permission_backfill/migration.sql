-- Preserve existing schedule access without granting new mutation/contact privileges.
UPDATE "AdminUser"
SET "permissions" = array_append("permissions", 'APPOINTMENTS_VIEW_ALL'::"AdminPermission")
WHERE 'APPOINTMENTS'::"AdminPermission" = ANY("permissions")
  AND NOT ('APPOINTMENTS_VIEW_ALL'::"AdminPermission" = ANY("permissions"));

ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_durationMinutes_check" CHECK ("durationMinutes" BETWEEN 5 AND 480);
