"use client";

import { useEffect } from "react";

/**
 * Starts the app at the top on a fresh load or refresh instead of restoring
 * the previous scroll position. A URL with a hash is left alone so deep links
 * such as /#work still land on their section.
 */
export function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return null;
}
