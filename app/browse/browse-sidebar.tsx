"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CompanyStage, FinancialStage } from "@prisma/client";
import { getStageLabel } from "@/lib/stage-utils";

interface BrowseSidebarProps {
  category: string;
  location: string;
  companyStage: string;
  financialStage: string;
  categories: (string | null)[];
  locations: (string | null)[];
  allCompanyStages: CompanyStage[];
  allFinancialStages: FinancialStage[];
  totalCount: number;
}

export function BrowseSidebar({
  category,
  location,
  companyStage,
  financialStage,
  categories,
  locations,
  allCompanyStages,
  allFinancialStages,
  totalCount,
}: BrowseSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 when filters change
    router.push(`/browse?${params.toString()}`);
  };

  const activeFilters = [
    { key: "category", label: category, value: category },
    { key: "location", label: location, value: location },
    { 
      key: "companyStage", 
      label: companyStage ? getStageLabel(companyStage as CompanyStage, "company") : "", 
      value: companyStage 
    },
    { 
      key: "financialStage", 
      label: financialStage ? getStageLabel(financialStage as FinancialStage, "financial") : "", 
      value: financialStage 
    },
  ].filter((f) => f.value);

  return (
    <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 sticky top-24">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Active Filters
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterChange(filter.key, "")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {filter.label}
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              {activeFilters.length > 0 && (
                <Link
                  href="/browse"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clear all
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Category Filter - Prominent */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm transition-all focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c || ""}>
                {c}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-gray-500">
            {category
              ? `${totalCount} startup${totalCount !== 1 ? "s" : ""} in ${category}`
              : `${totalCount} total startup${totalCount !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
            Location
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleFilterChange("location", (formData.get("location") as string) || "");
            }}
          >
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={location}
              onBlur={(e) => {
                if (e.target.value !== location) {
                  handleFilterChange("location", e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="City, State, Country"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm transition-all focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </form>
        </div>

        {/* Company Stage Filter */}
        <div className="mb-6">
          <label htmlFor="companyStage" className="block text-sm font-semibold text-gray-900 mb-2">
            Company Stage
          </label>
          <select
            id="companyStage"
            value={companyStage}
            onChange={(e) => handleFilterChange("companyStage", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm transition-all focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white font-medium"
          >
            <option value="">All Stages</option>
            {allCompanyStages.map((s) => (
              <option key={s} value={s}>
                {getStageLabel(s, "company")}
              </option>
            ))}
          </select>
        </div>

        {/* Funding Filter */}
        <div>
          <label htmlFor="financialStage" className="block text-sm font-semibold text-gray-900 mb-2">
            Funding
          </label>
          <select
            id="financialStage"
            value={financialStage}
            onChange={(e) => handleFilterChange("financialStage", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm transition-all focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white font-medium"
          >
            <option value="">All Stages</option>
            {allFinancialStages.map((s) => (
              <option key={s} value={s}>
                {getStageLabel(s, "financial")}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}

