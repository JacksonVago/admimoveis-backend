/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,descricao]` on the table `gruposfluxocaixa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `empresaId` to the `gruposfluxocaixa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `gruposfluxocaixa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'CREATE_GRUPO_FLUXO_CAIXA';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_GRUPO_FLUXO_CAIXA';
ALTER TYPE "Permission" ADD VALUE 'DELETE_GRUPO_FLUXO_CAIXA';
ALTER TYPE "Permission" ADD VALUE 'VIEW_GRUPO_FLUXO_CAIXA';

-- AlterTable
ALTER TABLE "gruposfluxocaixa" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "empresaId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "gruposfluxocaixa_empresaId_descricao_key" ON "gruposfluxocaixa"("empresaId", "descricao");

-- AddForeignKey
ALTER TABLE "gruposfluxocaixa" ADD CONSTRAINT "gruposfluxocaixa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
