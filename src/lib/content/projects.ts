import projectsDetailedData from "@/data/projects-detailed.json";
import type { DetailedProject } from "@/types/content";

export const detailedProjects: DetailedProject[] =
  projectsDetailedData as DetailedProject[];

export function getDetailedProjects(): DetailedProject[] {
  return detailedProjects;
}

export function getDetailedProjectBySlug(slug: string): DetailedProject | undefined {
  return detailedProjects.find((p) => p.slug === slug);
}


