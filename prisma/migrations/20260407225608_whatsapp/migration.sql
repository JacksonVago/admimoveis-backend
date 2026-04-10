-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "sessionID" TEXT NOT NULL,
    "creds" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_id_key" ON "sessions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionID_key" ON "sessions"("sessionID");
