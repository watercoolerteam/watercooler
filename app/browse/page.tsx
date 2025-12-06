import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import { BrowseContent } from "./browse-content";
import { BrowseSidebar } from "./browse-sidebar";
import { SearchBar } from "./search-bar";

export const metadata: Metadata = {
  title: "Browse Startups | Watercooler",
  description: "Browse and discover early-stage startups. Filter by category, location, and more.",
};

export const dynamic = "force-dynamic";

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
    let orderBy: any = { createdAt: "desc" };
    if (sort === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sort === "alphabetical") {
      orderBy = { name: "asc" };
    }

    // Get total count for pagination
    const totalCount = await prisma.startup.count({ where });

    // Get paginated startups
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const [startups, allStartups] = await Promise.all([
      prisma.startup.findMany({
        where,
        orderBy,
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.startup.findMany({
        where: { status: "APPROVED" },
        select: {
          category: true,
          location: true,
        },
      }),
    ]);

    const categories = Array.from(
      new Set(allStartups.map((s) => s.category).filter(Boolean))
    ).sort();
    const locations = Array.from(
      new Set(allStartups.map((s) => s.location).filter(Boolean))
    ).sort();

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
                Watercooler
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href="/submit"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Submit Your Startup
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Discover Startups
            </h1>
            <p className="text-lg text-gray-600">
              Explore early-stage startups building the future.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="mb-6">
            <SearchBar search={search} />
          </div>

          <div className="flex gap-8 items-start">
            {/* Sidebar Filters */}
            <BrowseSidebar
              category={category}
              location={location}
              companyStage={companyStage}
              financialStage={financialStage}
              categories={categories}
              locations={locations}
              totalCount={totalCount}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <BrowseContent
                startups={startups}
                currentPage={page}
                totalPages={totalPages}
                totalCount={totalCount}
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
    console.error("Error loading browse page:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Page</h1>
          <p className="text-gray-600 mb-6">
            We encountered an error while loading the startups. Please try again.
          </p>
          <Link
            href="/browse"
            className="rounded-md bg-gray-900 px-4 py-2 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            Refresh Page
          </Link>
        </div>
      </div>
    );
  }
}
