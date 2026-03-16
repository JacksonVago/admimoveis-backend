/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_empresaId_login_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");
