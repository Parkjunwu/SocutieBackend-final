-- CreateTable
CREATE TABLE "PetLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "file" TEXT[],
    "body" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PetLog" ADD CONSTRAINT "PetLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
