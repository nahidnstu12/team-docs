/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Page` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_creatorId_fkey";

-- DropIndex
DROP INDEX "Page_creatorId_idx";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "creatorId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Page_ownerId_idx" ON "Page"("ownerId");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
