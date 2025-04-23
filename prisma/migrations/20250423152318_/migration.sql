/*
  Warnings:

  - You are about to drop the column `category` on the `Permission` table. All the data in the column will be lost.
  - Added the required column `scope` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "category",
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "scope" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
