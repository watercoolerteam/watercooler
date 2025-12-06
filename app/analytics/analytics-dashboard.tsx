"use client";

import Link from "next/link";
import Image from "next/image";
import { getStageLabel } from "@/lib/stage-utils";
import { CompanyStage, FinancialStage } from "@prisma/client";

interface AnalyticsDashboardProps {
  categoryData: Record<string, number>;
  locationData: Record<string, number>;
  companyStageData: Record<string, number>;
  financialStageData: Record<string, number>;
  mostViewed: Array<{
    id: string;
    name: string;
    slug: string;
    views: number;
    logo: string | null;
    oneLiner: string | null;
  }>;
}

export function AnalyticsDashboard({
  categoryData,
  locationData,
  companyStageData,
  financialStageData,
  mostViewed,
}: AnalyticsDashboardProps) {
  // Helper function to get color intensity based on value
  const getIntensity = (value: number, maxValue: number) => {
    if (maxValue === 0) return 0;
    const ratio = value / maxValue;
    if (ratio >= 0.8) return 5;
    if (ratio >= 0.6) return 4;
    if (ratio >= 0.4) return 3;
    if (ratio >= 0.2) return 2;
    return 1;
  };

  const maxCategoryViews = Math.max(...Object.values(categoryData), 0);
  const maxLocationViews = Math.max(...Object.values(locationData), 0);
  const maxCompanyStageViews = Math.max(...Object.values(companyStageData), 0);
  const maxFinancialStageViews = Math.max(...Object.values(financialStageData), 0);

  const HeatMapItem = ({
    label,
    value,
    intensity,
  }: {
    label: string;
    value: number;
    intensity: number;
  }) => {
    const bgColors = [
      "bg-gray-50",
      "bg-blue-100",
      "bg-blue-200",
      "bg-blue-300",
      "bg-blue-400",
      "bg-blue-500",
    ];
    const textColors = [
      "text-gray-700",
      "text-blue-800",
      "text-blue-900",
      "text-blue-900",
      "text-white",
      "text-white",
    ];

    return (
      <div
        className={`${bgColors[intensity]} ${textColors[intensity]} rounded-lg px-4 py-3 transition-all hover:scale-105`}
      >
        <div className="font-semibold text-sm mb-1">{label}</div>
        <div className="text-xs opacity-90">{value.toLocaleString()} views</div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Most Viewed Startups */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Viewed Startups</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {mostViewed.map((startup, index) => (
            <Link
              key={startup.id}
              href={`/startup/${startup.slug}`}
              className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
              </div>
              {startup.logo ? (
                <div className="flex-shrink-0">
                  <div className="relative h-12 w-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                    <Image
                      src={startup.logo}
                      alt={`${startup.name} logo`}
                      width={48}
                      height={48}
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-400">
                    {startup.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900">{startup.name}</h3>
                {startup.oneLiner && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{startup.oneLiner}</p>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-gray-900">{startup.views.toLocaleString()}</div>
                <div className="text-xs text-gray-500">views</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Category Heat Map */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Interest Heat Map</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(categoryData)
            .sort(([, a], [, b]) => b - a)
            .map(([category, views]) => (
              <HeatMapItem
                key={category}
                label={category}
                value={views}
                intensity={getIntensity(views, maxCategoryViews)}
              />
            ))}
        </div>
      </div>

      {/* Location Heat Map */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Interest Heat Map</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(locationData)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20)
            .map(([location, views]) => (
              <HeatMapItem
                key={location}
                label={location}
                value={views}
                intensity={getIntensity(views, maxLocationViews)}
              />
            ))}
        </div>
      </div>

      {/* Company Stage Heat Map */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Stage Interest</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(companyStageData)
            .sort(([, a], [, b]) => b - a)
            .map(([stage, views]) => (
              <HeatMapItem
                key={stage}
                label={getStageLabel(stage as CompanyStage, "company")}
                value={views}
                intensity={getIntensity(views, maxCompanyStageViews)}
              />
            ))}
        </div>
      </div>

      {/* Funding Heat Map */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding Interest</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(financialStageData)
            .sort(([, a], [, b]) => b - a)
            .map(([stage, views]) => (
              <HeatMapItem
                key={stage}
                label={getStageLabel(stage as FinancialStage, "financial")}
                value={views}
                intensity={getIntensity(views, maxFinancialStageViews)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

