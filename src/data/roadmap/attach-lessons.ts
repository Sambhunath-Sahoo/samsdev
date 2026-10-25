import type { LessonEntry, RoadmapSection, RoadmapSubsection, RoadmapTrack } from "@/types/roadmap";

const keyOf = (section: string, subsection: string) => `${section}::${subsection}`;

function mergeSubsection(base: RoadmapSubsection, entry: RoadmapSubsection | undefined): RoadmapSubsection {
  if (!entry || base.lesson) return base;
  // Saved progress is keyed on point ids, so the points already in the outline always win.
  return { ...base, slug: base.slug ?? entry.slug, lesson: entry.lesson, points: base.points ?? entry.points };
}

/** Returns a copy of `track` where outline subsections that have a written lesson entry get that lesson. */
export function attachLessons(track: RoadmapTrack, entries: readonly LessonEntry[]): RoadmapTrack {
  const bySubsection = new Map(
    entries.filter((entry) => entry.track === track.id).map((entry) => [keyOf(entry.section, entry.subsection.title), entry.subsection]),
  );
  const sections: RoadmapSection[] = track.sections.map((section) => ({
    ...section,
    subsections: section.subsections.map((sub) => mergeSubsection(sub, bySubsection.get(keyOf(section.title, sub.title)))),
  }));
  return { ...track, sections };
}
