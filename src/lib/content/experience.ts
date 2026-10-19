import { RESUME_EXPERIENCE } from "@/data/resume";
import type { SanityExperienceItem } from "@/types/content";

/** Experience comes from the resume in code; Sanity entries are no longer used. */
export async function getExperience(): Promise<SanityExperienceItem[]> {
  return [...RESUME_EXPERIENCE];
}
