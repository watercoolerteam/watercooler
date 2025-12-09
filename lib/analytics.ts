/**
 * Google Analytics event tracking utilities
 */

declare global {
  interface Window {
    gtag: (
      command: "event" | "config" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

/**
 * Track a page view
 */
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
      page_path: url,
    });
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Track startup view
 */
export function trackStartupView(startupSlug: string, startupName: string) {
  trackEvent("view_startup", "Startup", startupName, undefined);
}

/**
 * Track startup submission
 */
export function trackStartupSubmission(startupName: string) {
  trackEvent("submit_startup", "Startup", startupName, undefined);
}

/**
 * Track startup claim
 */
export function trackStartupClaim(startupSlug: string) {
  trackEvent("claim_startup", "Startup", startupSlug, undefined);
}

/**
 * Track search
 */
export function trackSearch(query: string, resultsCount: number) {
  trackEvent("search", "Browse", query, resultsCount);
}

/**
 * Track update post
 */
export function trackUpdatePost(startupSlug: string) {
  trackEvent("post_update", "Startup", startupSlug, undefined);
}
