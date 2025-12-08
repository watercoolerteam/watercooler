import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { CompanyStage, FinancialStage } from "@prisma/client";
import { BrowseContent } from "./browse-content";
import { BrowseSidebar } from "./browse-sidebar";
import { SearchBar } from "./search-bar";
import { MobileFilters } from "@/components/mobile-filters";

export const metadata: Metadata = {
  title: "Browse Startups | Watercooler",
  description: "Browse and discover early-stage startups. Filter by category, location, and more.",
};

// Page must be dynamic because it uses searchParams
export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 12;

interface BrowsePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
    companyStage?: string;
    financialStage?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set");
      throw new Error("Database configuration is missing. Please check your environment variables.");
    }

    const params = await searchParams;
    const search = params.search || "";
    const category = params.category || "";
    const location = params.location || "";
    const companyStage = params.companyStage || "";
    const financialStage = params.financialStage || "";
    const page = parseInt(params.page || "1", 10);
    const sort = params.sort || "newest";

    const where: any = {
      status: "APPROVED",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { oneLiner: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (companyStage) {
      where.companyStage = companyStage;
    }

    if (financialStage) {
      where.financialStage = financialStage;
    }

    // Determine sort order
    let orderBy: any = { createdAt: "desc" }; // Default: newest first
    if (sort === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sort === "alphabetical") {
      orderBy = { name: "asc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    }

    // Get total count for pagination - with error handling
    let totalCount = 0;
    try {
      totalCount = await prisma.startup.count({ where });
    } catch (countError) {
      console.error("Error counting startups:", countError);
      if (countError instanceof Error) {
        console.error("Error details:", {
          message: countError.message,
          name: countError.name,
          stack: countError.stack,
        });
      }
      throw countError;
    }

    // Get paginated startups - run queries separately for better error handling
    const skip = (page - 1) * ITEMS_PER_PAGE;
    
    let startups: any[] = [];
    let allStartups: any[] = [];
    
    try {
      startups = await prisma.startup.findMany({
        where,
        orderBy,
        skip,
        take: ITEMS_PER_PAGE,
      });
    } catch (startupsError) {
      console.error("Error fetching paginated startups:", startupsError);
      if (startupsError instanceof Error) {
        console.error("Error details:", {
          message: startupsError.message,
          name: startupsError.name,
          stack: startupsError.stack,
        });
      }
      throw startupsError;
    }

    // Get filter options - non-blocking, can fail gracefully
    try {
      allStartups = await prisma.startup.findMany({
        where: { status: "APPROVED" },
        select: {
          category: true,
          location: true,
          companyStage: true,
          financialStage: true,
        },
      });
    } catch (filtersError) {
      console.error("Error fetching all startups for filters:", filtersError);
      // Continue with empty array - filters just won't show
      allStartups = [];
    }

    // Safely extract filter options with fallbacks
    const categories = Array.from(
      new Set(allStartups.map((s) => s.category).filter(Boolean))
    ).sort();
    const locations = Array.from(
      new Set(allStartups.map((s) => s.location).filter(Boolean))
    ).sort();

    const allCompanyStages = Array.from(
      new Set(allStartups.map((s) => s.companyStage).filter(Boolean))
    ).sort() as CompanyStage[];
    const allFinancialStages = Array.from(
      new Set(allStartups.map((s) => s.financialStage).filter(Boolean))
    ).sort() as FinancialStage[];

    // Ensure we have valid arrays
    const safeStartups = startups || [];
    const safeTotalCount = totalCount || 0;

    const totalPages = Math.ceil(safeTotalCount / ITEMS_PER_PAGE);

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <Image
                    src="/logo-icon.png"
                    alt="Watercooler"
                    width={40}
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Watercooler
                </span>
              </Link>
              <div className="hidden sm:flex items-center gap-4 sm:gap-6">
                <Link
                  href="/submit"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Submit
                </Link>
                <Link
                  href="/analytics"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Analytics
                </Link>
              </div>
              <Link
                href="/submit"
                className="sm:hidden rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Submit
              </Link>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                  Discover Startups
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  Explore early-stage startups building the future.
                </p>
              </div>

          {/* Prominent Search Bar */}
          <div className="mb-6">
            <SearchBar initialSearch={search} />
          </div>

          {/* Mobile Filters Button */}
          <div className="md:hidden mb-4">
            <MobileFilters
              category={category}
              location={location}
              companyStage={companyStage}
              financialStage={financialStage}
              categories={categories}
              locations={locations}
              allCompanyStages={allCompanyStages as CompanyStage[]}
              allFinancialStages={allFinancialStages as FinancialStage[]}
              totalCount={safeTotalCount}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
            {/* Sidebar Filters */}
            <BrowseSidebar
              category={category}
              location={location}
              companyStage={companyStage}
              financialStage={financialStage}
              categories={categories}
              locations={locations}
              allCompanyStages={allCompanyStages as CompanyStage[]}
              allFinancialStages={allFinancialStages as FinancialStage[]}
              totalCount={safeTotalCount}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <BrowseContent
                startups={safeStartups}
                currentPage={page}
                totalPages={totalPages}
                totalCount={safeTotalCount}
                search={search}
                category={category}
                location={location}
                sort={sort}
              />
            </div>
          </div>
        </div>

        <footer className="border-t border-gray-200 bg-white mt-20">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Watercooler. A public directory of early-stage startups.
            </p>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    // Log detailed error information
    console.error("Error loading browse page:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    // Check if it's a Prisma error
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isDatabaseError = errorMessage.includes("Prisma") || 
                           errorMessage.includes("database") ||
                           errorMessage.includes("connection");
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Page</h1>
          <p className="text-gray-600 mb-2">
            {isDatabaseError 
              ? "We're having trouble connecting to the database. Please try again in a moment."
              : "We encountered an error while loading the startups. Please try again."}
          </p>
          {process.env.NODE_ENV === 'development' && error instanceof Error && (
            <details className="mt-4 text-left bg-red-50 p-4 rounded-lg border border-red-200">
              <summary className="text-sm font-semibold text-red-800 cursor-pointer">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs text-red-700 overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          <div className="mt-6 space-y-3">
            <Link
              href="/browse"
              className="inline-block rounded-md bg-gray-900 px-4 py-2 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Refresh Page
            </Link>
            <div>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
