/*
  Warnings:

  - You are about to drop the column `instrucaoCobId` on the `contascorrentes` table. All the data in the column will be lost.
  - You are about to drop the column `instrucaoRecId` on the `contascorrentes` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FormaEnvio" AS ENUM ('EMAIL', 'IMPRESSAO');

-- DropForeignKey
ALTER TABLE "contascorrentes" DROP CONSTRAINT "contascorrentes_carteiraId_fkey";

-- DropForeignKey
ALTER TABLE "contascorrentes" DROP CONSTRAINT "contascorrentes_especieId_fkey";

-- DropForeignKey
ALTER TABLE "contascorrentes" DROP CONSTRAINT "contascorrentes_instrucaoCobId_fkey";

-- DropForeignKey
ALTER TABLE "contascorrentes" DROP CONSTRAINT "contascorrentes_instrucaoRecId_fkey";

-- AlterTable
ALTER TABLE "contascorrentes" DROP COLUMN "instrucaoCobId",
DROP COLUMN "instrucaoRecId",
ADD COLUMN     "assuntoEmail" TEXT,
ADD COLUMN     "formaEnvio" "FormaEnvio",
ADD COLUMN     "instrucaoCobId1" INTEGER,
ADD COLUMN     "instrucaoCobId2" INTEGER,
ADD COLUMN     "instrucaoCobId3" INTEGER,
ADD COLUMN     "instrucaoCobrancaId" INTEGER,
ADD COLUMN     "instrucaoRecId1" INTEGER,
ADD COLUMN     "instrucaoRecId2" INTEGER,
ADD COLUMN     "instrucaoRecId3" INTEGER,
ADD COLUMN     "instrucaoRecId4" INTEGER,
ADD COLUMN     "instrucaoRecebimentosId" INTEGER,
ADD COLUMN     "mensagemEmail1" TEXT,
ADD COLUMN     "mensagemEmail2" TEXT,
ADD COLUMN     "mensagemEmail3" TEXT,
ADD COLUMN     "negativar" BOOLEAN,
ADD COLUMN     "pagtoParcial" BOOLEAN DEFAULT false,
ADD COLUMN     "protestar" BOOLEAN,
ADD COLUMN     "qtdeDiasNegativar" INTEGER,
ADD COLUMN     "qtdeDiasProtesto" INTEGER,
ADD COLUMN     "qtdeMaxParcial" INTEGER,
ADD COLUMN     "tipoAutorizacaoCobId" INTEGER,
ADD COLUMN     "tipoDescontoCobId" INTEGER,
ADD COLUMN     "tipoJurosCobId" INTEGER,
ADD COLUMN     "tipoMultaCobId" INTEGER,
ALTER COLUMN "carteiraId" DROP NOT NULL,
ALTER COLUMN "especieId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "tiposautorizacoescobrancas" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "bancoId" INTEGER NOT NULL,

    CONSTRAINT "tiposautorizacoescobrancas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiposdescontoscobrancas" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "bancoId" INTEGER NOT NULL,

    CONSTRAINT "tiposdescontoscobrancas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiposmultascobrancas" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "bancoId" INTEGER NOT NULL,

    CONSTRAINT "tiposmultascobrancas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiposjuroscobrancas" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "bancoId" INTEGER NOT NULL,

    CONSTRAINT "tiposjuroscobrancas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tiposautorizacoescobrancas_bancoId_codigo_key" ON "tiposautorizacoescobrancas"("bancoId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tiposdescontoscobrancas_bancoId_codigo_key" ON "tiposdescontoscobrancas"("bancoId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tiposmultascobrancas_bancoId_codigo_key" ON "tiposmultascobrancas"("bancoId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tiposjuroscobrancas_bancoId_codigo_key" ON "tiposjuroscobrancas"("bancoId", "codigo");

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_tipoJurosCobId_fkey" FOREIGN KEY ("tipoJurosCobId") REFERENCES "tiposjuroscobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_tipoMultaCobId_fkey" FOREIGN KEY ("tipoMultaCobId") REFERENCES "tiposmultascobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_tipoDescontoCobId_fkey" FOREIGN KEY ("tipoDescontoCobId") REFERENCES "tiposdescontoscobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_tipoAutorizacaoCobId_fkey" FOREIGN KEY ("tipoAutorizacaoCobId") REFERENCES "tiposautorizacoescobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoCobId1_fkey" FOREIGN KEY ("instrucaoCobId1") REFERENCES "instrucoescobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoCobId2_fkey" FOREIGN KEY ("instrucaoCobId2") REFERENCES "instrucoescobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoCobId3_fkey" FOREIGN KEY ("instrucaoCobId3") REFERENCES "instrucoescobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoRecId1_fkey" FOREIGN KEY ("instrucaoRecId1") REFERENCES "instrucoesrecebimentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoRecId2_fkey" FOREIGN KEY ("instrucaoRecId2") REFERENCES "instrucoesrecebimentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoRecId3_fkey" FOREIGN KEY ("instrucaoRecId3") REFERENCES "instrucoesrecebimentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoRecId4_fkey" FOREIGN KEY ("instrucaoRecId4") REFERENCES "instrucoesrecebimentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_carteiraId_fkey" FOREIGN KEY ("carteiraId") REFERENCES "carteirascobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_especieId_fkey" FOREIGN KEY ("especieId") REFERENCES "especiescobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoCobrancaId_fkey" FOREIGN KEY ("instrucaoCobrancaId") REFERENCES "instrucoescobrancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_instrucaoRecebimentosId_fkey" FOREIGN KEY ("instrucaoRecebimentosId") REFERENCES "instrucoesrecebimentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiposautorizacoescobrancas" ADD CONSTRAINT "tiposautorizacoescobrancas_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiposdescontoscobrancas" ADD CONSTRAINT "tiposdescontoscobrancas_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiposmultascobrancas" ADD CONSTRAINT "tiposmultascobrancas_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiposjuroscobrancas" ADD CONSTRAINT "tiposjuroscobrancas_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
