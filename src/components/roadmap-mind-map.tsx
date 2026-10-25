"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { NavItem, NavSection } from "@/components/lesson/course-nav";
import { useProgress } from "@/components/progress-provider";
import { hueClass, padIndex } from "@/lib/hues";
import { cn } from "@/lib/utils";

const CHIP_BASE =
  "inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs leading-snug transition-colors " +
  "border-[color-mix(in_srgb,var(--app)_35%,transparent)] bg-[color-mix(in_srgb,var(--app)_8%,var(--bg-raised))]";

function LessonChip({ trackId, item, isDone }: { trackId: string; item: NavItem; isDone: boolean }) {
  const content = (
    <>
      {isDone && <Check className="h-3 w-3 shrink-0 text-[var(--app-ink)]" strokeWidth={3} aria-hidden />}
      <span className="truncate">{item.title}</span>
      {isDone && <span className="sr-only">(done)</span>}
    </>
  );
  if (!item.slug) return <span className={cn(CHIP_BASE, "text-faint")}>{content}</span>;
  return (
    <Link
      href={`/roadmap/${trackId}/${item.slug}`}
      title={item.title}
      className={cn(CHIP_BASE, "text-ink hover:border-[var(--app)] hover:bg-[color-mix(in_srgb,var(--app)_16%,var(--bg-raised))]", isDone && "font-medium")}
    >
      {content}
    </Link>
  );
}

/** A left-to-right mind map: the course in the middle, one coloured branch per section, one chip per lesson. */
export function RoadmapMindMap({ trackId, trackTitle, sections }: { trackId: string; trackTitle: string; sections: readonly NavSection[] }) {
  const { completed } = useProgress();
  const isDone = (item: NavItem) => item.pointIds.length > 0 && item.pointIds.every((id) => completed.has(id));

  return (
    <section id="mindmap" aria-labelledby="mindmap-heading" className="mt-8 scroll-mt-24">
      <h2 id="mindmap-heading" className="text-xl">
        Mind map
      </h2>
      <p className="mt-2 max-w-[68ch] leading-relaxed text-muted">The whole course on one page. Each branch is a section, each chip a lesson. Done lessons get a tick.</p>

      <div className="mt-5 rounded-xl border border-line bg-bg-raised p-3 sm:p-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-0">
          <div className="flex items-center md:sticky md:top-24 md:shrink-0 md:self-start">
            <div className="grid min-h-24 w-full place-items-center rounded-3xl bg-accent px-6 py-5 text-center font-display text-lg leading-tight text-[var(--num-fg)] md:size-32 md:rounded-full">
              {trackTitle}
            </div>
            <span aria-hidden className="hidden h-0.5 w-8 bg-line-strong md:block" />
          </div>

          <ul className="relative min-w-0 flex-1 border-l-2 border-line-strong pl-6 md:pl-8">
            {sections.map((section, index) => (
              <li
                key={section.title}
                className={cn(
                  hueClass(index),
                  "relative flex flex-col gap-1.5 py-2 lg:flex-row lg:items-start lg:gap-4",
                  "before:absolute before:-left-6 before:top-[1.35rem] before:h-0.5 before:w-6 before:bg-line-strong md:before:-left-8 md:before:w-8",
                )}
              >
                <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[var(--app)] px-3 py-1 text-[0.8125rem] font-semibold text-[var(--num-fg)] lg:w-56">
                  <span className="text-xs opacity-80">{padIndex(index)}</span>
                  <span className="min-w-0">{section.title}</span>
                </span>
                <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5 lg:pt-0.5">
                  {section.items.map((item) => (
                    <li key={item.title} className="min-w-0 max-w-full">
                      <LessonChip trackId={trackId} item={item} isDone={isDone(item)} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
