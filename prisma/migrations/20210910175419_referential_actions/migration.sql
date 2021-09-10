/*
  Warnings:

  - Added the required column `authorId` to the `NoteTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NoteTag" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "NoteTag" ADD CONSTRAINT "NoteTag_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
