-- AlterTable
ALTER TABLE "boletosbancarios" ADD COLUMN     "qrcode" TEXT,
ADD COLUMN     "txid" TEXT,
ALTER COLUMN "formaPix" DROP NOT NULL,
ALTER COLUMN "codigoBarras" DROP NOT NULL,
ALTER COLUMN "linhaDigitavel" DROP NOT NULL,
ALTER COLUMN "nossoNumero" DROP NOT NULL,
ALTER COLUMN "urlBoleto" DROP NOT NULL,
ALTER COLUMN "registrado" DROP NOT NULL,
ALTER COLUMN "emvPIX" DROP NOT NULL,
ALTER COLUMN "metodoPagamento" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "observacao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "contascorrentes" ADD COLUMN     "cooperativa" TEXT;
