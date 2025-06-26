/*
  Warnings:

  - A unique constraint covering the columns `[title,sectionId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,projectId]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Section_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Page_title_sectionId_key" ON "Page"("title", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Section_name_projectId_key" ON "Section"("name", "projectId");
