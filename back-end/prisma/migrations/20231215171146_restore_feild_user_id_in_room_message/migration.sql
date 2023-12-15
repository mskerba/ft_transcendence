/*
  Warnings:

  - You are about to drop the column `Role` on the `RoomMessage` table. All the data in the column will be lost.
  - Added the required column `UserId` to the `RoomMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomMessage" DROP CONSTRAINT "RoomMessage_Role_fkey";

-- AlterTable
ALTER TABLE "RoomMessage" DROP COLUMN "Role",
ADD COLUMN     "UserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "RoomMessage" ADD CONSTRAINT "RoomMessage_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
