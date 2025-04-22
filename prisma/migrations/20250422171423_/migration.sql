/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Workspace` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_creatorId_fkey";

-- DropIndex
DROP INDEX "Workspace_creatorId_idx";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "creatorId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Workspace_ownerId_idx" ON "Workspace"("ownerId");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
