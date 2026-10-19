import { client } from "@/lib/sanity/client";
import { DETAILED_PROJECTS_QUERY, PROJECT_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import { LOCAL_PROJECTS } from "@/data/projects";
import type { DetailedProject } from "@/types/content";

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/**
 * Combines a code-defined project with its Sanity counterpart of the same slug.
 * Code fields win when set; empty strings and missing fields fall back to Sanity.
 * Galleries and links are combined rather than replaced.
 */
export function mergeProject(local: DetailedProject, remote: DetailedProject | undefined): DetailedProject {
  if (!remote) return local;
  return {
    ...remote,
    ...local,
    image: local.image || remote.image,
    videoUrl: local.videoUrl ?? remote.videoUrl,
    gallery: unique([...(local.gallery ?? []), ...(remote.gallery ?? [])]),
    links: { ...remote.links, ...local.links },
  };
}

/** Local projects first (merged with any Sanity twin), then the remaining Sanity projects. */
export function mergeProjects(
  local: readonly DetailedProject[],
  remote: readonly DetailedProject[],
): DetailedProject[] {
  const remoteBySlug = new Map(remote.map((p) => [p.slug, p]));
  const merged = local.map((p) => mergeProject(p, remoteBySlug.get(p.slug)));
  const localSlugs = new Set(local.map((p) => p.slug));
  return [...merged, ...remote.filter((p) => !localSlugs.has(p.slug))];
}

async function fetchSanityProjects(): Promise<DetailedProject[]> {
  try {
    return await client.fetch(DETAILED_PROJECTS_QUERY, {}, { next: { revalidate: 2 } });
  } catch (e) {
    console.error("Failed to fetch projects from Sanity:", e);
    return [];
  }
}

async function fetchSanityProjectBySlug(slug: string): Promise<DetailedProject | undefined> {
  try {
    return (await client.fetch(PROJECT_BY_SLUG_QUERY, { slug }, { next: { revalidate: 2 } })) ?? undefined;
  } catch (e) {
    console.error("Failed to fetch project from Sanity:", e);
    return undefined;
  }
}

export async function getDetailedProjects(): Promise<DetailedProject[]> {
  const remote = await fetchSanityProjects();
  return mergeProjects(LOCAL_PROJECTS, remote);
}

export async function getDetailedProjectBySlug(slug: string): Promise<DetailedProject | undefined> {
  const remote = await fetchSanityProjectBySlug(slug);
  const local = LOCAL_PROJECTS.find((p) => p.slug === slug);
  if (local) return mergeProject(local, remote);
  return remote;
}
