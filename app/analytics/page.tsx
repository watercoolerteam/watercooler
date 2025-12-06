import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AnalyticsDashboard } from "./analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics & Insights | Watercooler",
  description: "Discover what's trending in the startup ecosystem.",
};

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  // Get all approved startups with their data
  const startups = await prisma.startup.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      location: true,
      companyStage: true,
      financialStage: true,
      views: true,
      createdAt: true,
      logo: true,
      oneLiner: true,
    },
    orderBy: { views: "desc" },
  });

  // Calculate statistics
  const totalStartups = startups.length;
  const totalViews = startups.reduce((sum, s) => sum + s.views, 0);
  const avgViews = totalStartups > 0 ? Math.round(totalViews / totalStartups) : 0;

  // Category heat map data
  const categoryData = startups.reduce((acc, startup) => {
    if (startup.category) {
      acc[startup.category] = (acc[startup.category] || 0) + startup.views;
    }
    return acc;
  }, {} as Record<string, number>);

  // Location heat map data
  const locationData = startups.reduce((acc, startup) => {
    if (startup.location) {
      acc[startup.location] = (acc[startup.location] || 0) + startup.views;
    }
    return acc;
  }, {} as Record<string, number>);

  // Company stage heat map data
  const companyStageData = startups.reduce((acc, startup) => {
    if (startup.companyStage) {
      acc[startup.companyStage] = (acc[startup.companyStage] || 0) + startup.views;
    }
    return acc;
  }, {} as Record<string, number>);

  // Funding heat map data
  const financialStageData = startups.reduce((acc, startup) => {
    if (startup.financialStage) {
      acc[startup.financialStage] = (acc[startup.financialStage] || 0) + startup.views;
    }
    return acc;
  }, {} as Record<string, number>);

  // Most viewed startups
  const mostViewed = startups.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src="/logo-icon.png"
                  alt="Watercooler"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                Watercooler
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/browse"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Browse Startups
              </Link>
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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-lg text-gray-600">
            Discover what's trending in the startup ecosystem.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Startups</div>
            <div className="text-3xl font-bold text-gray-900">{totalStartups}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Views</div>
            <div className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Avg Views per Startup</div>
            <div className="text-3xl font-bold text-gray-900">{avgViews.toLocaleString()}</div>
          </div>
        </div>

        <AnalyticsDashboard
          categoryData={categoryData}
          locationData={locationData}
          companyStageData={companyStageData}
          financialStageData={financialStageData}
          mostViewed={mostViewed}
        />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Watercooler. A public directory of early-stage startups.
          </p>
        </div>
      </footer>
    </div>
  );
}

