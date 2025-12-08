import { auth } from "@/auth";
import Link from "next/link";

export async function AuthNav() {
  const session = await auth();

  if (session?.user) {
    return (
      <Link
        href="/dashboard"
        className="text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base font-medium"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base font-medium"
    >
      Sign In
    </Link>
  );
}
