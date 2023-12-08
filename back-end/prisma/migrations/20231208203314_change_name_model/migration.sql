/*
  Warnings:

  - You are about to drop the `SoloConversation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SoloConversation" DROP CONSTRAINT "SoloConversation_UserId1_fkey";

-- DropForeignKey
ALTER TABLE "SoloConversation" DROP CONSTRAINT "SoloConversation_UserId2_fkey";

-- DropTable
DROP TABLE "SoloConversation";

-- CreateTable
CREATE TABLE "PrivateMessage" (
    "conversationId" TEXT NOT NULL,
    "UserId1" INTEGER NOT NULL,
    "UserId2" INTEGER NOT NULL,

    CONSTRAINT "PrivateMessage_pkey" PRIMARY KEY ("conversationId")
);

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_UserId1_fkey" FOREIGN KEY ("UserId1") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_UserId2_fkey" FOREIGN KEY ("UserId2") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
