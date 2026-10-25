import { ExpandControls } from "@/components/expand-controls";
import { ProgressCount } from "@/components/progress-count";
import { RoadmapTopicRow } from "@/components/roadmap-topic-row";
import { countLessons, countSubsections } from "@/data/roadmap";
import { sectionPointIds } from "@/lib/roadmap/point-ids";
import type { RoadmapTrack } from "@/types/roadmap";

/** "Choose a topic to learn": the track's sections as expandable rows, with the overall progress. */
export function RoadmapTrackSection({ track }: { track: RoadmapTrack }) {
  return (
    <section id="topics" aria-labelledby="topics-heading" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="topics-heading" className="text-2xl">
            Choose a topic to learn
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
            {track.sections.length} sections · {countSubsections(track)} topics · {countLessons(track)} lessons written
            <ProgressCount ids={track.sections.flatMap(sectionPointIds)} className="pill pill-ok" />
          </p>
        </div>
        <ExpandControls />
      </div>
      <div className="mt-4 space-y-2.5">
        {track.sections.map((section, i) => (
          <RoadmapTopicRow key={section.title} trackId={track.id} section={section} index={i} />
        ))}
      </div>
    </section>
  );
}
