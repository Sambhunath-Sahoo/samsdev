import type { RoadmapPoint, RoadmapSubsection } from "@/types/roadmap";

/** Builds a point whose id is `devops.<section>.<slug>`. Ids are permanent once published. */
export function point(section: string, slug: string, title: string, detail: string, question: string): RoadmapPoint {
  return { id: `devops.${section}.${slug}`, title, detail, question };
}

/** A subsection that has written points but no lesson yet. */
export function withPoints(title: string, points: readonly RoadmapPoint[]): RoadmapSubsection {
  return { title, points };
}
