"use client";

import { useProgress } from "@/components/progress-provider";

/** "3/15 done" for the given ids. Renders nothing while signed out. */
export function ProgressCount({ ids, className }: { ids: readonly string[]; className?: string }) {
  const { isSignedIn, completed } = useProgress();
  if (!isSignedIn || ids.length === 0) return null;

  const done = ids.filter((id) => completed.has(id)).length;
  return (
    <span className={className}>
      {done}/{ids.length} done
    </span>
  );
}
