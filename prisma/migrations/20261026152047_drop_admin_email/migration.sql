/*
  Warnings:

  - You are about to drop the column `email` on the `AdminUser` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AdminUser_email_key";

-- AlterTable
ALTER TABLE "AdminUser" DROP COLUMN "email";
