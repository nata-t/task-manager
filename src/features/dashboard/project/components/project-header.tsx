import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProject } from "../../lib/project-use-cases/use-update-project";
import type { ProjectDetail } from "../../lib/project-use-cases/use-get-project-by-id";

interface ProjectHeaderProps {
  project: ProjectDetail;
}

function formatDate(iso: string) {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const [editTitle, setEditTitle] = useState(project.name);
  const [editDesc, setEditDesc] = useState(project.description || "");

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  const updateProject = useUpdateProject();

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDesc) {
      descInputRef.current?.focus();
    }
  }, [isEditingDesc]);

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle.trim() !== project.name) {
      updateProject.mutate({
        id: project.id,
        workspaceId: project.workspace_id,
        name: editTitle.trim(),
      });
    } else {
      setEditTitle(project.name);
    }
    setIsEditingTitle(false);
  };

  const handleSaveDesc = () => {
    if (editDesc.trim() !== (project.description || "")) {
      updateProject.mutate({
        id: project.id,
        workspaceId: project.workspace_id,
        description: editDesc.trim(),
      });
    } else {
      setEditDesc(project.description || "");
    }
    setIsEditingDesc(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveTitle();
    else if (e.key === "Escape") {
      setEditTitle(project.name);
      setIsEditingTitle(false);
    }
  };

  const handleDescKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setEditDesc(project.description || "");
      setIsEditingDesc(false);
    }
    // Don't save on enter to allow multiline descriptions
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1">
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleSaveTitle}
            className="h-10 text-3xl font-semibold px-2 w-full max-w-lg border-primary"
          />
        ) : (
          <h1
            className="text-3xl font-semibold hover:underline decoration-muted-foreground underline-offset-4 cursor-pointer inline-block tracking-tight text-foreground transition-colors"
            onClick={() => {
              setEditTitle(project.name);
              setIsEditingTitle(true);
            }}
            title="Click to edit project name"
          >
            {project.name}
          </h1>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full max-w-2xl">
        {isEditingDesc ? (
          <Textarea
            ref={descInputRef}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            onKeyDown={handleDescKeyDown}
            onBlur={handleSaveDesc}
            placeholder="Add a project description..."
            className="text-sm resize-none min-h-[80px]"
          />
        ) : (
          <p
            className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors max-w-2xl whitespace-pre-wrap rounded-md hover:bg-muted/50 p-2 -ml-2 min-h-[40px] flex items-center"
            onClick={() => {
              setEditDesc(project.description || "");
              setIsEditingDesc(true);
            }}
            title="Click to edit project description"
          >
            {project.description || "Add a project description..."}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-1 tracking-tight">
        Created on {formatDate(project.created_at)}
      </p>
    </div>
  );
}
