import type { RoadmapSection } from "@/types/roadmap";

/** Outline-only section: subsections have titles but no written points yet. */
export function outline(title: string, goal: string, subsections: readonly string[]): RoadmapSection {
  return { title, goal, subsections: subsections.map((name) => ({ title: name })) };
}
