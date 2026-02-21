import { client } from "@/lib/sanity/client";
import {
  DETAILED_PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
} from "@/lib/sanity/queries";
import type { DetailedProject } from "@/types/content";

export async function getDetailedProjects(): Promise<DetailedProject[]> {
  try {
    return await client.fetch(DETAILED_PROJECTS_QUERY, {}, { next: { revalidate: 0 } });
  } catch (e) {
    console.error("Failed to fetch projects from Sanity:", e);
    return [];
  }
}

export async function getDetailedProjectBySlug(
  slug: string
): Promise<DetailedProject | undefined> {
  try {
    const result = await client.fetch(PROJECT_BY_SLUG_QUERY, { slug }, { next: { revalidate: 0 } });
    if (result) return result;
  } catch (e) {
    console.error("Failed to fetch project from Sanity:", e);
  }
  return undefined;
}

