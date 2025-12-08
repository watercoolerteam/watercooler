"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export function AuthNavClient() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <Link
        href="/dashboard"
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
    >
      Sign In
    </Link>
  );
}
