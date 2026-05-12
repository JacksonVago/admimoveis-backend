-- CreateEnum
CREATE TYPE "TipoAgendamento" AS ENUM ('RECORRENTE', 'UNICO');

-- CreateEnum
CREATE TYPE "FrequenciaEnvio" AS ENUM ('DIARIO', 'SEMANAL', 'MENSAL', 'ANUAL');

-- CreateEnum
CREATE TYPE "TipoIntervaloEnvio" AS ENUM ('HORAS', 'MINUTOS', 'SEGUNDOS');

-- CreateEnum
CREATE TYPE "JobsStatus" AS ENUM ('CREATING', 'WAITING_TO_START', 'WAITING_TO_PROCESS', 'RUNNING', 'PAUSED', 'PAUSED_BY_SCHEDULE', 'FINISHED', 'ERROR');

-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "portSmtp" INTEGER,
ADD COLUMN     "pwdSmtp" TEXT,
ADD COLUMN     "secureSmtp" BOOLEAN,
ADD COLUMN     "smtpHost" TEXT,
ADD COLUMN     "userSmtp" TEXT;

-- CreateTable
CREATE TABLE "configuracoesalertas" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "empresaId" INTEGER NOT NULL,
    "alertaId" INTEGER NOT NULL,
    "tipoAgendamento" "TipoAgendamento" NOT NULL,
    "frequenciaEnvio" "FrequenciaEnvio",
    "dataInicio" TIMESTAMP(3),
    "ocorreAcada" INTEGER,
    "grupoEnvio" TEXT,
    "horarioEnvio" TEXT,
    "tipoIntervaloEnvio" "TipoIntervaloEnvio",
    "intervaloEnvio" INTEGER,
    "horarioInicial" TEXT,
    "horarioFinal" TEXT,
    "dataInicioEnvio" TIMESTAMP(3),
    "dataFinalEnvio" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoesalertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipoalertas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipoalertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "alertaId" INTEGER NOT NULL,
    "str_message" TEXT NOT NULL,
    "str_start_date" TEXT NOT NULL,
    "str_end_date" TEXT NOT NULL,
    "str_start_time" TEXT NOT NULL,
    "str_end_time" TEXT NOT NULL,
    "str_cron" TEXT NOT NULL,
    "int_delay" INTEGER NOT NULL,
    "dtm_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updated" TIMESTAMP(3) NOT NULL,
    "status" "JobsStatus" NOT NULL DEFAULT 'WAITING_TO_START',
    "userId" TEXT NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configuracoesalertas_empresaId_key" ON "configuracoesalertas"("empresaId");

-- AddForeignKey
ALTER TABLE "configuracoesalertas" ADD CONSTRAINT "configuracoesalertas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoesalertas" ADD CONSTRAINT "configuracoesalertas_alertaId_fkey" FOREIGN KEY ("alertaId") REFERENCES "tipoalertas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_alertaId_fkey" FOREIGN KEY ("alertaId") REFERENCES "configuracoesalertas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
