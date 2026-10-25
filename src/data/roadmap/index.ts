import type { RoadmapTrack } from "@/types/roadmap";
import { DEVOPS } from "./devops";
import { SYSTEM_DESIGN } from "./system-design";
import { attachLessons } from "./attach-lessons";
import { LESSON_ENTRIES } from "./lessons/registry";

export const ROADMAP_TRACKS: readonly RoadmapTrack[] = [DEVOPS, SYSTEM_DESIGN].map((track) => attachLessons(track, LESSON_ENTRIES));

export function getRoadmapTrack(id: string): RoadmapTrack | undefined {
  return ROADMAP_TRACKS.find((track) => track.id === id);
}

export function countSubsections(track: RoadmapTrack): number {
  return track.sections.reduce((total, section) => total + section.subsections.length, 0);
}

export function countPoints(track: RoadmapTrack): number {
  return track.sections.reduce(
    (total, section) => total + section.subsections.reduce((n, sub) => n + (sub.points?.length ?? 0), 0),
    0,
  );
}

export function countLessons(track: RoadmapTrack): number {
  return track.sections.reduce((total, section) => total + section.subsections.filter((sub) => sub.lesson).length, 0);
}
