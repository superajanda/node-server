/*
  Warnings:

  - You are about to drop the column `lastLoggedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastLoggedAt",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
