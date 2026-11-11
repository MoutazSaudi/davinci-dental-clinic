-- CreateEnum
CREATE TYPE "AdminPermission" AS ENUM ('OVERVIEW', 'APPOINTMENTS', 'MESSAGES', 'DOCTORS', 'GALLERY', 'FAQ', 'SERVICES');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "permissions" "AdminPermission"[] DEFAULT ARRAY[]::"AdminPermission"[],
ALTER COLUMN "role" SET DEFAULT 'EDITOR';

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
