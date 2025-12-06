import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="border-b border-gray-200 bg-white">
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
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/browse"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                Browse Startups
              </Link>
              <Link
                href="/submit"
                className="rounded-md bg-gray-900 px-3 py-2 sm:px-4 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Submit
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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center py-12 sm:py-24 lg:py-32 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900">
            This is where new startups get discovered.
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 max-w-2xl mx-auto">
            Watercooler is a public directory of early-stage startups. 
            Founders can submit their startup, and scouts, investors, and operators 
            can freely browse, search, and discover the next big thing.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <Link
              href="/browse"
              className="w-full sm:w-auto rounded-md bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors text-center"
            >
              Browse Startups
            </Link>
            <Link
              href="/submit"
              className="w-full sm:w-auto text-base font-semibold leading-6 text-gray-900 hover:text-gray-700 transition-colors text-center"
            >
              Submit Your Startup <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl py-24 sm:py-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.5 8.5 0 017.5 4.5M12 3a8.5 8.5 0 00-7.5 4.5" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Public by Default</h3>
              <p className="mt-2 text-sm text-gray-600">Browse and discover startups without any login required. Everything is open and accessible.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Simple Submission</h3>
              <p className="mt-2 text-sm text-gray-600">Founders can submit their startup with a simple form. No account needed to get started.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Search & Filter</h3>
              <p className="mt-2 text-sm text-gray-600">Easily search and filter startups by category, location, and more to find exactly what you're looking for.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Watercooler. A public directory of early-stage startups.
          </p>
        </div>
      </footer>
    </div>
  );
}
