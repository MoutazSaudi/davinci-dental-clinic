-- CreateEnum
CREATE TYPE "ReminderChannel" AS ENUM ('EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AdminPermission" ADD VALUE 'APPOINTMENTS_VIEW_ALL';
ALTER TYPE "AdminPermission" ADD VALUE 'APPOINTMENTS_CREATE';
ALTER TYPE "AdminPermission" ADD VALUE 'APPOINTMENTS_UPDATE_OWN';
ALTER TYPE "AdminPermission" ADD VALUE 'APPOINTMENTS_UPDATE_ANY';
ALTER TYPE "AdminPermission" ADD VALUE 'APPOINTMENTS_ASSIGN';
ALTER TYPE "AdminPermission" ADD VALUE 'APPOINTMENTS_CANCEL';
ALTER TYPE "AdminPermission" ADD VALUE 'APPOINTMENTS_STATUS';
ALTER TYPE "AdminPermission" ADD VALUE 'APPOINTMENTS_CONTACT';
ALTER TYPE "AdminPermission" ADD VALUE 'APPOINTMENTS_REMIND';

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "doctorId" TEXT;

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "clinicalNotes" TEXT,
ADD COLUMN     "durationMinutes" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "emailReminderConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'ar',
ADD COLUMN     "reminderRevision" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "whatsappReminderConsent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AppointmentReminder" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "channel" "ReminderChannel" NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "revision" INTEGER NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "staffId" TEXT,
    "providerMessageId" TEXT,
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "firstAttemptAt" TIMESTAMP(3),
    "nextAttemptAt" TIMESTAMP(3),
    "lockedUntil" TIMESTAMP(3),
    "leaseToken" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentEvent" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentReminder_providerMessageId_key" ON "AppointmentReminder"("providerMessageId");

-- CreateIndex
CREATE INDEX "AppointmentReminder_channel_status_scheduledAt_nextAttemptA_idx" ON "AppointmentReminder"("channel", "status", "scheduledAt", "nextAttemptAt");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentReminder_appointmentId_channel_revision_key" ON "AppointmentReminder"("appointmentId", "channel", "revision");

-- CreateIndex
CREATE INDEX "AppointmentEvent_appointmentId_createdAt_idx" ON "AppointmentEvent"("appointmentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_doctorId_key" ON "AdminUser"("doctorId");

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentReminder" ADD CONSTRAINT "AppointmentReminder_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentReminder" ADD CONSTRAINT "AppointmentReminder_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentEvent" ADD CONSTRAINT "AppointmentEvent_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentEvent" ADD CONSTRAINT "AppointmentEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Schedule filters and overlap queries
CREATE INDEX "Appointment_doctorId_scheduledAt_idx" ON "Appointment"("doctorId", "scheduledAt");
CREATE INDEX "Appointment_scheduledAt_idx" ON "Appointment"("scheduledAt");
