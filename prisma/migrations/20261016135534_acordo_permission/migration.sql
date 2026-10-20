/*
  Warnings:

  - Added the required column `status` to the `acordos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'CREATE_ACORDO';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_ACORDO';
ALTER TYPE "Permission" ADD VALUE 'DELETE_ACORDO';
ALTER TYPE "Permission" ADD VALUE 'VIEW_ACORDOS';

-- AlterTable
ALTER TABLE "acordos" ADD COLUMN     "status" "BoletoStatus" NOT NULL,
ALTER COLUMN "juros" SET DEFAULT 0,
ALTER COLUMN "multa" SET DEFAULT 0,
ALTER COLUMN "desconto" SET DEFAULT 0,
ALTER COLUMN "dataEmissao" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "dataVencimento" DROP NOT NULL;
