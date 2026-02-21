import { client } from "@/lib/sanity/client";
import { WORK_EXPERIENCE_QUERY } from "@/lib/sanity/queries";
import type { SanityExperienceItem } from "@/types/content";

export async function getExperience(): Promise<SanityExperienceItem[]> {
  return client.fetch<SanityExperienceItem[]>(WORK_EXPERIENCE_QUERY);
}
