import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  workspaceDetailKeys,
  type ProjectWithTaskCounts,
} from "../../workspace/schema";

export function useWorkspaceProjects(workspaceId: string) {
  return useQuery({
    queryKey: workspaceDetailKeys.projects(workspaceId),
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          tasks(id, title, description, status, due_date)
        `,
        )
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as ProjectWithTaskCounts[];
    },
    enabled: !!workspaceId,
  });
}
