import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DetailedProject } from "@/types/content";
import { padIndex } from "@/lib/hues";
import { projectStatus, projectStatusLabel } from "@/lib/project-status";
import { CARD, TAG, TAG_ON } from "@/components/section-shell";
import { cn } from "@/lib/utils";

const MAX_TECH_CHIPS = 5;

export function ProjectCard({ project, index }: { project: DetailedProject; index: number }) {
  const tech = (project.tech ?? []).slice(0, MAX_TECH_CHIPS);

  return (
    <Link href={`/projects/${project.slug}`} className={cn(CARD, "pub-card-link group flex h-full flex-col !p-4")}>
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-3xl leading-none text-accent-ink">{padIndex(index)}</span>
        <p className="hud truncate text-muted">{project.subtitle}</p>
      </div>

      <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-xl border border-line bg-bg-sunken">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="grid h-full place-items-center font-display text-4xl text-faint">{project.title.charAt(0)}</div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-display text-xl leading-tight text-ink-strong">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={cn(TAG, projectStatus(project) === "live" && TAG_ON)}>{projectStatusLabel(project)}</span>
          {tech.map((item) => (
            <span key={item} className={TAG}>
              {item}
            </span>
          ))}
        </div>

        <span className="hud mt-auto flex items-center gap-1.5 pt-4 text-ink">
          Explore
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
