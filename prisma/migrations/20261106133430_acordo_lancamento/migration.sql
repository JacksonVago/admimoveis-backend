/*
  Warnings:

  - Added the required column `dataVencimento` to the `lancamentosacordos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorLancamento` to the `lancamentosacordos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lancamentosacordos" ADD COLUMN     "dataVencimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "valorLancamento" DOUBLE PRECISION NOT NULL;
