/*
  Warnings:

  - You are about to drop the column `instrucaoCobrancaId` on the `contascorrentes` table. All the data in the column will be lost.
  - You are about to drop the column `instrucaoRecebimentosId` on the `contascorrentes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "contascorrentes" DROP CONSTRAINT "contascorrentes_instrucaoCobrancaId_fkey";

-- DropForeignKey
ALTER TABLE "contascorrentes" DROP CONSTRAINT "contascorrentes_instrucaoRecebimentosId_fkey";

-- AlterTable
ALTER TABLE "contascorrentes" DROP COLUMN "instrucaoCobrancaId",
DROP COLUMN "instrucaoRecebimentosId";
