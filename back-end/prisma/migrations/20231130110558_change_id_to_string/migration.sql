/*
  Warnings:

  - The primary key for the `DirectMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FriendRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Friendship` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RoleUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RoomMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SoloConversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserOTPVerification` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "BanUser" DROP CONSTRAINT "BanUser_RoomId_fkey";

-- DropForeignKey
ALTER TABLE "BanUser" DROP CONSTRAINT "BanUser_UserId_fkey";

-- DropForeignKey
ALTER TABLE "BlockUser" DROP CONSTRAINT "BlockUser_TheBlockedUserId_fkey";

-- DropForeignKey
ALTER TABLE "BlockUser" DROP CONSTRAINT "BlockUser_TheBlockingUserId_fkey";

-- DropForeignKey
ALTER TABLE "DirectMessage" DROP CONSTRAINT "DirectMessage_UserId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user2Id_fkey";

-- DropForeignKey
ALTER TABLE "KickUser" DROP CONSTRAINT "KickUser_RoomId_fkey";

-- DropForeignKey
ALTER TABLE "KickUser" DROP CONSTRAINT "KickUser_UserId_fkey";

-- DropForeignKey
ALTER TABLE "MuteUser" DROP CONSTRAINT "MuteUser_RoomId_fkey";

-- DropForeignKey
ALTER TABLE "MuteUser" DROP CONSTRAINT "MuteUser_UserId_fkey";

-- DropForeignKey
ALTER TABLE "RoleUser" DROP CONSTRAINT "RoleUser_RoomId_fkey";

-- DropForeignKey
ALTER TABLE "RoleUser" DROP CONSTRAINT "RoleUser_UserId_fkey";

-- DropForeignKey
ALTER TABLE "RoomMessage" DROP CONSTRAINT "RoomMessage_RoomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomMessage" DROP CONSTRAINT "RoomMessage_UserId_fkey";

-- DropForeignKey
ALTER TABLE "SoloConversation" DROP CONSTRAINT "SoloConversation_UserId1_fkey";

-- DropForeignKey
ALTER TABLE "SoloConversation" DROP CONSTRAINT "SoloConversation_UserId2_fkey";

-- DropForeignKey
ALTER TABLE "UserOTPVerification" DROP CONSTRAINT "UserOTPVerification_userId_fkey";

-- AlterTable
ALTER TABLE "BanUser" ALTER COLUMN "RoomId" SET DATA TYPE TEXT,
ALTER COLUMN "UserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "BlockUser" ALTER COLUMN "TheBlockingUserId" SET DATA TYPE TEXT,
ALTER COLUMN "TheBlockedUserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "DirectMessage" DROP CONSTRAINT "DirectMessage_pkey",
ALTER COLUMN "DirectMessageId" DROP DEFAULT,
ALTER COLUMN "DirectMessageId" SET DATA TYPE TEXT,
ALTER COLUMN "UserId" SET DATA TYPE TEXT,
ADD CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("DirectMessageId");
DROP SEQUENCE "DirectMessage_DirectMessageId_seq";

-- AlterTable
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_pkey",
ALTER COLUMN "requestId" DROP DEFAULT,
ALTER COLUMN "requestId" SET DATA TYPE TEXT,
ALTER COLUMN "senderId" SET DATA TYPE TEXT,
ALTER COLUMN "receiverId" SET DATA TYPE TEXT,
ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("requestId");
DROP SEQUENCE "FriendRequest_requestId_seq";

-- AlterTable
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_pkey",
ALTER COLUMN "friendshipId" DROP DEFAULT,
ALTER COLUMN "friendshipId" SET DATA TYPE TEXT,
ALTER COLUMN "user1Id" SET DATA TYPE TEXT,
ALTER COLUMN "user2Id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY ("friendshipId");
DROP SEQUENCE "Friendship_friendshipId_seq";

-- AlterTable
ALTER TABLE "KickUser" ALTER COLUMN "RoomId" SET DATA TYPE TEXT,
ALTER COLUMN "UserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MuteUser" ALTER COLUMN "RoomId" SET DATA TYPE TEXT,
ALTER COLUMN "UserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RoleUser" DROP CONSTRAINT "RoleUser_pkey",
ALTER COLUMN "RoleId" DROP DEFAULT,
ALTER COLUMN "RoleId" SET DATA TYPE TEXT,
ALTER COLUMN "UserId" SET DATA TYPE TEXT,
ALTER COLUMN "RoomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "RoleUser_pkey" PRIMARY KEY ("RoleId");
DROP SEQUENCE "RoleUser_RoleId_seq";

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
ALTER COLUMN "RoomId" DROP DEFAULT,
ALTER COLUMN "RoomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("RoomId");
DROP SEQUENCE "Room_RoomId_seq";

-- AlterTable
ALTER TABLE "RoomMessage" DROP CONSTRAINT "RoomMessage_pkey",
ALTER COLUMN "RoomMessageId" DROP DEFAULT,
ALTER COLUMN "RoomMessageId" SET DATA TYPE TEXT,
ALTER COLUMN "RoomId" SET DATA TYPE TEXT,
ALTER COLUMN "UserId" SET DATA TYPE TEXT,
ADD CONSTRAINT "RoomMessage_pkey" PRIMARY KEY ("RoomMessageId");
DROP SEQUENCE "RoomMessage_RoomMessageId_seq";

-- AlterTable
ALTER TABLE "SoloConversation" DROP CONSTRAINT "SoloConversation_pkey",
ALTER COLUMN "conversationId" DROP DEFAULT,
ALTER COLUMN "conversationId" SET DATA TYPE TEXT,
ALTER COLUMN "UserId1" SET DATA TYPE TEXT,
ALTER COLUMN "UserId2" SET DATA TYPE TEXT,
ADD CONSTRAINT "SoloConversation_pkey" PRIMARY KEY ("conversationId");
DROP SEQUENCE "SoloConversation_conversationId_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");
DROP SEQUENCE "User_userId_seq";

-- AlterTable
ALTER TABLE "UserOTPVerification" DROP CONSTRAINT "UserOTPVerification_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserOTPVerification_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UserOTPVerification_id_seq";

-- AddForeignKey
ALTER TABLE "UserOTPVerification" ADD CONSTRAINT "UserOTPVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloConversation" ADD CONSTRAINT "SoloConversation_UserId1_fkey" FOREIGN KEY ("UserId1") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloConversation" ADD CONSTRAINT "SoloConversation_UserId2_fkey" FOREIGN KEY ("UserId2") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleUser" ADD CONSTRAINT "RoleUser_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleUser" ADD CONSTRAINT "RoleUser_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Room"("RoomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMessage" ADD CONSTRAINT "RoomMessage_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Room"("RoomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMessage" ADD CONSTRAINT "RoomMessage_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_TheBlockingUserId_fkey" FOREIGN KEY ("TheBlockingUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_TheBlockedUserId_fkey" FOREIGN KEY ("TheBlockedUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KickUser" ADD CONSTRAINT "KickUser_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Room"("RoomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KickUser" ADD CONSTRAINT "KickUser_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanUser" ADD CONSTRAINT "BanUser_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Room"("RoomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanUser" ADD CONSTRAINT "BanUser_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuteUser" ADD CONSTRAINT "MuteUser_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Room"("RoomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuteUser" ADD CONSTRAINT "MuteUser_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
