-- CreateEnum
CREATE TYPE "CompanyStage" AS ENUM ('IDEA', 'BUILDING', 'PRIVATE_BETA', 'LIVE');

-- CreateEnum
CREATE TYPE "FinancialStage" AS ENUM ('BOOTSTRAPPED', 'NOT_RAISING', 'RAISING_SOON', 'RAISING', 'FUNDED');

-- AlterTable
ALTER TABLE "Startup" ADD COLUMN     "companyStage" "CompanyStage",
ADD COLUMN     "financialStage" "FinancialStage";

-- CreateIndex
CREATE INDEX "Startup_companyStage_idx" ON "Startup"("companyStage");

-- CreateIndex
CREATE INDEX "Startup_financialStage_idx" ON "Startup"("financialStage");
