import experienceData from "@/data/experience.json";
import type { ExperienceItem } from "@/types/content";

export const experience: ExperienceItem[] = experienceData as ExperienceItem[];

export function getExperience(): ExperienceItem[] {
  return experience;
}


