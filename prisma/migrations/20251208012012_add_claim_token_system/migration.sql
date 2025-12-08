-- CreateTable
CREATE TABLE "ClaimToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClaimToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimTokenStartup" (
    "id" TEXT NOT NULL,
    "claimTokenId" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClaimTokenStartup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClaimToken_token_key" ON "ClaimToken"("token");

-- CreateIndex
CREATE INDEX "ClaimToken_token_idx" ON "ClaimToken"("token");

-- CreateIndex
CREATE INDEX "ClaimToken_email_idx" ON "ClaimToken"("email");

-- CreateIndex
CREATE INDEX "ClaimToken_expiresAt_idx" ON "ClaimToken"("expiresAt");

-- CreateIndex
CREATE INDEX "ClaimTokenStartup_claimTokenId_idx" ON "ClaimTokenStartup"("claimTokenId");

-- CreateIndex
CREATE INDEX "ClaimTokenStartup_startupId_idx" ON "ClaimTokenStartup"("startupId");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimTokenStartup_claimTokenId_startupId_key" ON "ClaimTokenStartup"("claimTokenId", "startupId");

-- AddForeignKey
ALTER TABLE "ClaimTokenStartup" ADD CONSTRAINT "ClaimTokenStartup_claimTokenId_fkey" FOREIGN KEY ("claimTokenId") REFERENCES "ClaimToken"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimTokenStartup" ADD CONSTRAINT "ClaimTokenStartup_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
