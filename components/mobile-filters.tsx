"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompanyStage, FinancialStage } from "@prisma/client";
import { getStageLabel } from "@/components/stage-icons";

interface MobileFiltersProps {
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

export function MobileFilters({
  category,
  location,
  companyStage,
  financialStage,
  categories,
  locations,
  allCompanyStages,
  allFinancialStages,
  totalCount,
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentLocation, setCurrentLocation] = useState(location);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/browse?${params.toString()}`);
    setIsOpen(false);
  };

  const activeFilters = [
    { key: "category", label: category, value: category },
    { key: "location", label: location, value: location },
    { key: "companyStage", label: companyStage ? getStageLabel(companyStage as CompanyStage, "company") : "", value: companyStage },
    { key: "financialStage", label: financialStage ? getStageLabel(financialStage as FinancialStage, "financial") : "", value: financialStage },
  ].filter((f) => f.value);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeFilters.length > 0 && (
          <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-gray-900 text-white rounded-full">
            {activeFilters.length}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Active Filters
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => handleFilterChange(filter.key, "")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                      >
                        {filter.label}
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                    <button
                      onClick={() => router.push("/browse")}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}

              {/* Category */}
              <div>
                <label htmlFor="mobile-category" className="block text-sm font-semibold text-gray-900 mb-2">
                  Category
                </label>
                <select
                  id="mobile-category"
                  value={category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c || ""}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Stage */}
              <div>
                <label htmlFor="mobile-companyStage" className="block text-sm font-semibold text-gray-900 mb-2">
                  Company Stage
                </label>
                <select
                  id="mobile-companyStage"
                  value={companyStage}
                  onChange={(e) => handleFilterChange("companyStage", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  <option value="">All Stages</option>
                  {allCompanyStages.map((s) => (
                    <option key={s} value={s}>
                      {getStageLabel(s, "company")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Financial Stage */}
              <div>
                <label htmlFor="mobile-financialStage" className="block text-sm font-semibold text-gray-900 mb-2">
                  Financial Stage
                </label>
                <select
                  id="mobile-financialStage"
                  value={financialStage}
                  onChange={(e) => handleFilterChange("financialStage", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  <option value="">All Stages</option>
                  {allFinancialStages.map((s) => (
                    <option key={s} value={s}>
                      {getStageLabel(s, "financial")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="mobile-location" className="block text-sm font-semibold text-gray-900 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="mobile-location"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  onBlur={() => handleFilterChange("location", currentLocation)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFilterChange("location", currentLocation);
                    }
                  }}
                  placeholder="City, State, Country"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-md bg-gray-900 px-4 py-3 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Apply Filters ({totalCount} results)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

