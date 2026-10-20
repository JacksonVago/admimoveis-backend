/*
  Warnings:

  - Added the required column `empresaId` to the `acordos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "acordos" ADD COLUMN     "empresaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "acordos" ADD CONSTRAINT "acordos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
