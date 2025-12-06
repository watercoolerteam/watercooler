"use client";

import { useEffect } from "react";

interface TrackViewProps {
  slug: string;
}

export function TrackView({ slug }: TrackViewProps) {
  useEffect(() => {
    // Track view after component mounts
    fetch(`/api/startup/${slug}/view`, {
      method: "POST",
    }).catch((error) => {
      // Silently fail - view tracking shouldn't break the page
      console.error("Failed to track view:", error);
    });
  }, [slug]);

  return null;
}

