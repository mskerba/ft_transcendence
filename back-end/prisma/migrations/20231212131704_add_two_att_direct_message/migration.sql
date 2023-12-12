-- AlterTable
ALTER TABLE "DirectMessage" ADD COLUMN     "countUnseen" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isSeen" BOOLEAN NOT NULL DEFAULT false;
