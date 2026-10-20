import { ExpandControls } from "@/components/expand-controls";
import { ProgressCount } from "@/components/progress-count";
import { RoadmapSectionRow } from "@/components/roadmap-section";
import { countLessons, countPoints, countSubsections } from "@/data/roadmap";
import { sectionPointIds } from "@/lib/roadmap/point-ids";
import type { RoadmapTrack } from "@/types/roadmap";

export function RoadmapTrackSection({ track }: { track: RoadmapTrack }) {
  const summary = [
    `${track.sections.length} sections`,
    `${countSubsections(track)} subsections`,
    `${countLessons(track)} lessons`,
    `${countPoints(track)} points written`,
  ].join(" • ");

  return (
    <section id={track.id}>
      <div className="border-t border-line px-6 py-8 md:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4">
            <p className="text-ink">
              {summary}
              <ProgressCount ids={track.sections.flatMap(sectionPointIds)} className="accent-text before:mx-2 before:text-muted before:content-['•']" />
            </p>
            <ExpandControls />
          </div>
          <div className="border border-line">
            {track.sections.map((section, i) => (
              <RoadmapSectionRow key={section.title} trackId={track.id} section={section} index={i} />
            ))}
          </div>
        </div>
    </section>
  );
}
