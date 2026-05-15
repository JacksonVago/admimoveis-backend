-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'CREATE_TIPO_ALERTA';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_TIPO_ALERTA';
ALTER TYPE "Permission" ADD VALUE 'DELETE_TIPO_ALERTA';
ALTER TYPE "Permission" ADD VALUE 'VIEW_TIPOS_ALERTA';
ALTER TYPE "Permission" ADD VALUE 'CREATE_ALERTA';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_ALERTA';
ALTER TYPE "Permission" ADD VALUE 'DELETE_ALERTA';
ALTER TYPE "Permission" ADD VALUE 'VIEW_ALERTAS';
ALTER TYPE "Permission" ADD VALUE 'CREATE_CONTA_CORRENTE';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_CONTA_CORRENTE';
ALTER TYPE "Permission" ADD VALUE 'DELETE_CONTA_CORRENTE';
ALTER TYPE "Permission" ADD VALUE 'VIEW_CONTAS_CORRENTE';
