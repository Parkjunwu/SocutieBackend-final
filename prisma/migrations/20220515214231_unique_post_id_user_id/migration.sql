/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `PostAccused` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PostAccused_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "PostAccused_postId_userId_key" ON "PostAccused"("postId", "userId");
