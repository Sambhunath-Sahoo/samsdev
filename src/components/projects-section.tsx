import { getFeaturedProjects } from "@/lib/content/featured-projects";
import { ProjectsSectionClient } from "./projects-section-client";

export async function ProjectsSection() {
  const projects = await getFeaturedProjects();
  return <ProjectsSectionClient projects={projects} />;
}
