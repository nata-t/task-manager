"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useGetProjectById } from "../lib/project-use-cases/use-get-project-by-id";
import { useGetProjectTasks } from "../lib/project-use-cases/use-get-project-tasks";
import { ProjectHeader } from "./components/project-header";
import { ProjectToolbar } from "./components/project-toolbar";
import { ListView } from "./sections/list-view";
import { BoardView } from "./sections/board-view";
import { useQueryState } from "nuqs";

export function ProjectDetailFeature({
  projectId,
  workspaceId,
}: {
  projectId: string;
  workspaceId: string;
}) {
  const {
    data: project,
    isLoading: isProjLoading,
    error: projError,
  } = useGetProjectById(projectId);
  const {
    data: tasks,
    isLoading: isTasksLoading,
    error: tasksError,
  } = useGetProjectTasks(projectId);

  const [viewMode, setViewMode] = useState<"list" | "board">("board");

  const [search] = useQueryState("q", { defaultValue: "" });
  const [statusFilter] = useQueryState("status", { defaultValue: "all" });
  const [assigneeFilter] = useQueryState("assignee", { defaultValue: "all" });

  if (isProjLoading || isTasksLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3 text-muted-foreground w-full h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin opacity-50" />
        <p className="text-sm">Loading project details...</p>
      </div>
    );
  }

  if (projError || tasksError || !project || !tasks) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3 text-destructive w-full h-[50vh]">
        <p className="text-sm font-medium">Failed to load project details</p>
      </div>
    );
  }

  const members = project.workspaces?.workspace_members || [];

  // Filter tasks inline based on query parameters
  const filteredTasks = tasks.filter((task) => {
    if (
      statusFilter !== "all" &&
      statusFilter !== "" &&
      task.status !== statusFilter
    )
      return false;
    if (
      assigneeFilter !== "all" &&
      assigneeFilter !== "" &&
      task.assignee_id !== assigneeFilter
    )
      return false;
    if (search && !task.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="p-8 max-w-[1400px] w-full mx-auto flex flex-col gap-2 h-full">
      <ProjectHeader project={project} />
      <ProjectToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        members={members}
      />

      <div className="mt-2 flex-1">
        {viewMode === "list" ? (
          <ListView
            tasks={filteredTasks}
            projectId={projectId}
            members={members}
          />
        ) : (
          <BoardView
            tasks={filteredTasks}
            projectId={projectId}
            members={members}
          />
        )}
      </div>
    </div>
  );
}
