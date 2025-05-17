/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,name]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,scope]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,slug]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_ownerId_name_key" ON "Permission"("ownerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_ownerId_scope_key" ON "Permission"("ownerId", "scope");

-- CreateIndex
CREATE UNIQUE INDEX "Role_ownerId_name_key" ON "Role"("ownerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_ownerId_slug_key" ON "Workspace"("ownerId", "slug");
