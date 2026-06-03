import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  UserPlus,
  FolderPlus,
  Trash2,
  Edit,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useUpdateWorkspace } from "../../lib/workspace-use-cases/use-update-workspace";
import { useDeleteWorkspace } from "../../lib/workspace-use-cases/use-delete-workspace";
import type { WorkspaceDetail, ProjectWithTaskCounts } from "../schema";

function formatDate(iso: string) {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateLatestDeadline(projects: ProjectWithTaskCounts[]) {
  if (!projects || projects.length === 0) return null;

  const times = projects
    .flatMap((p) => p.tasks || [])
    .map((t) => (t.due_date ? new Date(t.due_date).getTime() : 0))
    .filter((time) => time > 0);

  if (times.length === 0) return null;

  const latestDate = new Date(Math.max(...times));
  return formatDate(latestDate.toISOString());
}

interface WorkspaceHeaderProps {
  workspace: WorkspaceDetail;
  projects?: ProjectWithTaskCounts[];
}

export function WorkspaceHeader({
  workspace,
  projects = [],
}: WorkspaceHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(workspace.name);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

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

  const latestDeadline = calculateLatestDeadline(projects);
  const dateString = latestDeadline
    ? `created at ${formatDate(workspace.created_at)} - deadline ${latestDeadline}`
    : `created at ${formatDate(workspace.created_at)} - no active deadline`;

  return (
    <div className="flex items-center justify-between mb-">
      <div className="flex-1">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="h-10 text-2xl font-semibold px-2 w-full max-w-sm"
          />
        ) : (
          <h1
            className="text-3xl font-semibold hover:underline decoration-muted-foreground underline-offset-4 cursor-pointer inline-block tracking-tight"
            onClick={() => {
              setEditName(workspace.name);
              setIsEditing(true);
            }}
            title="Click to rename workspace"
          >
            {workspace.name}
          </h1>
        )}
        <p className="text-sm text-muted-foreground mt-1 tracking-tight">
          {dateString}
        </p>
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 mt-2">
            <Menu className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-2">
          <div className="flex flex-col gap-1">
            <Button variant="ghost" className="justify-start h-9 px-2 text-sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add member
            </Button>
            <Button variant="ghost" className="justify-start h-9 px-2 text-sm">
              <FolderPlus className="mr-2 h-4 w-4" />
              Add project
            </Button>
            <Button variant="ghost" className="justify-start h-9 px-2 text-sm">
              <Edit className="mr-2 h-4 w-4" />
              Action 1
            </Button>
            <Button variant="ghost" className="justify-start h-9 px-2 text-sm">
              <Edit className="mr-2 h-4 w-4" />
              Action 2
            </Button>
            <Button variant="ghost" className="justify-start h-9 px-2 text-sm">
              <Edit className="mr-2 h-4 w-4" />
              Action AT
            </Button>
            <div className="my-1 h-px bg-muted" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="justify-start h-9 px-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete workspace
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{workspace.name}"? This
                    action cannot be undone. All projects and tasks inside this
                    workspace will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      deleteWorkspace.mutate(workspace.id);
                    }}
                    disabled={deleteWorkspace.isPending}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
