"use client";

import { useState } from "react";
import { Search, Plus, FolderOpen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "../components/project-card";
import { useWorkspaceProjects } from "../../lib/workspace-use-cases/use-get-workspace-projects";
import { useCreateProject } from "../../lib/project-use-cases/use-create-project";
import { useDeleteProject } from "../../lib/project-use-cases/use-delete-project";

interface ProjectListProps {
  workspaceId: string;
}

export function ProjectList({ workspaceId }: ProjectListProps) {
  const [query, setQuery] = useState("");
  const {
    data: projects,
    isLoading,
    error,
  } = useWorkspaceProjects(workspaceId);
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const filtered =
    projects?.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    ) ?? [];

  return (
    <div className="mt-8">
      {/* Header */}
      <h2 className="mb-5 text-lg font-semibold tracking-tight text-foreground">
        Projects
      </h2>

      {/* Toolbar */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 w-72 pl-8 text-sm"
          />
        </div>

        <Button
          size="sm"
          className="ml-auto"
          onClick={() =>
            createProject.mutate({ workspaceId, name: "New Project" })
          }
          disabled={createProject.isPending}
        >
          {createProject.isPending ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="mr-1.5 h-3.5 w-3.5" />
          )}
          New project
        </Button>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin opacity-40" />
          <p className="text-sm">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="mt-20 flex flex-col items-center gap-3 text-destructive">
          <p className="text-sm font-medium">Failed to load projects</p>
        </div>
      ) : projects?.length === 0 ? (
        <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
          <FolderOpen className="h-8 w-8 opacity-40" />
          <p className="text-sm">No projects yet</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              createProject.mutate({ workspaceId, name: "New Project" })
            }
            disabled={createProject.isPending}
          >
            Create your first project
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
          <Search className="h-8 w-8 opacity-40" />
          <p className="text-sm">No projects match your search</p>
        </div>
      ) : (
        // all grid items should have the same height
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]  gap-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              workspaceId={workspaceId}
              onDelete={(id) =>
                deleteProject.mutate({ projectId: id, workspaceId })
              }
              isDeleting={deleteProject.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
