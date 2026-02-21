import { client } from "@/lib/sanity/client";
import { FEATURED_PROJECTS_QUERY } from "@/lib/sanity/queries";
import type { FeaturedProject } from "@/types/content";

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    return await client.fetch(FEATURED_PROJECTS_QUERY, {}, { next: { revalidate: 2 } });
  } catch (e) {
    console.error("Failed to fetch featured projects from Sanity:", e);
    return [];
  }
}
