/*
  Warnings:

  - Made the column `postId` on table `PostAccused` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PostAccused" DROP CONSTRAINT "PostAccused_postId_fkey";

-- AlterTable
ALTER TABLE "PostAccused" ALTER COLUMN "postId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PostAccused" ADD CONSTRAINT "PostAccused_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
