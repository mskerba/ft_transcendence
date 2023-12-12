/*
  Warnings:

  - You are about to drop the column `UserId` on the `DirectMessage` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DirectMessage" DROP CONSTRAINT "DirectMessage_UserId_fkey";

-- AlterTable
ALTER TABLE "DirectMessage" DROP COLUMN "UserId",
ADD COLUMN     "senderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
