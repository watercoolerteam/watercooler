"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddUpdateFormProps {
  startupSlug: string;
}

export function AddUpdateForm({ startupSlug }: AddUpdateFormProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Update content is required");
      return;
    }

    if (content.length > 1000) {
      setError("Update content must be less than 1000 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/startup/${startupSlug}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to post update");
      }

      // Reset form and refresh page
      setContent("");
      setIsExpanded(false);
      router.refresh();
    } catch (err) {
      console.error("Error posting update:", err);
      setError(err instanceof Error ? err.message : "Failed to post update");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full text-left px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
      >
        + Add an update
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 sm:p-8 border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Post an Update</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="update-content" className="block text-sm font-medium text-gray-700 mb-2">
          What's new?
        </label>
        <textarea
          id="update-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your progress... e.g., 'Launched MVP', 'Hit 100 users', 'Hired first engineer'"
          rows={4}
          maxLength={1000}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none"
          disabled={isLoading}
        />
        <p className="mt-1 text-sm text-gray-500">
          {content.length}/1000 characters
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isLoading ? "Posting..." : "Post Update"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsExpanded(false);
            setContent("");
            setError(null);
          }}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
