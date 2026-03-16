/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,name]` on the table `imoveltipos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,name]` on the table `lancamentotipos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,documento]` on the table `pessoas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,login]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "imoveltipos_name_key";

-- DropIndex
DROP INDEX "lancamentotipos_name_key";

-- DropIndex
DROP INDEX "pessoas_documento_key";

-- DropIndex
DROP INDEX "users_login_key";

-- CreateIndex
CREATE UNIQUE INDEX "imoveltipos_empresaId_name_key" ON "imoveltipos"("empresaId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "lancamentotipos_empresaId_name_key" ON "lancamentotipos"("empresaId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_empresaId_documento_key" ON "pessoas"("empresaId", "documento");

-- CreateIndex
CREATE UNIQUE INDEX "users_empresaId_login_key" ON "users"("empresaId", "login");
