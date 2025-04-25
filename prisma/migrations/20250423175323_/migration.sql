/*
  Warnings:

  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropTable
DROP TABLE "RolePermission";

-- CreateTable
CREATE TABLE "RolePermissionAssignment" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "RolePermissionAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RolePermissionAssignment_roleId_idx" ON "RolePermissionAssignment"("roleId");

-- CreateIndex
CREATE INDEX "RolePermissionAssignment_permissionId_idx" ON "RolePermissionAssignment"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermissionAssignment_roleId_permissionId_key" ON "RolePermissionAssignment"("roleId", "permissionId");

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
