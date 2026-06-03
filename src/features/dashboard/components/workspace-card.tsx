import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Boxes, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { WorkspaceWithProjectsCount } from "../schema";
import { useUpdateWorkspace } from "../lib/workspace-use-cases/use-update-workspace";
import { useDeleteWorkspace } from "../lib/workspace-use-cases/use-delete-workspace";

function formatDate(iso: string) {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function WorkspaceCard({ workspace }: { workspace: WorkspaceWithProjectsCount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(workspace.name);
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const projectsData = workspace.projects as any;
  const projectCount = projectsData ? (Array.isArray(projectsData) ? projectsData[0]?.count : projectsData.count) || 0 : 0;

  const handleSave = () => {
    if (editName.trim() && editName.trim() !== workspace.name) {
      updateWorkspace.mutate({ id: workspace.id, name: editName.trim() });
    } else {
      setEditName(workspace.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditName(workspace.name);
      setIsEditing(false);
    }
  };

  return (
    <Link href={`/dashboard/${workspace.id}`}>
      <Card className="flex flex-row items-center gap-3 px-4 py-4 transition-colors hover:bg-accent cursor-pointer group">
        
        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted group-hover:bg-background transition-colors">
          <Boxes size={16} className="text-muted-foreground" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div 
              className="flex items-center gap-2"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <Input
                ref={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="h-7 text-sm px-2 w-full max-w-[200px]"
              />
            </div>
          ) : (
            <p 
              className="truncate text-sm font-medium text-card-foreground hover:underline decoration-muted-foreground underline-offset-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEditName(workspace.name);
                setIsEditing(true);
              }}
              title="Click to rename"
            >
              {workspace.name}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            Created {formatDate(workspace.created_at)}
            {projectCount > 0 && (
              <>
                {" · "}
                {projectCount} project{projectCount !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>

        {/* Delete Action */}
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive -ml-2 shrink-0 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{workspace.name}"? This action cannot be undone. All projects and tasks inside this workspace will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  onClick={() => deleteWorkspace.mutate(workspace.id)}
                  disabled={deleteWorkspace.isPending}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </Link>
  );
}
