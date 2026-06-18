-- AlterEnum
ALTER TYPE "BoletoStatus" ADD VALUE 'ENVIADO_BANCO';

-- AlterTable
ALTER TABLE "boletos" ADD COLUMN     "contaCorrenteId" INTEGER;

-- AlterTable
ALTER TABLE "boletosbancarios" ADD COLUMN     "assuntoEmail" TEXT,
ADD COLUMN     "contaId" INTEGER,
ADD COLUMN     "formaEnvio" TEXT,
ADD COLUMN     "instrucaoCobId1" INTEGER,
ADD COLUMN     "instrucaoCobId2" INTEGER,
ADD COLUMN     "instrucaoCobId3" INTEGER,
ADD COLUMN     "instrucaoRecId1" INTEGER,
ADD COLUMN     "instrucaoRecId2" INTEGER,
ADD COLUMN     "instrucaoRecId3" INTEGER,
ADD COLUMN     "instrucaoRecId4" INTEGER,
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
ADD COLUMN     "tipoMultaCobId" INTEGER;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_contaCorrenteId_fkey" FOREIGN KEY ("contaCorrenteId") REFERENCES "contascorrentes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletosbancarios" ADD CONSTRAINT "boletosbancarios_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "contascorrentes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
