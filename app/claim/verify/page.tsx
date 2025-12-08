"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type VerificationState = "loading" | "success" | "error";

interface VerificationResult {
  message: string;
  user: {
    id: string;
    email: string;
  };
  startups: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export default function VerifyClaimPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<VerificationState>("loading");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("No verification token provided");
      setState("error");
      return;
    }

    // Verify the token
    fetch(`/api/claim/verify?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setResult(data.data);
        setState("success");
      })
      .catch((err) => {
        setError(err.message || "Failed to verify token");
        setState("error");
      });
  }, [searchParams]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4 animate-pulse">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your claim request.
          </p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              href="/claim"
              className="block w-full rounded-md bg-gray-900 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              Request New Claim Link
            </Link>
            <Link
              href="/"
              className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
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
              <Link
                href="/browse"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Browse Startups
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
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
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Successfully Claimed!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your startup{result?.startups.length !== 1 ? "s have" : " has"}{" "}
            been successfully claimed.
          </p>

          {result && (
            <div className="mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Claimed Startup{result.startups.length !== 1 ? "s" : ""}:
              </h2>
              <ul className="space-y-3">
                {result.startups.map((startup) => (
                  <li
                    key={startup.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium text-gray-900">
                      {startup.name}
                    </span>
                    <Link
                      href={`/startup/${startup.slug}`}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      View →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-blue-800">
              <strong>What's next?</strong> You now have an account linked to
              your startup{result?.startups.length !== 1 ? "s" : ""}. In the
              future, you'll be able to edit your startup information, view
              analytics, and manage your profile from your dashboard.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full rounded-md bg-gray-900 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              Go to Dashboard
            </Link>
            <div className="flex gap-4 justify-center">
              <Link
                href="/browse"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Browse Startups
              </Link>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
