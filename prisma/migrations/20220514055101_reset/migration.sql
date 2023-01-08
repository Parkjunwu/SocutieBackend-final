-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "accused" INTEGER[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "censoredPostNumber" INTEGER;

-- CreateTable
CREATE TABLE "_BlockRelation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlockRelation_AB_unique" ON "_BlockRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockRelation_B_index" ON "_BlockRelation"("B");

-- AddForeignKey
ALTER TABLE "_BlockRelation" ADD CONSTRAINT "_BlockRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockRelation" ADD CONSTRAINT "_BlockRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
