import { ROADMAP_TRACKS } from "@/data/roadmap";
import type { RoadmapSection, RoadmapSubsection } from "@/types/roadmap";

export function subsectionPointIds(subsection: RoadmapSubsection): string[] {
  return (subsection.points ?? []).map((point) => point.id);
}

export function sectionPointIds(section: RoadmapSection): string[] {
  return section.subsections.flatMap(subsectionPointIds);
}

/** Every point id that exists in the roadmap. The API accepts only these. */
export const ALL_POINT_IDS: ReadonlySet<string> = new Set(
  ROADMAP_TRACKS.flatMap((track) => track.sections.flatMap(sectionPointIds)),
);

export function isKnownPointId(value: unknown): value is string {
  return typeof value === "string" && ALL_POINT_IDS.has(value);
}
