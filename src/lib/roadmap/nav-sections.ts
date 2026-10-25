import type { NavSection } from "@/components/lesson/course-nav";
import { subsectionPointIds } from "@/lib/roadmap/point-ids";
import type { RoadmapTrack } from "@/types/roadmap";

/** Only titles, slugs and ids go to the browser. Lesson bodies stay on the server. */
export function toNavSections(track: RoadmapTrack): NavSection[] {
  return track.sections.map((section) => ({
    title: section.title,
    items: section.subsections.map((sub) => ({
      title: sub.title,
      slug: sub.lesson && sub.slug ? sub.slug : null,
      pointIds: subsectionPointIds(sub),
    })),
  }));
}
