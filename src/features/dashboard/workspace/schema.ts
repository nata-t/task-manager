import type { Tables } from "@/types/database.types";

export const workspaceDetailKeys = {
  all: ["workspaceDetail"] as const,
  detail: (id: string) => [...workspaceDetailKeys.all, id] as const,
  projects: (id: string) => [...workspaceDetailKeys.all, id, "projects"] as const,
};

export type WorkspaceDetail = Tables<"workspaces"> & {
  workspace_members: { count: number }[] | null;
  profiles: Tables<"profiles"> | null;
};

export type ProjectWithTaskCounts = Tables<"projects"> & {
  tasks: Pick<Tables<"tasks">, "id" | "title" | "description" | "status" | "due_date">[] | null;
};
