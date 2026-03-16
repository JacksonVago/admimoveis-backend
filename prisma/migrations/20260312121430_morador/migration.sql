/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,login]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_login_key";

-- CreateTable
CREATE TABLE "moradores" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "imovelId" INTEGER NOT NULL,

    CONSTRAINT "moradores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_empresaId_login_key" ON "users"("empresaId", "login");

-- AddForeignKey
ALTER TABLE "moradores" ADD CONSTRAINT "moradores_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moradores" ADD CONSTRAINT "moradores_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
