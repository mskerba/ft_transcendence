/*
  Warnings:

  - A unique constraint covering the columns `[UserId,RoomId]` on the table `RoleUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RoleUser_UserId_RoomId_key" ON "RoleUser"("UserId", "RoomId");