import type { RoadmapSection, RoadmapSubsection } from "@/types/roadmap";

/**
 * Section whose subsections are mostly outline. A plain string is an outline-only subsection;
 * pass a full subsection object (with `lesson` and `points`) once its note is written.
 */
export function outline(title: string, goal: string, subsections: readonly (string | RoadmapSubsection)[]): RoadmapSection {
  return { title, goal, subsections: subsections.map((item) => (typeof item === "string" ? { title: item } : item)) };
}
