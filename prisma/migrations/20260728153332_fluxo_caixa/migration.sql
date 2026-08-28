-- DropForeignKey
ALTER TABLE "moradores" DROP CONSTRAINT "moradores_locacaoId_fkey";

-- AlterTable
ALTER TABLE "lancamentoscondominios" ADD COLUMN     "dataDocumento" TIMESTAMP(3),
ADD COLUMN     "descontoDocumento" DOUBLE PRECISION,
ADD COLUMN     "numeroDocumento" TEXT,
ADD COLUMN     "serieDocumento" TEXT,
ADD COLUMN     "valorDocumento" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "lancamentosimoveis" ADD COLUMN     "dataDocumento" TIMESTAMP(3),
ADD COLUMN     "descontoDocumento" DOUBLE PRECISION,
ADD COLUMN     "numeroDocumento" TEXT,
ADD COLUMN     "serieDocumento" TEXT,
ADD COLUMN     "valorDocumento" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "lancamentoslocacoes" ADD COLUMN     "dataDocumento" TIMESTAMP(3),
ADD COLUMN     "descontoDocumento" DOUBLE PRECISION,
ADD COLUMN     "numeroDocumento" TEXT,
ADD COLUMN     "serieDocumento" TEXT,
ADD COLUMN     "valorDocumento" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "lancamentotipos" ADD COLUMN     "grupofluxoId" INTEGER;

-- AlterTable
ALTER TABLE "moradores" ADD COLUMN     "imovelId" INTEGER,
ALTER COLUMN "locacaoId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "gruposfluxocaixa" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "status" "PessoaStatus" NOT NULL,

    CONSTRAINT "gruposfluxocaixa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gruposfluxocaixa_id_key" ON "gruposfluxocaixa"("id");

-- AddForeignKey
ALTER TABLE "lancamentotipos" ADD CONSTRAINT "lancamentotipos_grupofluxoId_fkey" FOREIGN KEY ("grupofluxoId") REFERENCES "gruposfluxocaixa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moradores" ADD CONSTRAINT "moradores_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moradores" ADD CONSTRAINT "moradores_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
