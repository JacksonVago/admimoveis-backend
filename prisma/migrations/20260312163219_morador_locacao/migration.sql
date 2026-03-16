/*
  Warnings:

  - You are about to drop the column `imovelId` on the `moradores` table. All the data in the column will be lost.
  - Added the required column `locacaoId` to the `moradores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "moradores" DROP CONSTRAINT "moradores_imovelId_fkey";

-- AlterTable
ALTER TABLE "moradores" DROP COLUMN "imovelId",
ADD COLUMN     "locacaoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "moradores" ADD CONSTRAINT "moradores_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
