import type { RoadmapTrack } from "@/types/roadmap";
import { DEVOPS } from "./devops";
import { SYSTEM_DESIGN } from "./system-design";

export const ROADMAP_TRACKS: readonly RoadmapTrack[] = [DEVOPS, SYSTEM_DESIGN];

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
