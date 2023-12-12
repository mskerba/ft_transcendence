/*
  Warnings:

  - A unique constraint covering the columns `[UserId1,UserId2]` on the table `LinkDirectMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LinkDirectMessage_UserId1_UserId2_key" ON "LinkDirectMessage"("UserId1", "UserId2");
