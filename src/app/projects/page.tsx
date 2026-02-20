import { Navbar } from "@/components/navbar";
import { WorkProjectsGrid } from "@/components/work-projects-grid";
import { getDetailedProjects } from "@/lib/content/projects";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProjectsPage() {
  const projects = await getDetailedProjects();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-8 container-padding">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="space-y-4">
              <p className="text-sm font-semibold text-blue-600">Work</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                RECENT PROJECTS
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                A comprehensive showcase of projects I&apos;ve built across full-stack development,
                system design, cloud architecture, and performance optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-12 container-padding">
        <div className="max-w-6xl mx-auto">
          <WorkProjectsGrid projects={projects} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 container-padding border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Sams. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
