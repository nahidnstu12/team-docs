/*
  Warnings:

  - A unique constraint covering the columns `[scope]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_scope_key" ON "Permission"("scope");
