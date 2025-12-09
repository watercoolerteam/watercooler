"use client";

import { useState } from "react";
import { formatRelativeDate } from "@/lib/date-utils";

interface UpdateTooltipProps {
  updateCount: number;
  latestUpdate?: {
    content: string;
    createdAt: Date | string;
  } | null;
  children: React.ReactNode;
}

export function UpdateTooltip({ updateCount, latestUpdate, children }: UpdateTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (updateCount === 0 || !latestUpdate) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 w-72 z-50 pointer-events-none">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl p-4 text-sm relative">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700">
              <span className="font-semibold text-xs text-gray-300 uppercase tracking-wide">
                Latest Update
              </span>
              <span className="text-xs text-gray-400">
                {formatRelativeDate(latestUpdate.createdAt)}
              </span>
            </div>
            <p className="text-white leading-relaxed line-clamp-4 mt-2">
              {latestUpdate.content}
            </p>
            {/* Arrow pointing down */}
            <div className="absolute top-full right-6 -mt-1">
              <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
