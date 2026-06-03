import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/types/database.types";
import { workspaceDetailKeys } from "../../workspace/schema";

// Wait, the schema from workspace could be used. Or we can just build our own.
// Let's create project-keys
export const projectKeys = {
  all: ["projectDetail"] as const,
  detail: (id: string) => [...projectKeys.all, id] as const,
  tasks: (id: string) => [...projectKeys.all, id, "tasks"] as const,
};

export type ProjectDetail = Tables<"projects"> & {
  tasks:
    | Pick<Tables<"tasks">, "id" | "status" | "due_date" | "assignee_id">[]
    | null;
  workspaces: {
    workspace_members: {
      user_id: string;
      profiles: Tables<"profiles"> | null;
    }[];
  } | null;
};

export function useGetProjectById(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          tasks(id, status, due_date, assignee_id),
          workspaces (
            workspace_members (
              user_id
            )
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      // Manually fetch profiles
      const memberIds =
        data.workspaces?.workspace_members.map((m: any) => m.user_id) || [];
      let profilesMap = new Map();
      if (memberIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .in("id", memberIds);
        profilesMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      }

      const finalData = {
        ...data,
        workspaces: data.workspaces
          ? {
              workspace_members: data.workspaces.workspace_members.map(
                (m: any) => ({
                  user_id: m.user_id,
                  profiles: profilesMap.get(m.user_id) || null,
                }),
              ),
            }
          : null,
      };

      return finalData as unknown as ProjectDetail;
    },
    enabled: !!id,
  });
}
