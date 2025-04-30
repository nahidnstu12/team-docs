/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Section` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_creatorId_fkey";

-- DropIndex
DROP INDEX "Section_creatorId_idx";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "creatorId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Section_name_key" ON "Section"("name");

-- CreateIndex
CREATE INDEX "Section_ownerId_idx" ON "Section"("ownerId");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
