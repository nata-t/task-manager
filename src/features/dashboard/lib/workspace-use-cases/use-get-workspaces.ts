import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { workspaceKeys, type WorkspaceWithProjectsCount } from "../../schema";

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.all,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("workspaces")
        .select("*, projects(count)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WorkspaceWithProjectsCount[];
    },
  });
}
