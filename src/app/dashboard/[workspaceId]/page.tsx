import { WorkspaceDetailFeature } from "@/features/dashboard/workspace";

interface Props {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { workspaceId } = await params;
  
  return <WorkspaceDetailFeature workspaceId={workspaceId} />;
}
