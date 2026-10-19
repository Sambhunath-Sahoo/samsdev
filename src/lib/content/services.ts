import { RESUME_SERVICES } from "@/data/resume";
import type { SanityServiceItem } from "@/types/content";

export async function getServices(): Promise<SanityServiceItem[]> {
  return [...RESUME_SERVICES];
}
