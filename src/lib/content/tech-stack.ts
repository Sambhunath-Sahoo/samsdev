import techStackData from "@/data/tech-stack.json";
import type { TechStackItem } from "@/types/content";

export const techStack: TechStackItem[] = techStackData as TechStackItem[];

export function getTechStack(): TechStackItem[] {
  return techStack;
}


