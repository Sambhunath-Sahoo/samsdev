import { Band, BandHead } from "@/components/section-shell";
import { ProjectCard } from "@/components/project-card";
import { ProjectsTeaser } from "@/components/projects-teaser";
import { getDetailedProjects } from "@/lib/content/projects";
import { getContacts } from "@/lib/content/contacts";
import socials from "@/data/socials.json";

/** Three cards plus the teaser keeps the grid an even 2×2 on desktop. */
const HOME_PROJECT_LIMIT = 3;

const DEFAULT_GITHUB = socials.find((s) => s.name === "GitHub")?.href ?? "";

export async function WorkSection({ index = "02" }: { index?: string }) {
  const [projects, contacts] = await Promise.all([getDetailedProjects(), getContacts()]);
  const featured = projects.slice(0, HOME_PROJECT_LIMIT);
  const hasMore = projects.length > HOME_PROJECT_LIMIT;

  return (
    <Band tone="ink" id="work">
      <BandHead
        eyebrow={`Chapter ${index} / Selected work`}
        title="Work"
        lead="AI and full stack products I designed and built. Pick one to open the case study."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
        <ProjectsTeaser githubUrl={contacts?.github ?? DEFAULT_GITHUB} showAllLink={hasMore} />
      </div>
    </Band>
  );
}
