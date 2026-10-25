"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PagerLink {
  readonly href: string;
  readonly title: string;
}

/** Previous / Next. A floating card on desktop, a bottom bar on small screens. */
export function LessonPager({ previous, next }: { previous?: PagerLink; next?: PagerLink }) {
  const navClass = "btn btn-secondary btn-sm flex-1 lg:w-full lg:flex-none";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-bg p-3 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-40 lg:flex-col lg:rounded-xl lg:border lg:p-2 lg:shadow-lg">
      {previous ? (
        <Link href={previous.href} className={navClass} title={previous.title}>
          <ChevronLeft className="h-4 w-4" aria-hidden /> Previous
        </Link>
      ) : null}
      {next ? (
        <Link href={next.href} className="btn btn-primary btn-sm flex-1 lg:w-full lg:flex-none" title={next.title}>
          Next <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
