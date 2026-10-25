import type { RoadmapSection, RoadmapSubsection } from "@/types/roadmap";

/** Returns a copy of `section` with `extra` subsections appended. Leaves the original untouched. */
export function extendSection(section: RoadmapSection, extra: readonly RoadmapSubsection[]): RoadmapSection {
  return { ...section, subsections: [...section.subsections, ...extra] };
}
