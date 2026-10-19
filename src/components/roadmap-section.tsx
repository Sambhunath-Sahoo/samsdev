import { ChevronDown, FileText, ListChecks } from "lucide-react";
import { chevron, summaryReset } from "@/components/details-styles";
import { ProgressCount } from "@/components/progress-count";
import { RoadmapPointCheckbox } from "@/components/roadmap-point-checkbox";
import { sectionPointIds, subsectionPointIds } from "@/lib/roadmap/point-ids";
import type { RoadmapPoint, RoadmapSection, RoadmapSubsection } from "@/types/roadmap";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

function PointItem({ point }: { point: RoadmapPoint }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <div className="pt-0.5">
        <RoadmapPointCheckbox pointId={point.id} title={point.title} />
      </div>
      <details className="group/point min-w-0 flex-1">
        <summary className={`${summaryReset} inline-flex items-center gap-2 text-muted hover:text-ink`}>
          <span className="group-open/point:font-medium group-open/point:text-ink">{point.title}</span>
          <ChevronDown className={`${chevron("point")} h-4 w-4`} aria-hidden />
        </summary>
        <div className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">
          <p>{point.detail}</p>
          <p className="mt-3 border-t border-line pt-3">
            <span className="hud accent-text mr-2">Check yourself</span>
            <span className="text-ink">{point.question}</span>
          </p>
        </div>
      </details>
    </li>
  );
}

function SubsectionItem({ subsection }: { subsection: RoadmapSubsection }) {
  const points = subsection.points ?? [];

  if (points.length === 0) {
    return (
      <li className="flex items-center gap-4 px-5 py-3.5">
        <FileText className="h-4 w-4 shrink-0 text-faint" aria-hidden />
        <span className="text-muted">{subsection.title}</span>
      </li>
    );
  }

  return (
    <li>
      <details data-collapsible className="group/sub">
        <summary className={`${summaryReset} flex items-center gap-4 px-5 py-3.5 hover:bg-bg-sunken`}>
          <ListChecks className="h-4 w-4 shrink-0 text-faint" aria-hidden />
          <span className="text-muted group-open/sub:text-ink">{subsection.title}</span>
          <ChevronDown className={`${chevron("sub")} h-4 w-4 text-muted`} aria-hidden />
          <span className="ml-auto flex shrink-0 items-center gap-3 text-sm text-muted">
            <ProgressCount ids={subsectionPointIds(subsection)} className="accent-text" />
            {plural(points.length, "point")}
          </span>
        </summary>
        <ul className="pb-3 pl-14 pr-5">
          {points.map((point) => (
            <PointItem key={point.id} point={point} />
          ))}
        </ul>
      </details>
    </li>
  );
}

export function RoadmapSectionRow({ section, index }: { section: RoadmapSection; index: number }) {
  const pointCount = sectionPointIds(section).length;
  const meta = [plural(section.subsections.length, "subsection"), pointCount > 0 ? plural(pointCount, "point") : "coming soon"].join(" • ");

  return (
    <details data-collapsible className="group/section border-b border-line last:border-b-0" open={pointCount > 0}>
      <summary className={`${summaryReset} flex items-center gap-4 bg-bg-sunken px-5 py-4 hover:brightness-[0.98]`}>
        <ChevronDown className={`${chevron("section")} h-5 w-5 text-ink`} aria-hidden />
        <span className="min-w-0 text-lg font-semibold text-ink-strong">
          <span className="sr-only">Section {index + 1}: </span>
          {section.title}
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-3 text-right text-sm text-muted">
          <ProgressCount ids={sectionPointIds(section)} className="accent-text" />
          <span className="hidden sm:inline">{meta}</span>
        </span>
      </summary>

      <div className="border-t border-line">
        <p className="px-5 pb-1 pt-4 text-sm text-faint">{section.goal}</p>
        <ul className="py-1">
          {section.subsections.map((sub) => (
            <SubsectionItem key={sub.title} subsection={sub} />
          ))}
        </ul>
        {section.doneWhen && (
          <div className="mx-5 mb-5 mt-2 border border-line bg-bg-raised p-4">
            <p className="hud text-faint">Done when</p>
            <ul className="mt-2 list-[square] space-y-1 pl-5 text-sm text-muted marker:text-[var(--app)]">
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
