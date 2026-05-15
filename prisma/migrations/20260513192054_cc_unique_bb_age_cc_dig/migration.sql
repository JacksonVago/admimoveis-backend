/*
  Warnings:

  - A unique constraint covering the columns `[banco,agencia,conta,digito]` on the table `contascorrentes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "contascorrentes_banco_agencia_conta_digito_key" ON "contascorrentes"("banco", "agencia", "conta", "digito");
