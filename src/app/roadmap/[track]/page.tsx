import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown } from "lucide-react";
import { FinalArchitecture } from "@/components/lesson/final-architecture";
import { RoadmapMindMap } from "@/components/roadmap-mind-map";
import { RoadmapTrackSection } from "@/components/roadmap-track-section";
import { countLessons, countPoints, countSubsections, getRoadmapTrack } from "@/data/roadmap";
import { listLessons } from "@/lib/roadmap/lessons";
import { toNavSections } from "@/lib/roadmap/nav-sections";

type RoadmapTrackParams = { params: Promise<{ track: string }> };

export async function generateMetadata({ params }: RoadmapTrackParams): Promise<Metadata> {
  const track = getRoadmapTrack((await params).track);
  if (!track) return {};
  return { title: `${track.title} roadmap`, description: track.description };
}

const MINUTES_PER_HOUR = 60;

const STAGES = [
  ["v1", "One server", "Docker, a registry and HTTPS on a single EC2 machine, set up by hand."],
  ["v2", "As code", "Terraform, a VPC, a load balancer with a certificate, secrets in a parameter store."],
  ["v3", "Automated", "GitHub Actions deploys on every push, two availability zones, alarms and a budget."],
  ["v4", "Smarter app", "A cache, a queue with a worker, a vector database and an LLM, with tracing."],
  ["v5", "Kubernetes", "EKS, GitOps with ArgoCD, Prometheus and Grafana, a WAF and private subnets."],
] as const;

function formatReadingTime(minutes: number): string {
  if (minutes < MINUTES_PER_HOUR) return `${minutes} min of lessons`;
  return `About ${Math.round(minutes / MINUTES_PER_HOUR)} h of lessons`;
}

export default async function RoadmapTrackPage({ params }: RoadmapTrackParams) {
  const track = getRoadmapTrack((await params).track);
  if (!track) notFound();

  const lessons = listLessons(track);
  const totalMinutes = lessons.reduce((sum, ref) => sum + ref.subsection.lesson.minutes, 0);
  const stats = [
    ["Course outline", `${track.sections.length} sections · ${countSubsections(track)} topics`],
    ["Lessons", `${countLessons(track)} written`],
    ["Time", totalMinutes > 0 ? formatReadingTime(totalMinutes) : "Coming soon"],
    ["Check yourself", `${countPoints(track)} points`],
  ] as const;

  return (
    <div className="px-4 pb-20 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[64rem] flex-col gap-4">
        <p className="eyebrow">Start your course</p>
        <h1 className="display-lg">Learn {track.title}</h1>
        <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-muted">{track.description}</p>

        <dl className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-x-6 gap-y-3 border-y border-line py-4">
          {stats.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="text-sm font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <Link
          href="#topics"
          className="inline-flex w-fit items-center gap-2 rounded-md bg-accent px-4 py-2 text-[0.8125rem] font-medium text-[var(--num-fg)] transition-opacity hover:opacity-90 motion-reduce:transition-none"
        >
          Choose your first topic <ArrowDown className="h-4 w-4" aria-hidden />
        </Link>

        <RoadmapMindMap trackId={track.id} trackTitle={track.title} sections={toNavSections(track)} />

        <div className="mt-4">
          <RoadmapTrackSection track={track} />
        </div>

        <section className="mt-8" aria-labelledby="building-heading">
          <h2 id="building-heading" className="text-xl">
            What we are building
          </h2>
          <p className="mt-2 max-w-[68ch] leading-relaxed text-muted">
            One real app, deployed five times, each version closer to how a team runs it in production. This is where it ends up.
          </p>
          <div className="mt-5">
            <FinalArchitecture />
          </div>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STAGES.map(([tag, name, text]) => (
              <li key={tag} className="rounded-xl bg-tint-sand p-4">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-xs font-semibold text-[var(--num-fg)]">{tag}</span>
                <p className="mt-3 font-semibold">{name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
