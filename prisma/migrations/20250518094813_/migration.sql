-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_sectionId_fkey";

-- DropIndex
DROP INDEX "User_workspaceId_key";

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
