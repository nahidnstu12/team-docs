-- DropIndex
DROP INDEX "User_workspaceId_key";

-- CreateTable
CREATE TABLE "ProjectUserPermission" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectUserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectUserPermission_projectId_idx" ON "ProjectUserPermission"("projectId");

-- CreateIndex
CREATE INDEX "ProjectUserPermission_userId_idx" ON "ProjectUserPermission"("userId");

-- CreateIndex
CREATE INDEX "ProjectUserPermission_permissionId_idx" ON "ProjectUserPermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectUserPermission_projectId_userId_permissionId_key" ON "ProjectUserPermission"("projectId", "userId", "permissionId");

-- AddForeignKey
ALTER TABLE "ProjectUserPermission" ADD CONSTRAINT "ProjectUserPermission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserPermission" ADD CONSTRAINT "ProjectUserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserPermission" ADD CONSTRAINT "ProjectUserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
