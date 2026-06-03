"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/features/dashboard/lib/workspace-use-cases/use-get-workspaces";
import { useCreateWorkspace } from "@/features/dashboard/lib/workspace-use-cases/use-create-workspace";
import { Loader2 } from "lucide-react";

// Derive a deterministic accent color from the workspace name
const WORKSPACE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function getWorkspaceColor(id: string) {
  const code = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return WORKSPACE_COLORS[code % WORKSPACE_COLORS.length];
}

export function WorkspaceRail() {
  const params = useParams();
  const activeWorkspaceId = params?.workspaceId as string | undefined;

  const { data: workspaces = [] } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();

  return (
    <aside
      className={cn(
        "relative z-20 flex h-[calc(100svh-3.5rem)] mt-14 w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-sidebar py-3",
      )}
    >
      {/* Workspaces */}
      <nav className="mt-2 flex flex-1 flex-col items-center gap-1.5">
        {workspaces.map((workspace) => {
          const isActive = workspace.id === activeWorkspaceId;
          const color = getWorkspaceColor(workspace.id);
          return (
            <Tooltip key={workspace.id} delayDuration={200}>
              <TooltipTrigger asChild>
                <Link
                  href={`/dashboard/${workspace.id}`}
                  className={cn(
                    "group relative flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200",
                    "hover:scale-105 hover:shadow-lg",
                    isActive
                      ? "shadow-lg ring-2 ring-white/20 ring-offset-1 ring-offset-transparent"
                      : "opacity-70 hover:opacity-100",
                  )}
                  style={{
                    background: isActive
                      ? color
                      : `color-mix(in oklch, ${color} 60%, transparent)`,
                  }}
                  aria-label={workspace.name}
                >
                  <span className="text-base font-bold text-white leading-none">
                    {workspace.name.charAt(0).toUpperCase()}
                  </span>

                  {/* Active indicator pip */}
                  {isActive && (
                    <span className="absolute -left-0.75 top-1/2 h-4 w-0.75 -translate-y-1/2 rounded-full bg-white" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {workspace.name}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto flex flex-col items-center gap-1.5 pb-1">
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <button
              onClick={() => createWorkspace.mutate("New Workspace")}
              disabled={createWorkspace.isPending}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-xs text-muted-foreground",
                "transition-all duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-50",
              )}
              aria-label="Add workspace"
            >
              {createWorkspace.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                >
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                </svg>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Add workspace</TooltipContent>
        </Tooltip>

        {/* User avatar */}
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <button
              className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground ring-1 ring-border transition-all hover:ring-2 hover:ring-sidebar-primary"
              aria-label="User profile"
            >
              NT
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Natnael T.</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
