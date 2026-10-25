"use client";

import { Check } from "lucide-react";
import { useProgress } from "@/components/progress-provider";
import { cn } from "@/lib/utils";

/** Round checkmark button that marks one lesson (all of its points) done or not done. */
export function LessonCheck({ title, pointIds }: { title: string; pointIds: readonly string[] }) {
  const { isSignedIn, completed, setItem } = useProgress();
  const isDone = pointIds.length > 0 && pointIds.every((id) => completed.has(id));
  const canToggle = isSignedIn && pointIds.length > 0;

  const toggle = () => {
    for (const id of pointIds) {
      if (completed.has(id) === isDone) void setItem(id, !isDone);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!canToggle}
      aria-pressed={isDone}
      aria-label={isDone ? `Mark "${title}" not done` : `Mark "${title}" done`}
      title={isSignedIn ? (isDone ? "Done. Click to undo" : "Mark done") : "Sign in to track your progress"}
      className={cn(
        "mr-2 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        isDone ? "border-accent bg-accent text-[var(--num-fg)]" : "border-line-strong text-transparent hover:border-accent hover:text-accent",
      )}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
    </button>
  );
}
