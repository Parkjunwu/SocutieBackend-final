-- CreateTable
CREATE TABLE "PostAccused" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" INTEGER NOT NULL,
    "detail" TEXT,
    "postId" INTEGER,

    CONSTRAINT "PostAccused_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostAccused_userId_key" ON "PostAccused"("userId");

-- AddForeignKey
ALTER TABLE "PostAccused" ADD CONSTRAINT "PostAccused_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
