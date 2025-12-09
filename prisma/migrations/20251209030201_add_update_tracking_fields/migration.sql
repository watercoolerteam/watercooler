-- AlterTable
ALTER TABLE "Startup" ADD COLUMN     "lastUpdateAt" TIMESTAMP(3),
ADD COLUMN     "updateCount" INTEGER NOT NULL DEFAULT 0;
