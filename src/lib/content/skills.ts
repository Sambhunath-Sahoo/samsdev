import { client } from "@/lib/sanity/client";
import { SKILLS_QUERY } from "@/lib/sanity/queries";
import type { SanityAboutSkills } from "@/types/content";

export async function getSkills(): Promise<SanityAboutSkills | null> {
  return client.fetch<SanityAboutSkills | null>(SKILLS_QUERY, {}, { next: { revalidate: 2 } });
}
