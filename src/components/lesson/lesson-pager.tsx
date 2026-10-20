"use client";

import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useProgress } from "@/components/progress-provider";
import { cn } from "@/lib/utils";

interface PagerLink {
  readonly href: string;
  readonly title: string;
}

/** Previous / Mark done / Next. A floating card on desktop, a bottom bar on small screens. */
export function LessonPager({ pointIds, previous, next }: { pointIds: readonly string[]; previous?: PagerLink; next?: PagerLink }) {
  const { isSignedIn, completed, setItem } = useProgress();
  const isDone = pointIds.length > 0 && pointIds.every((id) => completed.has(id));

  const toggleDone = () => {
    for (const id of pointIds) {
      if (completed.has(id) === isDone) void setItem(id, !isDone);
    }
  };

  const navClass = "btn btn-secondary btn-sm flex-1 lg:w-full lg:flex-none";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-bg p-3 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-40 lg:flex-col lg:border lg:p-2 lg:shadow-lg">
      {previous ? (
        <Link href={previous.href} className={navClass} title={previous.title}>
          <ChevronLeft className="h-4 w-4" aria-hidden /> Previous
        </Link>
      ) : null}
      <button
        type="button"
        onClick={toggleDone}
        disabled={!isSignedIn || pointIds.length === 0}
        title={isSignedIn ? undefined : "Sign in to track your progress"}
        aria-pressed={isDone}
        className={cn("btn btn-sm flex-1 lg:w-full lg:flex-none disabled:cursor-not-allowed disabled:opacity-40", isDone ? "btn-secondary" : "btn-primary")}
      >
        <Check className="h-4 w-4" aria-hidden /> {isDone ? "Done" : "Mark done"}
      </button>
      {next ? (
        <Link href={next.href} className="btn btn-primary btn-sm flex-1 lg:w-full lg:flex-none" title={next.title}>
          Next <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
