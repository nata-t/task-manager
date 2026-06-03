"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getProject, getWorkspace } from "@/lib/data";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string | undefined;
  const projectId = params?.projectId as string | undefined;

  const workspace = workspaceId ? getWorkspace(workspaceId) : undefined;
  const project = projectId ? getProject(projectId) : undefined;

  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Sidebar toggle */}
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />

      <Separator orientation="vertical" className="mx-1 h-4" />

      {/* Breadcrumb */}
      <nav className="flex min-w-0 flex-1 items-center gap-1.5 text-xs">
        {workspace && (
          <>
            <Link
              href={`/dashboard/${workspace.id}`}
              className={cn(
                "flex items-center gap-1 rounded px-1.5 py-0.5 font-medium transition-colors",
                "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                !project && "text-foreground"
              )}
            >
              <span>{workspace.emoji}</span>
              <span className="truncate">{workspace.name}</span>
            </Link>
          </>
        )}

        {project && (
          <>
            <span className="text-muted-foreground/50">/</span>
            <span
              className="flex items-center gap-1 rounded px-1.5 py-0.5 font-medium text-foreground"
            >
              <span>{project.icon}</span>
              <span className="truncate">{project.name}</span>
            </span>
          </>
        )}
      </nav>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1">
        {/* Search */}
        <button
          className="flex h-7 items-center gap-2 rounded-md border border-border bg-sidebar-accent/50 px-2.5 text-xs text-muted-foreground transition-colors hover:border-sidebar-primary/50 hover:bg-sidebar-accent hover:text-foreground"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 256 256"
            fill="currentColor"
          >
            <path d="M229.66,218.34l-50.06-50.07a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.31-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
          </svg>
          <span className="hidden sm:inline">Search…</span>
          <kbd className="hidden rounded border border-border px-1 font-mono text-[10px] sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 256 256"
            fill="currentColor"
          >
            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
