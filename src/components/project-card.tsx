import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DetailedProject } from "@/types/content";
import { hueClass, padIndex } from "@/lib/hues";
import { projectStatus, projectStatusLabel } from "@/lib/project-status";
import { cn } from "@/lib/utils";

const MAX_TECH_CHIPS = 5;

export function ProjectCard({ project, index }: { project: DetailedProject; index: number }) {
  const tech = (project.tech ?? []).slice(0, MAX_TECH_CHIPS);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn("group relative flex h-full flex-col bg-bg", hueClass(index))}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-3">
        <span className="hud num">{padIndex(index)}</span>
        <p className="hud truncate text-faint">{project.subtitle}</p>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg-sunken">
        <div className="absolute inset-x-5 top-5 -bottom-1 overflow-hidden border border-line bg-bg-raised transition-transform duration-300 group-hover:-translate-y-1.5">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <div className="grid h-full place-items-center font-display text-6xl text-faint">
              {project.title.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5 md:px-8 md:pb-8">
        <h3 className="text-3xl leading-none tracking-[-0.03em]">{project.title}</h3>
        <p className="mt-3 line-clamp-3 leading-relaxed text-muted">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className={cn("chip", projectStatus(project) === "live" && "chip-on")}>{projectStatusLabel(project)}</span>
          {tech.map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>

        <span className="hud mt-auto flex items-center gap-1.5 pt-6 text-muted transition-colors group-hover:text-ink">
          Explore
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
