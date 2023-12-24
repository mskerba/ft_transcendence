-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT '/src/assets/avatar.svg',
    "hashedRt" TEXT,
    "twoFA_Enabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFA_Verified" BOOLEAN NOT NULL DEFAULT false,
    "twoFA_SecretKey" TEXT,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sockId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserOTPVerification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOTPVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "requestId" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "friendshipId" TEXT NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    "friendshipDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("friendshipId")
);

-- CreateTable
CREATE TABLE "LinkDirectMessage" (
    "conversationId" TEXT NOT NULL,
    "UserId1" INTEGER NOT NULL,
    "UserId2" INTEGER NOT NULL,

    CONSTRAINT "LinkDirectMessage_pkey" PRIMARY KEY ("conversationId")
);

-- CreateTable
CREATE TABLE "DirectMessage" (
    "DirectMessageId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "dateMessage" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "privateId" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "isSeen" BOOLEAN NOT NULL DEFAULT false,
    "countUnseen" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("DirectMessageId")
);

-- CreateTable
CREATE TABLE "Room" (
    "RoomId" TEXT NOT NULL,
    "TypeRoom" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'https://robohash.org/test.png',
    "title" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("RoomId")
);

-- CreateTable
CREATE TABLE "RoleUser" (
    "RoleId" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "RoleName" TEXT NOT NULL,
    "RoomId" TEXT NOT NULL,

    CONSTRAINT "RoleUser_pkey" PRIMARY KEY ("RoleId")
);

-- CreateTable
CREATE TABLE "RoomMessage" (
    "RoomMessageId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "RoomId" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "dateSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMessage_pkey" PRIMARY KEY ("RoomMessageId")
);

-- CreateTable
CREATE TABLE "BlockUser" (
    "BlockedUserId" SERIAL NOT NULL,
    "TheBlockingUserId" INTEGER NOT NULL,
    "TheBlockedUserId" INTEGER NOT NULL,

    CONSTRAINT "BlockUser_pkey" PRIMARY KEY ("BlockedUserId")
);

-- CreateTable
CREATE TABLE "KickUser" (
    "KickUserId" SERIAL NOT NULL,
    "RoomId" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "KickUser_pkey" PRIMARY KEY ("KickUserId")
);

-- CreateTable
CREATE TABLE "BanUser" (
    "BannUserId" SERIAL NOT NULL,
    "RoomId" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "BanUser_pkey" PRIMARY KEY ("BannUserId")
);

-- CreateTable
CREATE TABLE "MuteUser" (
    "MuteUserId" SERIAL NOT NULL,
    "RoomId" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "StartTime" TIMESTAMP(3) NOT NULL,
    "EndTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuteUser_pkey" PRIMARY KEY ("MuteUserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserOTPVerification_userId_key" ON "UserOTPVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_key" ON "FriendRequest"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_receiverId_key" ON "FriendRequest"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_user1Id_user2Id_key" ON "Friendship"("user1Id", "user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "LinkDirectMessage_UserId1_UserId2_key" ON "LinkDirectMessage"("UserId1", "UserId2");

-- CreateIndex
CREATE UNIQUE INDEX "RoleUser_UserId_RoomId_key" ON "RoleUser"("UserId", "RoomId");

-- CreateIndex
CREATE UNIQUE INDEX "KickUser_RoomId_UserId_key" ON "KickUser"("RoomId", "UserId");

-- CreateIndex
CREATE UNIQUE INDEX "BanUser_RoomId_UserId_key" ON "BanUser"("RoomId", "UserId");

-- CreateIndex
CREATE UNIQUE INDEX "MuteUser_RoomId_UserId_key" ON "MuteUser"("RoomId", "UserId");

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
ALTER TABLE "LinkDirectMessage" ADD CONSTRAINT "LinkDirectMessage_UserId1_fkey" FOREIGN KEY ("UserId1") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkDirectMessage" ADD CONSTRAINT "LinkDirectMessage_UserId2_fkey" FOREIGN KEY ("UserId2") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_privateId_fkey" FOREIGN KEY ("privateId") REFERENCES "LinkDirectMessage"("conversationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

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
