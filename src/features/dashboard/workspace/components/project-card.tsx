"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FolderOpen, CheckSquare, Clock, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { ProjectWithTaskCounts } from "../schema";

function formatDate(iso: string) {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ProjectCardProps {
  project: ProjectWithTaskCounts;
  workspaceId: string;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function ProjectCard({
  project,
  workspaceId,
  onDelete,
  isDeleting,
}: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const tasks = project.tasks ?? [];
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "done"
  ).length;

  const handleSave = () => {
    setIsEditing(false);
    setEditName(project.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    else if (e.key === "Escape") {
      setEditName(project.name);
      setIsEditing(false);
    }
  };

  return (
    <Link href={`/dashboard/${workspaceId}/${project.id}`}>
      <Card className="group flex flex-col gap-4 p-5 transition-colors hover:bg-accent cursor-pointer">
        {/* Top row: icon + name + delete */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted group-hover:bg-background transition-colors">
            <FolderOpen size={18} className="text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div
                className="flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Input
                  ref={inputRef}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSave}
                  className="h-7 px-2 text-sm w-full max-w-[220px]"
                />
              </div>
            ) : (
              <p
                className="truncate text-sm font-medium text-card-foreground hover:underline decoration-muted-foreground underline-offset-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditName(project.name);
                  setIsEditing(true);
                }}
                title="Click to rename"
              >
                {project.name}
              </p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">
              Created {formatDate(project.created_at)}
            </p>
          </div>

          {/* Delete action */}
          <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{project.name}&quot;?
                    This will permanently delete all tasks inside it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    onClick={() => onDelete?.(project.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 -mt-1">
            {project.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-2 flex-wrap">
          {totalTasks === 0 ? (
            <span className="text-xs text-muted-foreground">No tasks yet</span>
          ) : (
            <>
              <Badge variant="secondary" className="gap-1 text-xs font-normal">
                <CheckSquare className="h-3 w-3" />
                {doneTasks}/{totalTasks} done
              </Badge>
              {inProgressTasks > 0 && (
                <Badge variant="outline" className="gap-1 text-xs font-normal">
                  {inProgressTasks} in progress
                </Badge>
              )}
              {overdueTasks > 0 && (
                <Badge
                  variant="destructive"
                  className="gap-1 text-xs font-normal opacity-80"
                >
                  <Clock className="h-3 w-3" />
                  {overdueTasks} overdue
                </Badge>
              )}
            </>
          )}
        </div>
      </Card>
    </Link>
  );
}
