import { ChevronDown } from "lucide-react";
import { chevron, summaryReset } from "@/components/details-styles";
import { RoadmapPointCheckbox } from "@/components/roadmap-point-checkbox";
import type { RoadmapPoint } from "@/types/roadmap";

/** One key point: a progress checkbox and an expandable detail with a self-check question. */
export function PointItem({ point }: { point: RoadmapPoint }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <div className="pt-0.5">
        <RoadmapPointCheckbox pointId={point.id} title={point.title} />
      </div>
      <details className="group/point min-w-0 flex-1">
        <summary className={`${summaryReset} inline-flex items-center gap-2 rounded-md text-muted hover:text-ink`}>
          <span className="group-open/point:font-medium group-open/point:text-ink">{point.title}</span>
          <ChevronDown className={`${chevron("point")} h-4 w-4 motion-reduce:transition-none`} aria-hidden />
        </summary>
        <div className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">
          <p>{point.detail}</p>
          <p className="mt-3 rounded-lg bg-tint-sand p-3">
            <span className="eyebrow mr-2 text-warn-fg">Check yourself</span>
            <span className="text-ink">{point.question}</span>
          </p>
        </div>
      </details>
    </li>
  );
}
