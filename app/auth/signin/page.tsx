"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<"password" | "email">("password");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let result;

      if (authMethod === "password") {
        if (!password) {
          setError("Please enter your password");
          setIsLoading(false);
          return;
        }

        // Validate password length to match API requirements (8 characters minimum)
        if (password.length < 8) {
          setError("Password must be at least 8 characters");
          setIsLoading(false);
          return;
        }

        result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (result?.error) {
          setError("Invalid email or password. Please try again.");
        } else if (result?.ok) {
          window.location.href = "/dashboard";
        }
      } else {
        result = await signIn("email", {
          email,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (result?.error) {
          setError("Failed to send sign-in email. Please try again.");
        } else {
          setSuccess(true);
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a sign-in link to <strong>{email}</strong>. Please check
            your inbox (and spam folder) to complete sign-in.
          </p>
          <Link
            href="/"
            className="text-gray-900 font-medium hover:text-gray-700"
          >
            Return to Home →
          </Link>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-6">
              <Link
                href="/browse"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Browse
              </Link>
              <Link
                href="/submit"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Submit your startup
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600 mb-8">
            Sign in to your Watercooler account using Google, password, or email magic link.
          </p>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Google Sign In */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Toggle between password and email */}
          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setAuthMethod("password")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                authMethod === "password"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("email")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                authMethod === "email"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Magic Link
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                  minLength={8}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="your@email.com"
              />
            </div>

            {authMethod === "password" && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Enter your password"/>
                <p className="mt-1 text-sm text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-gray-900 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {authMethod === "password" ? "Signing in..." : "Sending..."}
                  </span>
                ) : (
                  authMethod === "password" ? "Sign In" : "Send Magic Link"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-gray-900 font-medium hover:text-gray-700">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
