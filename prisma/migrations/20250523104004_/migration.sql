-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'inactive';

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'inactive';
