-- AlterTable
ALTER TABLE "boletos" ADD COLUMN     "empresaId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "contascorrentes" (
    "id" SERIAL NOT NULL,
    "banco" TEXT NOT NULL,
    "agencia" TEXT NOT NULL,
    "conta" TEXT NOT NULL,
    "digito" TEXT NOT NULL,
    "descricao" TEXT,
    "usuarioBancoAPI" TEXT,
    "senhaBancoAPI" TEXT,
    "chaveAppAPI" TEXT,
    "urlPIX" TEXT,
    "urlWebhookPIX" TEXT,
    "pessoaId" INTEGER,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "contascorrentes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contascorrentes" ADD CONSTRAINT "contascorrentes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
