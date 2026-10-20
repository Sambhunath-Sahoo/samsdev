import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { countLessons, countPoints, countSubsections } from "@/data/roadmap";
import type { RoadmapTrack } from "@/types/roadmap";

export function RoadmapTrackCard({ track, index }: { track: RoadmapTrack; index: string }) {
  const stats = [
    `${track.sections.length} sections`,
    `${countSubsections(track)} subsections`,
    `${countLessons(track)} lessons`,
    `${countPoints(track)} points written`,
  ];

  return (
    <Link
      href={`/roadmap/${track.id}`}
      className={`hue-${track.hue} invert-block cell group flex min-h-72 flex-col justify-between gap-10`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="hud">
          <span className="num">{index}</span>
        </p>
        <ArrowUpRight className="h-5 w-5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </div>
      <div>
        <h2 className="display-md text-inherit">{track.title}</h2>
        <p className="mt-3 max-w-md opacity-70">{track.description}</p>
        <p className="hud mt-6 flex flex-wrap gap-x-4 gap-y-1 opacity-70">
          {stats.map((stat) => (
            <span key={stat}>{stat}</span>
          ))}
        </p>
      </div>
    </Link>
  );
}
