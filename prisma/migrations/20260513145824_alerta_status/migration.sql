/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,alertaId]` on the table `configuracoesalertas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "configuracoesalertas_empresaId_alertaId_key" ON "configuracoesalertas"("empresaId", "alertaId");
