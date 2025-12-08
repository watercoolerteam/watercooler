import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Startup Not Found</h1>
        <p className="text-gray-600 mb-8">
          The startup you're looking for doesn't exist or hasn't been approved yet.
        </p>
        <Link
          href="/browse"
          className="rounded-md bg-gray-900 px-4 py-2 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Browse
        </Link>
      </div>
    </div>
  );
}
