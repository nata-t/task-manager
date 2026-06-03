"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/features/dashboard/lib/workspace-use-cases/use-get-workspaces";
import { useWorkspaceProjects } from "@/features/dashboard/lib/workspace-use-cases/use-get-workspace-projects";
import { useCreateProject } from "@/features/dashboard/lib/project-use-cases/use-create-project";
import { Hash, Loader2, Plus } from "lucide-react";

// Deterministic UI helpers (DB has no color/icon columns)
const WS_COLORS = [
  "oklch(0.55 0.18 250)",
  "oklch(0.55 0.18 150)",
  "oklch(0.55 0.18 30)",
  "oklch(0.55 0.18 300)",
  "oklch(0.55 0.18 60)",
  "oklch(0.55 0.18 190)",
];

const PROJ_COLORS = [
  "oklch(0.60 0.20 250)",
  "oklch(0.60 0.20 130)",
  "oklch(0.60 0.20 20)",
  "oklch(0.60 0.20 310)",
  "oklch(0.60 0.20 70)",
];

function wsColor(id: string) {
  const code = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return WS_COLORS[code % WS_COLORS.length];
}

function projColor(id: string) {
  const code = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return PROJ_COLORS[code % PROJ_COLORS.length];
}

export function ProjectSidebar() {
  const params = useParams();
  const pathname = usePathname();

  const workspaceId = params?.workspaceId as string | undefined;
  const projectId = params?.projectId as string | undefined;

  const { data: workspaces } = useWorkspaces();
  const workspace = workspaces?.find((w) => w.id === workspaceId);
  const { data: projects = [] } = useWorkspaceProjects(workspaceId || "");
  const createProject = useCreateProject();

  return (
    <Sidebar
      collapsible="icon"
      className="!left-14 !top-14 !h-[calc(100svh-3.5rem)] border-r border-border"
    >
      <SidebarHeader className="px-3 pt-3 pb-2">
        {workspace ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
              style={{ background: wsColor(workspace.id), color: "white" }}
            >
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-xs font-semibold text-sidebar-foreground">
                {workspace.name}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {projects.length} projects
              </p>
            </div>
          </div>
        ) : (
          <div className="h-7 w-full animate-pulse rounded-lg bg-sidebar-accent" />
        )}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Overview link */}
        <SidebarGroup className="py-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={!projectId && pathname.includes(workspaceId ?? "")}
                tooltip="Overview"
                size="default"
              >
                <Link href={`/dashboard/${workspaceId}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                  >
                    <path d="M200,40H136V24a8,8,0,0,0-16,0V40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40ZM56,56h64v56H56Zm0,72h64v72H56Zm144,72H136V136h64Zm0-88H136V56h64Z" />
                  </svg>
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Projects */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Projects
          </SidebarGroupLabel>
          <SidebarGroupAction
            title="New project"
            aria-label="New project"
            onClick={() => {
              if (workspaceId) {
                createProject.mutate({ workspaceId, name: "New Project" });
              }
            }}
            disabled={!workspaceId || createProject.isPending}
          >
            {createProject.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => {
                const isActive = project.id === projectId;
                const total = project.tasks?.length || 0;
                const done =
                  project.tasks?.filter((t) => t.status === "done").length || 0;
                return (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={project.name}
                      size="default"
                      className={cn(
                        "group/proj",
                        isActive && "bg-sidebar-accent font-medium",
                      )}
                    >
                      <Link
                        href={`/dashboard/${workspaceId}/${project.id}`}
                        className="flex items-center gap-2"
                      >
                        <span
                          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs"
                          style={{
                            background: `color-mix(in oklch, ${projColor(project.id)} 20%, transparent)`,
                            color: projColor(project.id),
                          }}
                        >
                          <Hash className="h-3 w-3" />
                        </span>
                        <span className="flex-1 truncate text-xs">
                          {project.name}
                        </span>
                        {/* Task progress pill */}
                        <span
                          className={cn(
                            "ml-auto flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
                            "bg-sidebar-accent text-muted-foreground",
                            "group-data-[collapsible=icon]:hidden",
                          )}
                        >
                          {done}/{total}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              size="default"
              className="text-muted-foreground hover:text-sidebar-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 256 256"
                fill="currentColor"
              >
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,7.72,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-5.45,5.45,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-7.72,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-5.45-5.45,8,8,0,0,0-5.1-2.64L47.12,171.3a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-7.72,8,8,0,0,0-1.74-5.48L40.89,102.14a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,5.45-5.45A8,8,0,0,0,82.18,69.7L84.69,47.12a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,7.72,0,8,8,0,0,0,5.48-1.74l17.73-14.19a91.57,91.57,0,0,1,15,6.23L171.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,5.45,5.45,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.9,123.66Z" />
              </svg>
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
