/*
  Warnings:

  - You are about to drop the column `parcMaxDiverg` on the `contascorrentes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contascorrentes" DROP COLUMN "parcMaxDiverg",
ADD COLUMN     "percMaxDiverg" DOUBLE PRECISION;
