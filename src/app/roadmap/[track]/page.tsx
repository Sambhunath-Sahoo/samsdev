import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FinalArchitecture } from "@/components/lesson/final-architecture";
import { getRoadmapTrack } from "@/data/roadmap";
import { listLessons } from "@/lib/roadmap/lessons";
import type { RoadmapSection } from "@/types/roadmap";

type RoadmapTrackParams = { params: Promise<{ track: string }> };

export async function generateMetadata({ params }: RoadmapTrackParams): Promise<Metadata> {
  const track = getRoadmapTrack((await params).track);
  if (!track) return {};
  return { title: `${track.title} roadmap`, description: track.description };
}

const STAGES = [
  ["v1", "One server", "Docker, a registry and HTTPS on a single EC2 machine, set up by hand."],
  ["v2", "As code", "Terraform, a VPC, a load balancer with a certificate, secrets in a parameter store."],
  ["v3", "Automated", "GitHub Actions deploys on every push, two availability zones, alarms and a budget."],
  ["v4", "Smarter app", "A cache, a queue with a worker, a vector database and an LLM, with tracing."],
  ["v5", "Kubernetes", "EKS, GitOps with ArgoCD, Prometheus and Grafana, a WAF and private subnets."],
] as const;

function lessonCount(section: RoadmapSection) {
  return section.subsections.filter((sub) => sub.lesson).length;
}

export default async function RoadmapTrackPage({ params }: RoadmapTrackParams) {
  const track = getRoadmapTrack((await params).track);
  if (!track) notFound();

  const lessons = listLessons(track);
  const first = lessons[0];

  return (
    <div className="px-6 pb-24 pt-10 md:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-[72rem]">
        <p className="hud text-faint">Roadmap · {track.sections.length} topics · {lessons.length} lessons written</p>
        <h1 className="display-lg mt-3">
          <span className="accent-text">{track.title}</span>.
        </h1>
        <div aria-hidden className="mt-5 h-0.5 w-16 bg-[var(--app)]" />
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">{track.description}</p>
        {first && (
          <Link href={`/roadmap/${track.id}/${first.slug}`} className="btn btn-primary mt-6">
            Start reading <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}

        <h2 className="hud mt-14 text-faint">What we are building</h2>
        <p className="mt-3 max-w-[68ch] leading-relaxed text-muted">
          One real app, deployed five times, each version closer to how a team runs it in production. This is where it ends up.
        </p>
        <div className="mt-5">
          <FinalArchitecture />
        </div>
        <ol className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {STAGES.map(([tag, name, text]) => (
            <li key={tag} className="bg-bg-raised p-4">
              <span className="num">{tag}</span>
              <p className="mt-3 font-semibold">{name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>

        <h2 className="hud mt-14 text-faint">Topics</h2>
        <ul className="mt-5 grid gap-px border border-line bg-line md:grid-cols-2">
          {track.sections.map((section, i) => {
            const written = lessonCount(section);
            const target = lessons.find((ref) => ref.sectionTitle === section.title);
            const body = (
              <>
                <span className="hud flex items-center justify-between text-faint">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{written ? `${written} ${written === 1 ? "lesson" : "lessons"}` : "Soon"}</span>
                </span>
                <span className="mt-2 block text-lg font-semibold">{section.title}</span>
                <span className="mt-1 block text-sm text-muted">{section.goal}</span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {section.subsections.map((sub) => (
                    <span key={sub.title} className={`border border-line px-2 py-0.5 text-xs ${sub.lesson ? "text-ink" : "text-faint"}`}>
                      {sub.title}
                    </span>
                  ))}
                </span>
              </>
            );
            return (
              <li key={section.title} className="bg-bg-raised">
                {target ? (
                  <Link href={`/roadmap/${track.id}/${target.slug}`} className="block h-full p-5 transition-colors hover:bg-bg-sunken">
                    {body}
                  </Link>
                ) : (
                  <div className="h-full p-5">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
