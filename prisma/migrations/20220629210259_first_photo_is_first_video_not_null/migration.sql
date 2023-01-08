/*
  Warnings:

  - Made the column `firstPhoto` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isFirstVideo` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "firstPhoto" SET NOT NULL,
ALTER COLUMN "isFirstVideo" SET NOT NULL;
