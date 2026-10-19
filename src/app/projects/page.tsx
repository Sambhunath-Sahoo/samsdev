import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Rail, SectionBar } from "@/components/section-shell";
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
        <section className="relative scanlines">
          <Rail className="relative">
            <SectionBar index="01" label="Work" aside={`${projects.length} project${projects.length === 1 ? "" : "s"}`} />
            <div className="section-pad">
              <Link href="/" className="hud inline-flex items-center gap-1.5 text-faint hover:text-ink">
                <ArrowLeft className="h-3 w-3" strokeWidth={2.5} /> Home
              </Link>
              <h1 className="display-xl mt-6 max-w-3xl">
                Things I&apos;ve <span className="accent-text">built</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                Full-stack products, system design, cloud architecture and performance work. Every entry links to
                the details.
              </p>
            </div>
          </Rail>
        </section>

        <section>
          <Rail>
            <SectionBar index="02" label="Projects" aside="Pick one to explore" />
            <div className="cell-grid sm:grid-cols-2">
              {projects.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
              <ProjectsTeaser githubUrl={githubUrl} />
            </div>
          </Rail>
        </section>
      </main>
      <Footer />
    </div>
  );
}
