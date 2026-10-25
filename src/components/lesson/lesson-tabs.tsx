"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TABS = ["Learn", "Review"] as const;
type Tab = (typeof TABS)[number];

/** Learn shows the note, Review shows the key points to tick. Both stay in the page so search can find them. */
export function LessonTabs({ learn, review }: { learn: React.ReactNode; review: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("Learn");

  return (
    <div>
      <div role="tablist" aria-label="Lesson view" className="flex gap-6 border-b border-line">
        {TABS.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            id={`tab-${name}`}
            aria-selected={tab === name}
            aria-controls={`panel-${name}`}
            onClick={() => setTab(name)}
            className={cn(
              "-mb-px rounded-t-md border-b-2 px-1 py-3 text-sm font-medium",
              tab === name ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {name}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="panel-Learn" aria-labelledby="tab-Learn" hidden={tab !== "Learn"} className="pt-8">
        {learn}
      </div>
      <div role="tabpanel" id="panel-Review" aria-labelledby="tab-Review" hidden={tab !== "Review"} className="pt-8">
        {review}
      </div>
    </div>
  );
}
