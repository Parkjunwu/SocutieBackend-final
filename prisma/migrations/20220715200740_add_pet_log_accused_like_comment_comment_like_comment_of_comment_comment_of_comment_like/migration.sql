-- CreateTable
CREATE TABLE "PetLogAccused" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" INTEGER NOT NULL,
    "detail" TEXT,
    "petLogId" INTEGER NOT NULL,

    CONSTRAINT "PetLogAccused_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetLogLike" (
    "id" SERIAL NOT NULL,
    "petLogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetLogLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetLogComment" (
    "id" SERIAL NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "petLogId" INTEGER NOT NULL,

    CONSTRAINT "PetLogComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetLogCommentLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "petLogCommentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetLogCommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetLogCommentOfComment" (
    "id" SERIAL NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "petLogCommentId" INTEGER NOT NULL,

    CONSTRAINT "PetLogCommentOfComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetLogCommentOfCommentLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "petLogCommentOfCommentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetLogCommentOfCommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PetLogAccused_petLogId_userId_key" ON "PetLogAccused"("petLogId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetLogLike_petLogId_userId_key" ON "PetLogLike"("petLogId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetLogCommentLike_petLogCommentId_userId_key" ON "PetLogCommentLike"("petLogCommentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetLogCommentOfCommentLike_petLogCommentOfCommentId_userId_key" ON "PetLogCommentOfCommentLike"("petLogCommentOfCommentId", "userId");

-- AddForeignKey
ALTER TABLE "PetLogAccused" ADD CONSTRAINT "PetLogAccused_petLogId_fkey" FOREIGN KEY ("petLogId") REFERENCES "PetLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogLike" ADD CONSTRAINT "PetLogLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogLike" ADD CONSTRAINT "PetLogLike_petLogId_fkey" FOREIGN KEY ("petLogId") REFERENCES "PetLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogComment" ADD CONSTRAINT "PetLogComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogComment" ADD CONSTRAINT "PetLogComment_petLogId_fkey" FOREIGN KEY ("petLogId") REFERENCES "PetLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogCommentLike" ADD CONSTRAINT "PetLogCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogCommentLike" ADD CONSTRAINT "PetLogCommentLike_petLogCommentId_fkey" FOREIGN KEY ("petLogCommentId") REFERENCES "PetLogComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogCommentOfComment" ADD CONSTRAINT "PetLogCommentOfComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogCommentOfComment" ADD CONSTRAINT "PetLogCommentOfComment_petLogCommentId_fkey" FOREIGN KEY ("petLogCommentId") REFERENCES "PetLogComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogCommentOfCommentLike" ADD CONSTRAINT "PetLogCommentOfCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetLogCommentOfCommentLike" ADD CONSTRAINT "PetLogCommentOfCommentLike_petLogCommentOfCommentId_fkey" FOREIGN KEY ("petLogCommentOfCommentId") REFERENCES "PetLogCommentOfComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
