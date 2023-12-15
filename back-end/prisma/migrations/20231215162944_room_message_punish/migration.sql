/*
  Warnings:

  - You are about to drop the column `UserId` on the `RoomMessage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[RoomId,UserId]` on the table `BanUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RoomId,UserId]` on the table `KickUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RoomId,UserId]` on the table `MuteUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Role` to the `RoomMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomMessage" DROP CONSTRAINT "RoomMessage_UserId_fkey";

-- AlterTable
ALTER TABLE "RoomMessage" DROP COLUMN "UserId",
ADD COLUMN     "Role" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BanUser_RoomId_UserId_key" ON "BanUser"("RoomId", "UserId");

-- CreateIndex
CREATE UNIQUE INDEX "KickUser_RoomId_UserId_key" ON "KickUser"("RoomId", "UserId");

-- CreateIndex
CREATE UNIQUE INDEX "MuteUser_RoomId_UserId_key" ON "MuteUser"("RoomId", "UserId");

-- AddForeignKey
ALTER TABLE "RoomMessage" ADD CONSTRAINT "RoomMessage_Role_fkey" FOREIGN KEY ("Role") REFERENCES "RoleUser"("RoleId") ON DELETE RESTRICT ON UPDATE CASCADE;
