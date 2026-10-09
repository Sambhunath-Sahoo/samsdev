import type { DetailedProject, ProjectStatus } from "@/types/content";

const LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In development",
};

export function projectStatus(project: DetailedProject): ProjectStatus {
  if (project.status) return project.status;
  return project.links?.live ? "live" : "in-progress";
}

export function projectStatusLabel(project: DetailedProject): string {
  return LABELS[projectStatus(project)];
}
