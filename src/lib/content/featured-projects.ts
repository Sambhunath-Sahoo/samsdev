import { client } from "@/lib/sanity/client";
import { FEATURED_PROJECTS_QUERY } from "@/lib/sanity/queries";
import type { FeaturedProject } from "@/types/content";
import fallbackProjects from "@/data/projects.json";

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const projects = await client.fetch(FEATURED_PROJECTS_QUERY);
    if (projects && projects.length > 0) return projects;
  } catch (e) {
    console.error("Failed to fetch featured projects from Sanity:", e);
  }
  return fallbackProjects as unknown as FeaturedProject[];
}
