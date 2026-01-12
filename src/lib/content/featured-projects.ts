import featuredProjectsData from "@/data/projects.json";
import type { FeaturedProject } from "@/types/content";

export const featuredProjects: FeaturedProject[] =
  featuredProjectsData as FeaturedProject[];

export function getFeaturedProjects(): FeaturedProject[] {
  return featuredProjects;
}


