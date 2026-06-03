import { ProjectDetailFeature } from "@/features/dashboard/project";

interface Props {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { workspaceId, projectId } = await params;

  return (
    <div className="flex-1 h-full w-full overflow-x-hidden bg-background">
      <ProjectDetailFeature workspaceId={workspaceId} projectId={projectId} />
    </div>
  );
}
