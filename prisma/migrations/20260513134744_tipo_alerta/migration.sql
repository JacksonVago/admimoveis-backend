/*
  Warnings:

  - You are about to drop the column `name` on the `tipoalertas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empresaId,descricao]` on the table `tipoalertas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `empresaId` to the `tipoalertas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tipoalertas" DROP COLUMN "name",
ADD COLUMN     "empresaId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tipoalertas_empresaId_descricao_key" ON "tipoalertas"("empresaId", "descricao");

-- AddForeignKey
ALTER TABLE "tipoalertas" ADD CONSTRAINT "tipoalertas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
