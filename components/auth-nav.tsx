import { auth } from "@/auth";
import Link from "next/link";
import { ProfileNav } from "./profile-nav";

export async function AuthNav() {
  const session = await auth();

  if (session?.user) {
    return <ProfileNav />;
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
