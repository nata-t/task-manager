"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WORKSPACES } from "@/lib/data";
import { cn } from "@/lib/utils";

export function WorkspaceRail() {
  const params = useParams();
  const activeWorkspaceId = params?.workspaceId as string | undefined;

  return (
    <aside
      className={cn(
        "relative z-20 flex h-full w-14 flex-shrink-0 flex-col items-center gap-1 border-r border-border bg-[oklch(0.16_0_0)] py-3"
      )}
    >
      {/* App logo */}
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
        <span className="text-sm font-bold leading-none">K</span>
      </div>

      <div className="h-px w-8 bg-border/60" />

      {/* Workspaces */}
      <nav className="mt-2 flex flex-1 flex-col items-center gap-1.5">
        {WORKSPACES.map((workspace) => {
          const isActive = workspace.id === activeWorkspaceId;
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
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    background: isActive
                      ? workspace.color
                      : `color-mix(in oklch, ${workspace.color} 60%, transparent)`,
                  }}
                  aria-label={workspace.name}
                >
                  <span className="text-base leading-none">
                    {workspace.emoji}
                  </span>

                  {/* Active indicator pip */}
                  {isActive && (
                    <span className="absolute -left-[3px] top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-white" />
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
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-xs text-muted-foreground",
                "transition-all duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              aria-label="Add workspace"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 256 256"
                fill="currentColor"
              >
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
              </svg>
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
