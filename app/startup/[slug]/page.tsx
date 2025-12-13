import { prisma } from "@/lib/prisma";
import { notFound, unstable_rethrow } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { TrackView } from "./track-view";
import { StageIcon } from "@/components/stage-icons";
import { getStageLabel } from "@/lib/stage-utils";
import { formatFullDate, formatRelativeDate, getEarlyAdopterLabel } from "@/lib/date-utils";
import { AuthNav } from "@/components/auth-nav";
import { auth } from "@/auth";
import { UpdateFeed } from "@/components/update-feed";
import { AddUpdateForm } from "@/components/add-update-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = String(resolvedParams.slug).trim();
  
  const startup = await prisma.startup.findUnique({
    where: { slug },
  });

  if (!startup || startup.status !== "APPROVED") {
    return {
      title: "Startup Not Found",
    };
  }

  return {
    title: `${startup.name} | Watercooler`,
    description: startup.oneLiner || startup.description,
    openGraph: {
      title: startup.name,
      description: startup.oneLiner || startup.description,
      type: "website",
    },
  };
}

// Cache startup profiles for 5 minutes
// This improves performance while still showing relatively fresh data
export const revalidate = 300;

export default async function StartupPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    if (!slug || typeof slug !== 'string') {
      console.error('[Startup Profile] Invalid slug parameter:', slug);
      notFound();
    }

    // Normalize slug - trim and ensure it's a string
    const normalizedSlug = String(slug).trim();
    
    if (!normalizedSlug) {
      console.error('[Startup Profile] Empty slug after normalization');
      notFound();
    }

    // Try to find the startup
    const startup = await prisma.startup.findUnique({
      where: { slug: normalizedSlug },
      include: {
        founders: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!startup) {
      // Get all approved startups for debugging
      const allApproved = await prisma.startup.findMany({
        where: { status: "APPROVED" },
        select: { slug: true, name: true, id: true },
      });
      
      console.error(`[Startup Profile] ❌ Startup not found for slug: "${normalizedSlug}"`);
      console.error(`[Startup Profile] 📋 Found ${allApproved.length} approved startups:`);
      allApproved.forEach(s => {
        console.error(`  - "${s.slug}" (${s.name})`);
      });
      
      // Try case-insensitive search as fallback
      const caseInsensitiveMatch = allApproved.find(
        s => s.slug.toLowerCase() === normalizedSlug.toLowerCase()
      );
      
      if (caseInsensitiveMatch) {
        console.error(`[Startup Profile] ⚠️ Found case-insensitive match: "${caseInsensitiveMatch.slug}" vs "${normalizedSlug}"`);
      }
      
      notFound();
    }

    if (startup.status !== "APPROVED") {
      console.error(`[Startup Profile] ❌ Startup "${startup.name}" (${startup.slug}) has status "${startup.status}", expected "APPROVED"`);
      notFound();
    }

    // Check if current user owns this startup
    const session = await auth();
    let isOwner = false;
    if (session?.user?.email && startup.claimedBy) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      isOwner = user?.id === startup.claimedBy;
    }

    // Fetch updates (with error handling in case table doesn't exist yet)
    let updates: Array<{
      id: string;
      content: string;
      updateNumber: number;
      createdAt: Date;
    }> = [];
    try {
      updates = await prisma.startupUpdate.findMany({
        where: { startupId: startup.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          updateNumber: true,
          createdAt: true,
        },
      });
    } catch (error) {
      // If the table doesn't exist yet, just use empty array
      console.error("Error fetching updates:", error);
      updates = [];
    }

  return (
    <>
      <TrackView slug={startup.slug} />
      <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
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
              <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Browse
              </Link>
              <Link href="/submit" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Submit your startup
              </Link>
              <AuthNav />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8 mb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-6 flex-1 min-w-0">
              {startup.logo && (
                <div className="flex-shrink-0">
                  <Image
                    src={startup.logo}
                    alt={`${startup.name} logo`}
                    width={80}
                    height={80}
                    className="rounded-lg object-contain"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {startup.name}
                </h1>
                {startup.oneLiner && (
                  <p className="text-lg sm:text-xl text-gray-600 mb-3">
                    {startup.oneLiner}
                  </p>
                )}
                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-base inline-flex items-center gap-1.5 font-medium"
                  >
                    {startup.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
            {isOwner && (
              <div className="flex-shrink-0">
                <Link
                  href={`/startup/${startup.slug}/edit`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Description & Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {startup.description}
              </p>
            </div>

            {/* Company Details */}
            <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {startup.category && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Category</dt>
                    <dd className="text-sm text-gray-900">
                      <div className="flex flex-wrap gap-2">
                        {startup.category.split(',').map((cat, idx) => (
                          <span key={idx} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                            {cat.trim()}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
                {startup.location && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
                    <dd className="text-sm text-gray-900">{startup.location}</dd>
                  </div>
                )}
                {startup.companyStage && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Company Stage</dt>
                    <dd className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
                        <StageIcon stage={startup.companyStage} type="company" className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-900">{getStageLabel(startup.companyStage, "company")}</span>
                    </dd>
                  </div>
                )}
                {startup.financialStage && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Funding</dt>
                    <dd className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50 border border-green-200">
                        <StageIcon stage={startup.financialStage} type="financial" className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-900">{getStageLabel(startup.financialStage, "financial")}</span>
                    </dd>
                  </div>
                )}
                {startup.createdAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Submitted</dt>
                    <dd className="text-sm text-gray-900">
                      <div className="flex flex-col gap-1">
                        <span>{formatFullDate(startup.createdAt)}</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-gray-500 text-xs">({formatRelativeDate(startup.createdAt)})</span>
                          {getEarlyAdopterLabel(startup.createdAt) && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                              {getEarlyAdopterLabel(startup.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </dd>
                  </div>
                )}
              </dl>

              {/* Claim Status - at bottom of details with grey line separator */}
              {startup.claimedBy ? (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">
                      Claimed
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    This startup has been claimed by its founder.
                  </p>
                  {!isOwner && (
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-gray-900 hover:text-gray-700 inline-flex items-center gap-1"
                    >
                      Manage in Dashboard →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Are you the founder of {startup.name}?
                  </p>
                  <Link
                    href="/claim"
                    className="text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                    Claim this startup →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Founders Only */}
          <div>
            {(startup.founders && startup.founders.length > 0) || startup.founderNames ? (
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-sm rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {startup.founders && startup.founders.length > 0 
                    ? startup.founders.length === 1 ? 'Founder' : 'Founders'
                    : startup.founderNames?.includes(',') || startup.founderNames?.includes('&') ? 'Founders' : 'Founder'}
                </h3>
                <div className="space-y-6">
                  {/* Display founders from Founder model if available */}
                  {startup.founders && startup.founders.length > 0 ? (
                    startup.founders.map((founder, index) => (
                      <div key={founder.id} className={index > 0 ? "pt-6 border-t border-gray-200" : ""}>
                        <div className="space-y-3">
                          <div>
                            <p className="text-base font-medium text-gray-900 mb-1">
                              {founder.name}
                            </p>
                            {founder.highlight && (
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {founder.highlight}
                              </p>
                            )}
                          </div>
                          
                          {(founder.xLink || founder.linkedInLink) && (
                            <div className="flex flex-col gap-3">
                              {founder.xLink && (
                                <a
                                  href={founder.xLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                  </svg>
                                  X
                                </a>
                              )}
                              {founder.linkedInLink && (
                                <a
                                  href={founder.linkedInLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5] text-white hover:bg-[#006399] transition-colors text-sm font-medium"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                  </svg>
                                  LinkedIn
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Fallback to old founder fields for backwards compatibility */
                    <div>
                      <div>
                        <p className="text-base font-medium text-gray-900 mb-1">
                          {startup.founderNames}
                        </p>
                        {startup.founderHighlight && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {startup.founderHighlight}
                          </p>
                        )}
                      </div>
                      
                      {(startup.founderXLink || startup.founderLinkedInLink) && (
                        <div className="pt-3">
                          <div className="flex flex-col gap-3">
                            {startup.founderXLink && (
                              <a
                                href={startup.founderXLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                X
                              </a>
                            )}
                            {startup.founderLinkedInLink && (
                              <a
                                href={startup.founderLinkedInLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5] text-white hover:bg-[#006399] transition-colors text-sm font-medium"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

          </div>
        </div>

        {/* Updates Section */}
        <div className="mt-8 space-y-6">
          {isOwner && (
            <AddUpdateForm startupSlug={startup.slug} />
          )}
          <UpdateFeed 
            updates={updates} 
            startupSlug={startup.slug}
            isOwner={isOwner}
          />
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Watercooler. A public directory of early-stage startups.
          </p>
        </div>
      </footer>
    </div>
    </>
  );
  } catch (error) {
    console.error("Error loading startup page:", error);
    // Re-throw Next.js special errors (like notFound) so they can be handled properly
    unstable_rethrow(error);
    // If it's not a Next.js special error, call notFound() to show 404 page
    notFound();
  }
}
