/*
  Warnings:

  - Added the required column `valorParcela` to the `acordos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "acordos" ADD COLUMN     "valorParcela" DOUBLE PRECISION NOT NULL;
