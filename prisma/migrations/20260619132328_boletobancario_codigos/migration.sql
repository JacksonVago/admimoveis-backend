/*
  Warnings:

  - You are about to drop the column `instrucaoCobId1` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `instrucaoCobId2` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `instrucaoCobId3` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `instrucaoRecId1` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `instrucaoRecId2` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `instrucaoRecId3` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `instrucaoRecId4` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `tipoAutorizacaoCobId` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `tipoDescontoCobId` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `tipoJurosCobId` on the `boletosbancarios` table. All the data in the column will be lost.
  - You are about to drop the column `tipoMultaCobId` on the `boletosbancarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boletosbancarios" DROP COLUMN "instrucaoCobId1",
DROP COLUMN "instrucaoCobId2",
DROP COLUMN "instrucaoCobId3",
DROP COLUMN "instrucaoRecId1",
DROP COLUMN "instrucaoRecId2",
DROP COLUMN "instrucaoRecId3",
DROP COLUMN "instrucaoRecId4",
DROP COLUMN "tipoAutorizacaoCobId",
DROP COLUMN "tipoDescontoCobId",
DROP COLUMN "tipoJurosCobId",
DROP COLUMN "tipoMultaCobId",
ADD COLUMN     "carteiraCod" TEXT,
ADD COLUMN     "especieCod" TEXT,
ADD COLUMN     "instrucaoCobCod1" TEXT,
ADD COLUMN     "instrucaoCobCod2" TEXT,
ADD COLUMN     "instrucaoCobCod3" TEXT,
ADD COLUMN     "instrucaoRecCod1" TEXT,
ADD COLUMN     "instrucaoRecCod2" TEXT,
ADD COLUMN     "instrucaoRecCod3" TEXT,
ADD COLUMN     "instrucaoRecCod4" TEXT,
ADD COLUMN     "tipoAutorizacaoCobCod" TEXT,
ADD COLUMN     "tipoDescontoCobCod" TEXT,
ADD COLUMN     "tipoJurosCobCod" TEXT,
ADD COLUMN     "tipoMultaCobCod" TEXT;
