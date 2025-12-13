"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Startup } from "@prisma/client";
import { StageIcon } from "@/components/stage-icons";
import { getStageLabel } from "@/lib/stage-utils";
import { formatRelativeDate, getEarlyAdopterLabel, isWithinLastHours } from "@/lib/date-utils";
import { UpdateTooltip } from "@/components/update-tooltip";

interface BrowseContentProps {
  startups: (Startup & {
    updates?: Array<{
      content: string;
      createdAt: Date;
    }>;
  })[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  search: string;
  category: string;
  location: string;
  sort: string;
}

export function BrowseContent({
  startups,
  currentPage,
  totalPages,
  totalCount,
  search,
  category,
  location,
  sort,
}: BrowseContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const buildUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    return `/browse?${params.toString()}`;
  };

  const handleSortChange = (newSort: string) => {
    router.push(buildUrl({ sort: newSort }));
  };

  const startItem = (currentPage - 1) * 12 + 1;
  const endItem = Math.min(currentPage * 12, totalCount);

  return (
    <div>
      {/* Active Search Filter */}
      {search && (
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Search: <span className="font-semibold">"{search}"</span>
            </span>
            <Link
              href={buildUrl({ search: null })}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Header with Sort and View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
            <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
            <span className="font-semibold text-gray-900">{totalCount}</span> startup
            {totalCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1 bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Grid view"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="List view"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {startups.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-6">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No startups found</h3>
          <p className="text-gray-600 mb-2 max-w-md mx-auto">
            {search || category || location
              ? "Try adjusting your filters or search terms to find what you're looking for."
              : "There are no startups available yet. Be the first to submit one!"}
          </p>
          {(search || category || location) ? (
            <Link 
              href="/browse" 
              className="inline-flex items-center mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              Clear all filters
              <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          ) : (
            <Link 
              href="/submit" 
              className="inline-flex items-center mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              Submit Your Startup
              <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} buildUrl={buildUrl} />
        </>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200 mb-8">
            {startups.map((startup) => (
              <StartupListItem key={startup.id} startup={startup} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} buildUrl={buildUrl} />
        </>
      )}
    </div>
  );
}

function StartupCard({ startup }: { startup: Startup & { updates?: Array<{ content: string; createdAt: Date }> } }) {
  const hasRecentUpdate = isWithinLastHours(startup.lastUpdateAt, 24);
  const updateCount = (startup as any).updateCount || 0;

  return (
    <Link
      href={`/startup/${startup.slug}`}
      className="group bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-lg relative"
    >
      {/* Update indicator - green dot */}
      {hasRecentUpdate && (
        <div className="absolute top-4 right-4 h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-sm" title="Updated in the last 24 hours" />
      )}

      <div className="flex items-start gap-4 mb-4">
        {startup.logo ? (
          <div className="flex-shrink-0 relative">
            <div className="relative h-14 w-14 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
              <Image
                src={startup.logo}
                alt={`${startup.name} logo`}
                width={56}
                height={56}
                className="object-contain p-2"
                unoptimized
              />
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-400">{startup.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors line-clamp-1">
            {startup.name}
          </h3>
          {startup.oneLiner && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-snug">{startup.oneLiner}</p>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 flex-wrap">
        {startup.category && (
          <>
            {startup.category.split(',').map((cat, idx) => (
              <span key={idx} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {cat.trim()}
              </span>
            ))}
          </>
        )}
        {updateCount > 0 && (
          <UpdateTooltip
            updateCount={updateCount}
            latestUpdate={startup.updates?.[0] || null}
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 cursor-help">
              <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {updateCount} {updateCount === 1 ? "update" : "updates"}
            </span>
          </UpdateTooltip>
        )}
        {startup.location && (
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {startup.location}
          </span>
        )}
      </div>

      {/* Stage Icons */}
      {(startup.companyStage || startup.financialStage) && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          {startup.companyStage && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-200">
              <StageIcon stage={startup.companyStage} type="company" className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">{getStageLabel(startup.companyStage, "company")}</span>
            </div>
          )}
          {startup.financialStage && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-200">
              <StageIcon stage={startup.financialStage} type="financial" className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">{getStageLabel(startup.financialStage, "financial")}</span>
            </div>
          )}
        </div>
      )}

      {/* Founder Highlights */}
      {((startup as any).founders && (startup as any).founders.length > 0) || startup.founderHighlight ? (
        <div className="mb-4 flex items-start gap-2 pl-3 border-l-2 border-gray-300">
          {/* Show founder icons */}
          <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
            {(startup as any).founders && (startup as any).founders.length > 0 ? (
              (startup as any).founders.map((_: any, idx: number) => (
                <svg key={idx} className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ))
            ) : (
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          {/* Show founder highlights - combine multiple on one line */}
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {(startup as any).founders && (startup as any).founders.length > 0 ? (
              (startup as any).founders
                .filter((f: any) => f.highlight)
                .map((f: any) => f.highlight)
                .join(", ")
            ) : (
              startup.founderHighlight
            )}
          </p>
        </div>
      ) : null}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          {startup.createdAt && (
            <span className="text-gray-500">{formatRelativeDate(startup.createdAt)}</span>
          )}
          {startup.website && (
            <div className="flex items-center gap-1 text-gray-400 group-hover:text-gray-600 transition-colors">
              <span className="font-medium truncate max-w-[120px]">
                {startup.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
              </span>
              <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          )}
        </div>
    </Link>
  );
}

function StartupListItem({ startup }: { startup: Startup & { updates?: Array<{ content: string; createdAt: Date }> } }) {
  const hasRecentUpdate = isWithinLastHours(startup.lastUpdateAt, 24);
  const updateCount = (startup as any).updateCount || 0;

  return (
    <Link
      href={`/startup/${startup.slug}`}
      className="group flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
    >
      {/* Logo */}
      {startup.logo ? (
        <div className="flex-shrink-0">
          <div className="relative h-16 w-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
            <Image
              src={startup.logo}
              alt={`${startup.name} logo`}
              width={64}
              height={64}
              className="object-contain p-2"
              unoptimized
            />
          </div>
        </div>
      ) : (
        <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-400">{startup.name.charAt(0).toUpperCase()}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
              {startup.name}
            </h3>
            {startup.oneLiner && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{startup.oneLiner}</p>
            )}
          </div>
          {startup.website && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
              <span className="font-medium">
                {startup.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
              </span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {startup.category && (
            <>
              {startup.category.split(',').map((cat, idx) => (
                <span key={idx} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {cat.trim()}
                </span>
              ))}
            </>
          )}
          {startup.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{startup.location}</span>
            </div>
          )}
          {startup.createdAt && (
            <span className="text-xs text-gray-500">{formatRelativeDate(startup.createdAt)}</span>
          )}
          {/* Stage Icons */}
          {(startup.companyStage || startup.financialStage) && (
            <div className="flex items-center gap-2">
              {startup.companyStage && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-200">
                  <StageIcon stage={startup.companyStage} type="company" className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">{getStageLabel(startup.companyStage, "company")}</span>
                </div>
              )}
              {startup.financialStage && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-200">
                  <StageIcon stage={startup.financialStage} type="financial" className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">{getStageLabel(startup.financialStage, "financial")}</span>
                </div>
              )}
            </div>
          )}
          {/* Update count and green dot - positioned on the right */}
          {updateCount > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <UpdateTooltip
                updateCount={updateCount}
                latestUpdate={startup.updates?.[0] || null}
              >
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 cursor-help">
                  <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {updateCount} {updateCount === 1 ? "update" : "updates"}
                </span>
              </UpdateTooltip>
              {hasRecentUpdate && (
                <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-sm flex-shrink-0" title="Updated in the last 24 hours" />
              )}
            </div>
          )}
        </div>

        {/* Founder Highlights */}
        {((startup as any).founders && (startup as any).founders.length > 0) || startup.founderHighlight ? (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-start gap-2 pl-3 border-l-2 border-gray-300">
              {/* Show founder icons */}
              <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                {(startup as any).founders && (startup as any).founders.length > 0 ? (
                  (startup as any).founders.map((_: any, idx: number) => (
                    <svg key={idx} className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ))
                ) : (
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              {/* Show founder highlights - combine multiple on one line */}
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-1">
                {(startup as any).founders && (startup as any).founders.length > 0 ? (
                  (startup as any).founders
                    .filter((f: any) => f.highlight)
                    .map((f: any) => f.highlight)
                    .join(", ")
                ) : (
                  startup.founderHighlight
                )}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  buildUrl,
}: {
  currentPage: number;
  totalPages: number;
  buildUrl: (updates: Record<string, string | null>) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 7;

  if (totalPages <= maxVisible) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show first, last, and pages around current
    if (currentPage <= 3) {
      // Near start
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(null); // Ellipsis
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near end
      pages.push(1);
      pages.push(null); // Ellipsis
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      // Middle
      pages.push(1);
      pages.push(null); // Ellipsis
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push(null); // Ellipsis
      pages.push(totalPages);
    }
  }

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={buildUrl({ page: currentPage > 1 ? String(currentPage - 1) : null })}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>

      {pages.map((page, idx) =>
        page === null ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl({ page: page === 1 ? null : String(page) })}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={buildUrl({ page: currentPage < totalPages ? String(currentPage + 1) : null })}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </nav>
  );
}

