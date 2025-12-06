"use client";

import { CompanyStage, FinancialStage } from "@prisma/client";

interface StageIconProps {
  stage: CompanyStage | FinancialStage | null | undefined;
  type: "company" | "financial";
  className?: string;
}

export function StageIcon({ stage, type, className = "h-5 w-5" }: StageIconProps) {
  if (!stage) return null;

  if (type === "company") {
    switch (stage as CompanyStage) {
      case "IDEA":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Idea">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case "BUILDING":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Building">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "PRIVATE_BETA":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Private Beta">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case "LIVE":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Live">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return null;
    }
  } else {
    switch (stage as FinancialStage) {
      case "BOOTSTRAPPED":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Bootstrapped">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "NOT_RAISING":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Not Raising">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
          </svg>
        );
      case "RAISING_SOON":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Raising Soon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "RAISING":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Raising">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "FUNDED":
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Funded">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  }
}


