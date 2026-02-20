import { getDetailedProjects } from "@/lib/content/projects";
import { WorkSectionClient } from "./work-section-client";

export async function WorkSection() {
  const projects = await getDetailedProjects();
  return <WorkSectionClient projects={projects} />;
}
