/*
  Warnings:

  - Added the required column `privateId` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DirectMessage" ADD COLUMN     "privateId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_privateId_fkey" FOREIGN KEY ("privateId") REFERENCES "PrivateMessage"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;
