-- AlterEnum
ALTER TYPE "FrequenciaEnvio" ADD VALUE 'DIAS_VENCIMENTO';

-- AlterTable
ALTER TABLE "configuracoesalertas" ADD COLUMN     "textoAlerta" TEXT;

-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "avisosVencBoleto" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "imovelId" INTEGER,
ADD COLUMN     "locacaoId" INTEGER,
ADD COLUMN     "pessoaId" INTEGER;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
