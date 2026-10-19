import Link from "next/link";

interface ProjectsTeaserProps {
  githubUrl: string;
  /** Show the "All projects" link (home page only). */
  showAllLink?: boolean;
}

/** The "more on the way" cell that closes a project grid and keeps the cell count even. */
export function ProjectsTeaser({ githubUrl, showAllLink = false }: ProjectsTeaserProps) {
  return (
    <div className="cell hue-orange flex flex-col justify-center sm:[&:last-child:nth-child(odd)]:col-span-2">
      <p className="hud text-faint">Next up</p>
      <h3 className="mt-4 text-3xl leading-[1.05] tracking-[-0.03em]">
        More projects <span className="accent-text">on the way</span>
      </h3>
      <p className="mt-3 leading-relaxed text-muted">
        Side projects, experiments and open-source work land here first. Follow along on GitHub for early builds.
      </p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Browse on GitHub
        </a>
        {showAllLink && (
          <Link href="/projects" className="btn btn-secondary">
            All projects
          </Link>
        )}
      </div>
    </div>
  );
}
