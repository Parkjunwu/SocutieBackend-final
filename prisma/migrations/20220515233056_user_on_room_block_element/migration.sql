/*
  Warnings:

  - Added the required column `isBlockOpponent` to the `UserOnRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserOnRoom" ADD COLUMN     "blockCancelTime" TIMESTAMP(3),
ADD COLUMN     "blockTime" TIMESTAMP(3),
ADD COLUMN     "isBlockOpponent" BOOLEAN NOT NULL;
