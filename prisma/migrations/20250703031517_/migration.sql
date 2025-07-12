/*
  Warnings:

  - The `status` column on the `Workspace` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "status",
ADD COLUMN     "status" "WorkspaceStatus" NOT NULL DEFAULT 'PENDING';
