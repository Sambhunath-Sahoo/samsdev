import { notFound } from "next/navigation";
import { getDetailedProjectBySlug } from "@/lib/content/projects";
import { ProjectDetail } from "@/components/project-detail";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getDetailedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
