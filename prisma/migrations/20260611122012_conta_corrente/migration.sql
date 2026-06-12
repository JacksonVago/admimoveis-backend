/*
  Warnings:

  - You are about to drop the column `banco` on the `contascorrentes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bancoId,agencia,conta,digito]` on the table `contascorrentes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bancoId` to the `contascorrentes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carteiraId` to the `contascorrentes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `especieId` to the `contascorrentes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instrucaoCobId` to the `contascorrentes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instrucaoRecId` to the `contascorrentes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "contascorrentes_banco_agencia_conta_digito_key";

-- AlterTable
ALTER TABLE "contascorrentes" DROP COLUMN "banco",
ADD COLUMN     "bancoId" INTEGER NOT NULL,
ADD COLUMN     "carteiraId" INTEGER NOT NULL,
ADD COLUMN     "especieId" INTEGER NOT NULL,
ADD COLUMN     "instrucaoCobId" INTEGER NOT NULL,
ADD COLUMN     "instrucaoRecId" INTEGER NOT NULL,
ADD COLUMN     "urlBoleto" TEXT,
ADD COLUMN     "urlWebhookBoleto" TEXT;

-- CreateTable
CREATE TABLE "bancos" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrucoescobrancas" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "bancoId" INTEGER NOT NULL,

    CONSTRAINT "instrucoescobrancas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrucoesrecebimentos" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "bancoId" INTEGER NOT NULL,

    CONSTRAINT "instrucoesrecebimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carteirascobrancas" (
    "id" SERIAL NOT NULL,
    "carteira" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "vencimentoMinimo" INTEGER,
    "vencimentoMaximo" INTEGER,
    "bancoId" INTEGER NOT NULL,

    CONSTRAINT "carteirascobrancas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especiescobrancas" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "bancoId" INTEGER NOT NULL,

    CONSTRAINT "especiescobrancas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bancos_codigo_key" ON "bancos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "instrucoescobrancas_bancoId_codigo_key" ON "instrucoescobrancas"("bancoId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "instrucoesrecebimentos_bancoId_codigo_key" ON "instrucoesrecebimentos"("bancoId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "carteirascobrancas_bancoId_carteira_key" ON "carteirascobrancas"("bancoId", "carteira");

-- CreateIndex
CREATE UNIQUE INDEX "especiescobrancas_bancoId_codigo_key" ON "especiescobrancas"("bancoId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "contascorrentes_bancoId_agencia_conta_digito_key" ON "contascorrentes"("bancoId", "agencia", "conta", "digito");

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoCobId_fkey" FOREIGN KEY ("instrucaoCobId") REFERENCES "instrucoescobrancas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoRecId_fkey" FOREIGN KEY ("instrucaoRecId") REFERENCES "instrucoesrecebimentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_carteiraId_fkey" FOREIGN KEY ("carteiraId") REFERENCES "carteirascobrancas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_especieId_fkey" FOREIGN KEY ("especieId") REFERENCES "especiescobrancas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instrucoescobrancas" ADD CONSTRAINT "instrucoescobrancas_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instrucoesrecebimentos" ADD CONSTRAINT "instrucoesrecebimentos_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carteirascobrancas" ADD CONSTRAINT "carteirascobrancas_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "especiescobrancas" ADD CONSTRAINT "especiescobrancas_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
