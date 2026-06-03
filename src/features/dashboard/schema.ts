import type { Tables } from "@/types/database.types";

export const workspaceKeys = {
  all: ["workspaces"] as const,
};

export type WorkspaceWithProjectsCount = Tables<"workspaces"> & {
  projects: { count: number }[] | null;
};
