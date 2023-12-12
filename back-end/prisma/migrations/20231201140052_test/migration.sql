/*
  Warnings:

  - The primary key for the `UserOTPVerification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserOTPVerification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserOTPVerification" DROP CONSTRAINT "UserOTPVerification_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserOTPVerification_pkey" PRIMARY KEY ("id");
