-- CreateTable
CREATE TABLE "Founder" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "highlight" TEXT,
    "xLink" TEXT,
    "linkedInLink" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Founder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Founder_startupId_idx" ON "Founder"("startupId");

-- CreateIndex
CREATE INDEX "Founder_startupId_order_idx" ON "Founder"("startupId", "order");

-- AddForeignKey
ALTER TABLE "Founder" ADD CONSTRAINT "Founder_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
