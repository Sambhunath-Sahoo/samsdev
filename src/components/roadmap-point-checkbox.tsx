"use client";

import { useProgress } from "@/components/progress-provider";

export function RoadmapPointCheckbox({ pointId, title }: { pointId: string; title: string }) {
  const { isSignedIn, completed, setItem } = useProgress();

  return (
    <input
      type="checkbox"
      checked={completed.has(pointId)}
      disabled={!isSignedIn}
      onChange={(event) => void setItem(pointId, event.target.checked)}
      aria-label={`Mark done: ${title}`}
      title={isSignedIn ? undefined : "Sign in to track your progress"}
      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-accent disabled:cursor-not-allowed disabled:opacity-40"
    />
  );
}
