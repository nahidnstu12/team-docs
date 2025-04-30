-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_sectionId_fkey";

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
