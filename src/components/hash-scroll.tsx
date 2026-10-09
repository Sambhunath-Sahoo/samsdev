"use client";

import { useEffect } from "react";

/**
 * Scrolls to `location.hash` once the page content has mounted.
 *
 * Needed because the home route streams behind a loading skeleton: Next.js
 * scrolls to the hash while the skeleton is on screen, finds no matching
 * element and falls back to the top. Same-page hash clicks are still handled
 * by Next, so this only runs on mount.
 */
export function HashScroll() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  return null;
}
