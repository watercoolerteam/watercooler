-- CreateTable
CREATE TABLE "StartupUpdate" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updateNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StartupUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StartupUpdate_startupId_idx" ON "StartupUpdate"("startupId");

-- CreateIndex
CREATE INDEX "StartupUpdate_createdAt_idx" ON "StartupUpdate"("createdAt");

-- CreateIndex
CREATE INDEX "StartupUpdate_startupId_updateNumber_idx" ON "StartupUpdate"("startupId", "updateNumber");

-- AddForeignKey
ALTER TABLE "StartupUpdate" ADD CONSTRAINT "StartupUpdate_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
