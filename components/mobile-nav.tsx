"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative h-8 w-8">
                  <Image
                    src="/logo-icon.png"
                    alt="Watercooler"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">Watercooler</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-600"
              >
                <svg
                  className="h-6 w-6"
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
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-4">
              <Link
                href="/browse"
                className="block py-3 text-base font-medium text-gray-900 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Browse Startups
              </Link>
              <Link
                href="/submit"
                className="block py-3 text-base font-medium text-gray-900 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Submit Your Startup
              </Link>
              <Link
                href="/analytics"
                className="block py-3 text-base font-medium text-gray-900 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

