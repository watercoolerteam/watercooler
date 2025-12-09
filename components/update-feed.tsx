"use client";

import { formatRelativeDate } from "@/lib/date-utils";

interface Update {
  id: string;
  content: string;
  updateNumber: number;
  createdAt: Date | string;
}

interface UpdateFeedProps {
  updates: Update[];
  startupSlug: string;
  isOwner: boolean;
}

export function UpdateFeed({ updates, startupSlug, isOwner }: UpdateFeedProps) {
  if (updates.length === 0 && !isOwner) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Updates</h2>
        {updates.length > 0 && (
          <span className="text-sm text-gray-500">
            {updates.length} {updates.length === 1 ? "update" : "updates"}
          </span>
        )}
      </div>

      {updates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No updates yet.</p>
          {isOwner && (
            <p className="text-sm text-gray-400">
              Share your progress with the community!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {updates.map((update) => (
            <div
              key={update.id}
              className="border-l-4 border-gray-900 pl-4 py-2"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Update {String(update.updateNumber).padStart(3, "0")}
                  </span>
                  <span className="text-sm text-gray-400">
                    {formatRelativeDate(
                      update.createdAt instanceof Date
                        ? update.createdAt
                        : new Date(update.createdAt)
                    )}
                  </span>
                </div>
              </div>
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {update.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
