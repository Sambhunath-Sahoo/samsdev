import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Band, BandHead } from "@/components/section-shell";
import { ProjectCard } from "@/components/project-card";
import { ProjectsTeaser } from "@/components/projects-teaser";
import { getDetailedProjects } from "@/lib/content/projects";
import { getContacts } from "@/lib/content/contacts";
import socials from "@/data/socials.json";

const DEFAULT_GITHUB = socials.find((s) => s.name === "GitHub")?.href ?? "";

export default async function ProjectsPage() {
  const [projects, contacts] = await Promise.all([getDetailedProjects(), getContacts()]);
  const githubUrl = contacts?.github ?? DEFAULT_GITHUB;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Band tone="lav" hero>
          <Link href="/" className="hud inline-flex items-center gap-1.5 text-muted hover:text-ink">
            <ArrowLeft className="h-3 w-3" strokeWidth={2.5} /> Home
          </Link>
          <p className="hud mt-6 text-muted">
            Chapter 01 / Work · {projects.length} project{projects.length === 1 ? "" : "s"}
          </p>
          <h1 className="pub-h1 mt-4 max-w-3xl">
            Things I&apos;ve <span className="pub-serif">built.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Full-stack products, system design, cloud architecture and performance work. Every entry links to
            the details.
          </p>
        </Band>

        <Band tone="ink">
          <BandHead eyebrow="Chapter 02 / Projects" title="Projects" lead="Pick one to explore." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
            <ProjectsTeaser githubUrl={githubUrl} />
          </div>
        </Band>
      </main>
      <Footer />
    </div>
  );
}
