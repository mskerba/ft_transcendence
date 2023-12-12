/*
  Warnings:

  - You are about to drop the `PrivateMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DirectMessage" DROP CONSTRAINT "DirectMessage_privateId_fkey";

-- DropForeignKey
ALTER TABLE "PrivateMessage" DROP CONSTRAINT "PrivateMessage_UserId1_fkey";

-- DropForeignKey
ALTER TABLE "PrivateMessage" DROP CONSTRAINT "PrivateMessage_UserId2_fkey";

-- DropTable
DROP TABLE "PrivateMessage";

-- CreateTable
CREATE TABLE "LinkDirectMessage" (
    "conversationId" TEXT NOT NULL,
    "UserId1" INTEGER NOT NULL,
    "UserId2" INTEGER NOT NULL,

    CONSTRAINT "LinkDirectMessage_pkey" PRIMARY KEY ("conversationId")
);

-- AddForeignKey
ALTER TABLE "LinkDirectMessage" ADD CONSTRAINT "LinkDirectMessage_UserId1_fkey" FOREIGN KEY ("UserId1") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkDirectMessage" ADD CONSTRAINT "LinkDirectMessage_UserId2_fkey" FOREIGN KEY ("UserId2") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_privateId_fkey" FOREIGN KEY ("privateId") REFERENCES "LinkDirectMessage"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;
