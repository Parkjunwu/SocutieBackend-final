/*
  Warnings:

  - You are about to drop the column `firstPhoto` on the `PetLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PetLog" DROP COLUMN "firstPhoto",
ADD COLUMN     "thumbNail" TEXT;
