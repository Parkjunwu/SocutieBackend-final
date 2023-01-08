/*
  Warnings:

  - Added the required column `firstPhoto` to the `PetLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PetLog" ADD COLUMN     "firstPhoto" TEXT NOT NULL;
