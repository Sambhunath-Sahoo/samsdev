import type { Lesson, RoadmapSubsection, RoadmapTrack } from "@/types/roadmap";

export interface LessonRef {
  readonly slug: string;
  readonly subsection: RoadmapSubsection & { readonly lesson: Lesson };
  readonly sectionIndex: number;
  readonly sectionTitle: string;
  /** 1-based place among the written lessons of its section. */
  readonly position: number;
  /** Number of written lessons in its section. */
  readonly total: number;
}

export interface Heading {
  readonly id: string;
  readonly text: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Every written lesson of a track in reading order. Outline-only subsections are skipped. */
export function listLessons(track: RoadmapTrack): LessonRef[] {
  return track.sections.flatMap((section, sectionIndex) => {
    const written = section.subsections.filter(
      (sub): sub is RoadmapSubsection & { slug: string; lesson: Lesson } => Boolean(sub.lesson && sub.slug),
    );
    return written.map((subsection, i) => ({
      slug: subsection.slug,
      subsection,
      sectionIndex,
      sectionTitle: section.title,
      position: i + 1,
      total: written.length,
    }));
  });
}

export function findLesson(track: RoadmapTrack, slug: string): LessonRef | undefined {
  return listLessons(track).find((ref) => ref.slug === slug);
}

export function neighbours(track: RoadmapTrack, slug: string): { previous?: LessonRef; next?: LessonRef } {
  const all = listLessons(track);
  const index = all.findIndex((ref) => ref.slug === slug);
  if (index === -1) return {};
  return { previous: all[index - 1], next: all[index + 1] };
}

/** The "On this page" list. Ids match what the renderer puts on each h2. */
export function lessonHeadings(lesson: Lesson): Heading[] {
  return lesson.blocks.flatMap((block) => (block.type === "h2" ? [{ id: slugify(block.text), text: block.text }] : []));
}
