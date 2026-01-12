"use client";

import { useEffect } from "react";

/**
 * Forces the app to start at the top on initial load/refresh.
 * (User requested no scroll restoration.)
 */
export function ScrollToTopOnLoad() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable browser scroll restoration and force top.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return null;
}


