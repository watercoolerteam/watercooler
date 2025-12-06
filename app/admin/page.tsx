"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Startup {
  id: string;
  name: string;
  slug: string;
  oneLiner: string | null;
  description: string;
  website: string | null;
  category: string | null;
  location: string | null;
  founderNames: string;
  founderEmail: string;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchStartups();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple password check - in production, use proper authentication
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    if (password === adminPassword) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      fetchStartups();
    } else {
      setError("Incorrect password");
    }
  };

  const fetchStartups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/startups");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch startups");
      }

      setStartups(data.startups || data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load startups";
      setError(errorMessage);
      console.error("Error fetching startups:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch("/api/admin/startups", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update startup status");
      }

      // Refresh the list
      await fetchStartups();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update startup";
      alert(errorMessage); // Simple alert for now - could be improved with toast notifications
      console.error("Error updating startup:", err);
    }
  };

  const filteredStartups = startups.filter((startup) => {
    if (filter === "ALL") return true;
    return startup.status === filter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Login</h1>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Enter admin password"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Default password: admin123
              </p>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-gray-900 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Watercooler
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  sessionStorage.removeItem("admin_authenticated");
                  setIsAuthenticated(false);
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "ALL"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All ({startups.length})
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "PENDING"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Pending ({startups.filter((s) => s.status === "PENDING").length})
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "APPROVED"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Approved ({startups.filter((s) => s.status === "APPROVED").length})
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "REJECTED"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Rejected ({startups.filter((s) => s.status === "REJECTED").length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading startups...</p>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">No startups found with status: {filter}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStartups.map((startup) => (
              <div
                key={startup.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{startup.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          startup.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : startup.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {startup.status}
                      </span>
                    </div>
                    {startup.oneLiner && (
                      <p className="text-gray-600 mb-2">{startup.oneLiner}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {startup.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      {startup.category && (
                        <div>
                          <span className="font-medium">Category:</span> {startup.category}
                        </div>
                      )}
                      {startup.location && (
                        <div>
                          <span className="font-medium">Location:</span> {startup.location}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Founder:</span> {startup.founderNames}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {startup.founderEmail}
                      </div>
                      {startup.website && (
                        <div>
                          <span className="font-medium">Website:</span>{" "}
                          <a
                            href={startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {startup.website}
                          </a>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(startup.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-6 flex flex-col gap-2">
                    {startup.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(startup.id, "APPROVED")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(startup.id, "REJECTED")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {startup.status === "APPROVED" && (
                      <Link
                        href={`/startup/${startup.slug}`}
                        target="_blank"
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                      >
                        View Live
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

