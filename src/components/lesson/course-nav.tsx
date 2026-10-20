"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
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
      <p className="hud text-faint">Course contents</p>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <h2 className="text-xl tracking-tight">{trackTitle}</h2>
        <span className="font-mono text-xs text-faint">
          {doneCount}/{written.length}
        </span>
      </div>

      <label className="mt-4 flex items-center gap-2 border border-line bg-bg-raised px-3 py-2 focus-within:border-line-strong">
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
                className="flex w-full items-center gap-3 py-3 text-left hover:text-ink"
              >
                <span className="font-mono text-xs text-faint">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-ink-strong">{section.title}</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", isOpen && "rotate-180")} aria-hidden />
              </button>
              {isOpen && (
                <ul className="mb-3 ml-2 border-l border-line">
                  {items.map((item) => (
                    <li key={item.title}>
                      {item.slug ? (
                        <Link
                          href={`/roadmap/${trackId}/${item.slug}`}
                          aria-current={item.slug === activeSlug ? "page" : undefined}
                          className={cn(
                            "-ml-px flex items-center gap-2.5 border-l-2 px-3 py-1.5 text-sm hover:bg-bg-sunken",
                            item.slug === activeSlug ? "border-[var(--app)] bg-bg-sunken font-medium text-ink" : "border-transparent text-muted",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                              isDone(item) ? "border-[var(--app)] bg-[var(--app)] text-white" : "border-line-strong",
                            )}
                          >
                            {isDone(item) && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                          </span>
                          <span className="min-w-0">{item.title}</span>
                          {isDone(item) && <span className="sr-only">(done)</span>}
                        </Link>
                      ) : (
                        <p className="-ml-px flex items-center gap-2.5 border-l-2 border-transparent px-3 py-1.5 text-sm text-faint">
                          <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full border border-dashed border-line-strong" />
                          <span className="min-w-0">{item.title}</span>
                          <span className="hud ml-auto shrink-0 text-[10px]">Soon</span>
                        </p>
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
