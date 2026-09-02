-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'CREATE_LANCAMENTO_IMOVEL';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_LANCAMENTO_IMOVEL';
ALTER TYPE "Permission" ADD VALUE 'DELETE_LANCAMENTO_IMOVEL';
ALTER TYPE "Permission" ADD VALUE 'VIEW_LANCAMENTOS_IMOVEIS';
