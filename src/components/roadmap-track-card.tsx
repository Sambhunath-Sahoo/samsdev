import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { countLessons, countPoints, countSubsections } from "@/data/roadmap";
import type { RoadmapTrack } from "@/types/roadmap";

const TINT_BY_INDEX = ["bg-tint-lav", "bg-tint-sand"] as const;

export function RoadmapTrackCard({ track, index }: { track: RoadmapTrack; index: string }) {
  const lessons = countLessons(track);
  const stats = [
    `${track.sections.length} sections`,
    `${countSubsections(track)} topics`,
    `${countPoints(track)} points written`,
  ];
  const tint = TINT_BY_INDEX[(Number(index) - 1) % TINT_BY_INDEX.length];

  return (
    <Link
      href={`/roadmap/${track.id}`}
      className={`hue-${track.hue} ${tint} group flex min-h-44 flex-col justify-between gap-5 rounded-xl p-4 transition-shadow hover:shadow-md motion-reduce:transition-none`}
    >
      <div className="flex items-start justify-between gap-4">
        <span aria-hidden className="grid h-8 w-8 place-items-center rounded-md bg-accent text-sm font-semibold text-[var(--num-fg)]">
          {Number(index)}
        </span>
        <span className={`pill ${lessons > 0 ? "pill-ok" : "pill-warn"}`}>{lessons > 0 ? `${lessons} lessons written` : "Soon"}</span>
      </div>
      <div>
        <h2 className="flex items-center gap-2 text-xl">
          {track.title}
          <ArrowUpRight className="h-5 w-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
        </h2>
        <p className="mt-1.5 max-w-md text-[0.8125rem] text-muted">{track.description}</p>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
          {stats.map((stat) => (
            <span key={stat}>{stat}</span>
          ))}
        </p>
      </div>
    </Link>
  );
}
