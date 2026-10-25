import Link from "next/link";
import { CARD } from "@/components/section-shell";
import { cn } from "@/lib/utils";

interface ProjectsTeaserProps {
  githubUrl: string;
  /** Show the "All projects" link (home page only). */
  showAllLink?: boolean;
}

/** The "more on the way" card that closes a project grid. */
export function ProjectsTeaser({ githubUrl, showAllLink = false }: ProjectsTeaserProps) {
  return (
    <div className={cn(CARD, "flex flex-col justify-center border-dashed sm:[&:last-child:nth-child(odd)]:col-span-2")}>
      <p className="hud text-muted">Next up</p>
      <h3 className="mt-3 font-display text-xl uppercase leading-tight text-ink-strong">
        More projects <span className="pub-serif text-[1.1em]">on the way</span>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Side projects, experiments and open-source work land here first. Follow along on GitHub for early builds.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          Browse on GitHub
        </a>
        {showAllLink && (
          <Link href="/projects" className="btn btn-secondary btn-sm">
            All projects
          </Link>
        )}
      </div>
    </div>
  );
}
