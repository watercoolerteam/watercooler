import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { TrackView } from "./track-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
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

export default async function StartupPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      notFound();
    }

    const startup = await prisma.startup.findUnique({
      where: { slug },
    });

    if (!startup || startup.status !== "APPROVED") {
      notFound();
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
            <div className="flex items-center gap-4">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900 transition-colors">
                Browse Startups
              </Link>
              <Link href="/submit" className="text-gray-600 hover:text-gray-900 transition-colors">
                Submit Your Startup
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <div className="mb-6 flex items-start gap-6">
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
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {startup.name}
              </h1>
              {startup.oneLiner && (
                <p className="text-xl text-gray-600 mb-4">
                  {startup.oneLiner}
                </p>
              )}
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-lg inline-flex items-center gap-1"
                >
                  {startup.website.replace(/^https?:\/\//, "")} ↗
                </a>
              )}
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {startup.description}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {startup.category && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{startup.category}</dd>
                </div>
              )}
              {startup.location && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{startup.location}</dd>
                </div>
              )}
              {startup.founderNames && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Founder(s)</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {startup.founderNames}
                    {startup.founderHighlight && (
                      <span className="block mt-1 text-gray-500 text-xs">{startup.founderHighlight}</span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {(startup.founderXLink || startup.founderLinkedInLink) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Founder Links</h3>
              <div className="flex flex-wrap gap-4">
                {startup.founderXLink && (
                  <a
                    href={startup.founderXLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X (Twitter)
                  </a>
                )}
                {startup.founderLinkedInLink && (
                  <a
                    href={startup.founderLinkedInLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
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

          {!startup.claimedBy && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Are you the founder of {startup.name}?
              </p>
              <Link href="/claim" className="text-sm font-medium text-gray-900 hover:text-gray-700">
                Claim this startup →
              </Link>
            </div>
          )}
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
    notFound();
  }
}
