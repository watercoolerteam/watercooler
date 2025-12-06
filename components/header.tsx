import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  showBrowse?: boolean;
  showAnalytics?: boolean;
}

export function Header({ showBrowse = true, showAnalytics = false }: HeaderProps) {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Watercooler"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Watercooler
            </span>
          </Link>
          <div className="flex items-center gap-6">
            {showBrowse && (
              <Link
                href="/browse"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Browse Startups
              </Link>
            )}
            {showAnalytics && (
              <Link
                href="/analytics"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Analytics
              </Link>
            )}
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
  );
}

