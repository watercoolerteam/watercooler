import { CompanyStage, FinancialStage } from "@prisma/client";

/**
 * Get a human-readable label for a company stage or funding stage.
 * This function is server-safe and can be used in both server and client components.
 */
export function getStageLabel(
  stage: CompanyStage | FinancialStage | null | undefined,
  type: "company" | "financial"
): string {
  if (!stage) return "";

  if (type === "company") {
    const labels: Record<CompanyStage, string> = {
      IDEA: "Idea",
      BUILDING: "Building",
      PRIVATE_BETA: "Private Beta",
      LIVE: "Live",
    };
    return labels[stage as CompanyStage] || "";
  } else {
    const labels: Record<FinancialStage, string> = {
      BOOTSTRAPPED: "Bootstrapped",
      NOT_RAISING: "Not Raising",
      RAISING_SOON: "Raising Soon",
      RAISING: "Raising",
      FUNDED: "Funded",
    };
    return labels[stage as FinancialStage] || "";
  }
}

