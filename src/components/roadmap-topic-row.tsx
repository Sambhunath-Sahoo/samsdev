import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, FileText, ListChecks } from "lucide-react";
import { chevron, summaryReset } from "@/components/details-styles";
import { ProgressCount } from "@/components/progress-count";
import { PointItem } from "@/components/roadmap-point-item";
import { sectionPointIds, subsectionPointIds } from "@/lib/roadmap/point-ids";
import type { RoadmapSection, RoadmapSubsection } from "@/types/roadmap";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const ROW_CLASS = "flex items-center gap-3 rounded-lg bg-bg-raised px-4 py-3";

function SubsectionItem({ trackId, subsection }: { trackId: string; subsection: RoadmapSubsection }) {
  const points = subsection.points ?? [];

  if (subsection.lesson && subsection.slug) {
    return (
      <li>
        <Link href={`/roadmap/${trackId}/${subsection.slug}`} className={`${ROW_CLASS} group/lesson hover:bg-bg-sunken`}>
          <BookOpen className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          <span className="min-w-0 text-ink">{subsection.title}</span>
          <span className="ml-auto flex shrink-0 items-center gap-3 text-sm text-muted">
            <ProgressCount ids={subsectionPointIds(subsection)} className="pill pill-ok" />
            <span className="hidden sm:inline">{subsection.lesson.minutes} min lesson</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/lesson:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </span>
        </Link>
      </li>
    );
  }

  if (points.length === 0) {
    return (
      <li className={ROW_CLASS}>
        <FileText className="h-4 w-4 shrink-0 text-faint" aria-hidden />
        <span className="min-w-0 text-muted">{subsection.title}</span>
        <span className="pill pill-warn ml-auto">Soon</span>
      </li>
    );
  }

  return (
    <li className="rounded-lg bg-bg-raised">
      <details data-collapsible className="group/sub">
        <summary className={`${summaryReset} flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-bg-sunken`}>
          <ListChecks className="h-4 w-4 shrink-0 text-faint" aria-hidden />
          <span className="min-w-0 text-muted group-open/sub:text-ink">{subsection.title}</span>
          <ChevronDown className={`${chevron("sub")} h-4 w-4 text-muted motion-reduce:transition-none`} aria-hidden />
          <span className="ml-auto flex shrink-0 items-center gap-3 text-sm text-muted">
            <ProgressCount ids={subsectionPointIds(subsection)} className="pill pill-ok" />
            {plural(points.length, "point")}
          </span>
        </summary>
        <ul className="pb-3 pl-11 pr-4">
          {points.map((point) => (
            <PointItem key={point.id} point={point} />
          ))}
        </ul>
      </details>
    </li>
  );
}

/** A course topic as a full-width tinted row. Opens to its subsections, lessons and points. */
export function RoadmapTopicRow({ trackId, section, index }: { trackId: string; section: RoadmapSection; index: number }) {
  const pointIds = sectionPointIds(section);
  const lessonCount = section.subsections.filter((sub) => sub.lesson).length;
  const meta = `${plural(section.subsections.length, "topic")} · ${plural(lessonCount, "lesson")}`;

  return (
    <details data-collapsible className="group/section rounded-xl bg-tint-lav" open={pointIds.length > 0}>
      <summary className={`${summaryReset} flex items-center gap-3 rounded-xl px-4 py-3 hover:brightness-[0.98] sm:gap-4`}>
        <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-sm font-semibold text-[var(--num-fg)]">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-ink-strong">
            <span className="sr-only">Section {index + 1}: </span>
            {section.title}
          </span>
          <span className="block text-xs text-muted">{meta}</span>
        </span>
        <ProgressCount ids={pointIds} className="pill pill-ok shrink-0" />
        <ChevronDown className={`${chevron("section")} h-5 w-5 text-muted motion-reduce:transition-none`} aria-hidden />
      </summary>

      <div className="px-4 pb-4">
        <p className="pb-3 pl-1 text-sm text-muted">{section.goal}</p>
        <ul className="space-y-2">
          {section.subsections.map((sub) => (
            <SubsectionItem key={sub.title} trackId={trackId} subsection={sub} />
          ))}
        </ul>
        {section.doneWhen && (
          <div className="mt-3 rounded-lg bg-tint-sage p-4">
            <p className="eyebrow">Done when</p>
            <ul className="mt-2 list-[square] space-y-1 pl-5 text-sm text-muted marker:text-accent">
              {section.doneWhen.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}
