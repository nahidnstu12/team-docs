-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
