"use client";

import { Loader2 } from "lucide-react";
import { useWorkspaceById } from "../lib/workspace-use-cases/use-get-workspace-by-id";
import { useWorkspaceProjects } from "../lib/workspace-use-cases/use-get-workspace-projects";
import { WorkspaceHeader } from "./components/workspace-header";
import TabsSection from "./sections/tabs";
import { ProjectList } from "./sections/project-list";

export function WorkspaceDetailFeature({ workspaceId }: { workspaceId: string }) {
  const { data: workspace, isLoading: isLoadingWorkspace, error: workspaceError } = useWorkspaceById(workspaceId);
  const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useWorkspaceProjects(workspaceId);

  const isLoading = isLoadingWorkspace || isLoadingProjects;
  const error = workspaceError || projectsError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3 text-muted-foreground w-full h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin opacity-50" />
        <p className="text-sm">Loading workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3 text-destructive w-full h-[50vh]">
        <p className="text-sm font-medium">Failed to load workspace details</p>
      </div>
    );
  }

  if (!workspace || !projects) {
    return null; // or empty state, but normally handled by the loading/error states
  }

  return (
    <div className="p-8 max-w-[1200px] w-full mx-auto">
      <WorkspaceHeader workspace={workspace} projects={projects} />
      <TabsSection workspaceId={workspaceId} />
      <ProjectList />
    </div>
  );
}
