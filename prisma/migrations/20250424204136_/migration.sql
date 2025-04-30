/*
  Warnings:

  - A unique constraint covering the columns `[slug,name,ownerId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Project_ownerId_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_name_ownerId_key" ON "Project"("slug", "name", "ownerId");
