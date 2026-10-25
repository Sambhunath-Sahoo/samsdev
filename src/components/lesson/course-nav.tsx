"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { LessonCheck } from "@/components/lesson/lesson-check";
import { useProgress } from "@/components/progress-provider";
import { cn } from "@/lib/utils";

export interface NavItem {
  readonly title: string;
  /** Present only when the lesson is written. */
  readonly slug: string | null;
  readonly pointIds: readonly string[];
}

export interface NavSection {
  readonly title: string;
  readonly items: readonly NavItem[];
}

function sectionHasSlug(section: NavSection, slug: string | undefined): boolean {
  return slug !== undefined && section.items.some((item) => item.slug === slug);
}

/** Left-hand course tree: search box, collapsible sections, one row per lesson. */
export function CourseNav({ trackId, trackTitle, sections }: { trackId: string; trackTitle: string; sections: readonly NavSection[] }) {
  const pathname = usePathname();
  const { completed } = useProgress();
  const activeSlug = pathname.startsWith(`/roadmap/${trackId}/`) ? pathname.split("/")[3] : undefined;

  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<ReadonlySet<number>>(() => {
    const withActive = sections.findIndex((s) => sectionHasSlug(s, activeSlug));
    const firstWritten = sections.findIndex((s) => s.items.some((item) => item.slug));
    return new Set([withActive !== -1 ? withActive : Math.max(firstWritten, 0)]);
  });

  const needle = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      sections
        .map((section, index) => ({
          section,
          index,
          items: needle ? section.items.filter((item) => item.title.toLowerCase().includes(needle)) : section.items,
        }))
        .filter(({ items }) => items.length > 0),
    [sections, needle],
  );

  const isDone = (item: NavItem) => item.pointIds.length > 0 && item.pointIds.every((id) => completed.has(id));
  const written = sections.flatMap((s) => s.items).filter((item) => item.slug);
  const doneCount = written.filter(isDone).length;

  const toggle = (index: number) =>
    setOpened((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <nav aria-label={`${trackTitle} course contents`} className="px-4 py-5">
      <p className="eyebrow">Course contents</p>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <h2 className="text-xl">{trackTitle}</h2>
        <span className="pill pill-ok">
          {doneCount}/{written.length}
        </span>
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-bg-raised px-3 py-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
        <Search className="h-4 w-4 shrink-0 text-faint" aria-hidden />
        <span className="sr-only">Search lessons</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search lessons"
          className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
        />
      </label>

      <ol className="mt-4">
        {visible.map(({ section, index, items }) => {
          const isOpen = needle !== "" || opened.has(index);
          return (
            <li key={section.title} className="border-t border-line">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 rounded-lg py-3 text-left hover:text-ink"
              >
                <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent text-xs font-semibold text-[var(--num-fg)]">{index + 1}</span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-ink-strong">{section.title}</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", isOpen && "rotate-180")} aria-hidden />
              </button>
              {isOpen && (
                <ul className="mb-3 space-y-0.5">
                  {items.map((item) => (
                    <li key={item.title}>
                      {item.slug ? (
                        <div className={cn("flex items-center rounded-lg hover:bg-tint-lav", item.slug === activeSlug && "bg-tint-lav")}>
                          <Link
                            href={`/roadmap/${trackId}/${item.slug}`}
                            aria-current={item.slug === activeSlug ? "page" : undefined}
                            className={cn("min-w-0 flex-1 px-3 py-1.5 text-sm", item.slug === activeSlug ? "font-medium text-ink" : "text-muted")}
                          >
                            {item.title}
                          </Link>
                          <LessonCheck title={item.title} pointIds={item.pointIds} />
                        </div>
                      ) : (
                        <p className="px-3 py-1.5 text-sm text-faint">{item.title}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
      {visible.length === 0 && <p className="mt-4 text-sm text-muted">No lesson matches &ldquo;{query}&rdquo;.</p>}
    </nav>
  );
}
