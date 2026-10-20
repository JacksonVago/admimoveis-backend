-- AlterTable
ALTER TABLE "boletos" ADD COLUMN     "acordoId" INTEGER;

-- AlterTable
ALTER TABLE "genericanexos" ADD COLUMN     "acordoId" INTEGER;

-- CreateTable
CREATE TABLE "acordos" (
    "id" SERIAL NOT NULL,
    "observacao" TEXT,
    "valorOriginal" DOUBLE PRECISION NOT NULL,
    "juros" DOUBLE PRECISION NOT NULL,
    "multa" DOUBLE PRECISION NOT NULL,
    "desconto" DOUBLE PRECISION NOT NULL,
    "valorLiquido" DOUBLE PRECISION NOT NULL,
    "qtdParcelas" INTEGER NOT NULL,
    "tipoGeracaoBoleto" TEXT NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "locacaoId" INTEGER,
    "imovelId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acordos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentosacordos" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valorOriginal" DOUBLE PRECISION NOT NULL,
    "juros" DOUBLE PRECISION NOT NULL,
    "multa" DOUBLE PRECISION NOT NULL,
    "desconto" DOUBLE PRECISION NOT NULL,
    "acordoId" INTEGER NOT NULL,
    "boletobancarioId" INTEGER,

    CONSTRAINT "lancamentosacordos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acordos_id_key" ON "acordos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "lancamentosacordos_id_key" ON "lancamentosacordos"("id");

-- AddForeignKey
ALTER TABLE "genericanexos" ADD CONSTRAINT "genericanexos_acordoId_fkey" FOREIGN KEY ("acordoId") REFERENCES "acordos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_acordoId_fkey" FOREIGN KEY ("acordoId") REFERENCES "acordos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acordos" ADD CONSTRAINT "acordos_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acordos" ADD CONSTRAINT "acordos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acordos" ADD CONSTRAINT "acordos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentosacordos" ADD CONSTRAINT "lancamentosacordos_acordoId_fkey" FOREIGN KEY ("acordoId") REFERENCES "acordos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentosacordos" ADD CONSTRAINT "lancamentosacordos_boletobancarioId_fkey" FOREIGN KEY ("boletobancarioId") REFERENCES "boletosbancarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
