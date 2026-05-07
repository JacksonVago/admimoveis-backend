-- DropForeignKey
ALTER TABLE "boletos" DROP CONSTRAINT "boletos_locacaoId_fkey";

-- AlterTable
ALTER TABLE "boletos" ADD COLUMN     "imovelId" INTEGER,
ALTER COLUMN "locacaoId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "lancamentosimoveis" (
    "id" SERIAL NOT NULL,
    "parcela" INTEGER,
    "tipoId" INTEGER NOT NULL,
    "valorLancamento" DOUBLE PRECISION NOT NULL,
    "dataLancamento" TIMESTAMP(3) NOT NULL,
    "vencimentoLancamento" TIMESTAMP(3) NOT NULL,
    "linhaDigitavel" TEXT,
    "observacao" TEXT NOT NULL,
    "status" "lancamentoStatus" NOT NULL DEFAULT 'ABERTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "boletoId" INTEGER,

    CONSTRAINT "lancamentosimoveis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lancamentosimoveis" ADD CONSTRAINT "lancamentosimoveis_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "lancamentotipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentosimoveis" ADD CONSTRAINT "lancamentosimoveis_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentosimoveis" ADD CONSTRAINT "lancamentosimoveis_boletoId_fkey" FOREIGN KEY ("boletoId") REFERENCES "boletos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
