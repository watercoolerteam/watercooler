/**
 * Date formatting utilities for displaying submission dates
 */

/**
 * Format a date as a relative time (e.g., "2 days ago", "3 weeks ago")
 * Falls back to absolute date if older than 1 month
 */
export function formatRelativeDate(date: Date | string): string {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  } else {
    // For dates older than a year, show the full date
    return formatFullDate(then);
  }
}

/**
 * Format a date as a full date string (e.g., "January 15, 2024")
 */
export function formatFullDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date as a short date string (e.g., "Jan 15, 2024")
 */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get a human-readable label for how early someone is viewing a startup
 * (e.g., "Early adopter" if viewed within first week)
 */
export function getEarlyAdopterLabel(date: Date | string): string | null {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return "First day";
  } else if (diffDays < 7) {
    return "First week";
  } else if (diffDays < 30) {
    return "First month";
  } else if (diffDays < 90) {
    return "Early adopter";
  }
  return null;
}
