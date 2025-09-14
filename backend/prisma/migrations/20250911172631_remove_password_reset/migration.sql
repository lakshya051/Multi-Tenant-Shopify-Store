/*
  Warnings:

  - You are about to drop the column `passwordResetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetTokenExpires` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."User_passwordResetToken_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "passwordResetToken",
DROP COLUMN "passwordResetTokenExpires";
