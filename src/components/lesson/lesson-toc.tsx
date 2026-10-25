"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/roadmap/lessons";
import { cn } from "@/lib/utils";

/** Right-hand "On this page" list. Highlights the heading nearest the top of the screen. */
export function LessonToc({ headings }: { headings: readonly Heading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const topmost = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (topmost) setActiveId(topmost.target.id);
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;
  return (
    <nav aria-label="On this page">
      <p className="eyebrow">On this page</p>
      <ul className="mt-3 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={heading.id === activeId ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pl-3 text-sm leading-snug hover:text-ink",
                heading.id === activeId ? "border-accent font-medium text-ink" : "border-transparent text-muted",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
