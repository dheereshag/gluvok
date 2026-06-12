import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectClient } from "./client";
import { PROJECT_REGISTRY } from "@/lib/registry";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectTitle } from "@/components/projects/project-title";

type Props = {
  params: Promise<{ project: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const projectSlug = resolvedParams?.project || "";
  const config = PROJECT_REGISTRY[projectSlug];
  
  if (!config) return { title: "Not Found | gluvok Dashboard" };

  return {
    title: `${config.name} | gluvok Dashboard`,
    description: `Manage and track ${config.name} entities on the gluvok platform.`,
  };
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const projectSlug = resolvedParams?.project || "";
  const config = PROJECT_REGISTRY[projectSlug];

  if (!config) notFound();

  const { name: projectName, icon: IconComponent, data } = config;

  return (
    <>
      <ProjectHeader projectSlug={projectSlug} projectName={projectName} Icon={IconComponent} />
      <main className="p-6 w-full min-w-0">
        <ProjectTitle projectName={projectName} Icon={IconComponent} />
        <ProjectClient
          projectName={projectName}
          projectSlug={projectSlug}
          initialData={data}
        />
      </main>
    </>
  );
}
