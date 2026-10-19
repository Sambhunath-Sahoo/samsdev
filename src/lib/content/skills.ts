import { RESUME_SKILLS } from "@/data/resume";
import type { SanityAboutSkills } from "@/types/content";

export async function getSkills(): Promise<SanityAboutSkills | null> {
  return RESUME_SKILLS;
}
