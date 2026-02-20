import { client } from "@/lib/sanity/client";
import {
  DETAILED_PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
} from "@/lib/sanity/queries";
import type { DetailedProject } from "@/types/content";
import fallbackProjects from "@/data/projects-detailed.json";

export async function getDetailedProjects(): Promise<DetailedProject[]> {
  try {
    const projects = await client.fetch(DETAILED_PROJECTS_QUERY);
    if (projects && projects.length > 0) return projects;
  } catch (e) {
    console.error("Failed to fetch projects from Sanity:", e);
  }
  return fallbackProjects as unknown as DetailedProject[];
}

export async function getDetailedProjectBySlug(
  slug: string
): Promise<DetailedProject | undefined> {
  try {
    const result = await client.fetch(PROJECT_BY_SLUG_QUERY, { slug });
    if (result) return result;
  } catch (e) {
    console.error("Failed to fetch project from Sanity:", e);
  }
  const fallback = (fallbackProjects as unknown as DetailedProject[]).find(
    (p) => p.slug === slug
  );
  return fallback ?? undefined;
}

