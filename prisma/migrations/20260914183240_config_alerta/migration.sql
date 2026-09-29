/*
  Warnings:

  - A unique constraint covering the columns `[boletoId]` on the table `boletosbancarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,descricao]` on the table `configuracoesalertas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "configuracoesalertas_empresaId_alertaId_key";

-- CreateIndex
CREATE UNIQUE INDEX "boletosbancarios_boletoId_key" ON "boletosbancarios"("boletoId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoesalertas_empresaId_descricao_key" ON "configuracoesalertas"("empresaId", "descricao");
