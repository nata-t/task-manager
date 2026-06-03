import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "./use-get-project-by-id";
import type { Tables } from "@/types/database.types";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export type TaskWithDetails = Tables<"tasks"> & {
  profiles: Tables<"profiles"> | null;
};

export function useGetProjectTasks(projectId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Setup realtime subscription
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`tasks-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          // Invalidate tasks when any changes occur
          queryClient.invalidateQueries({ queryKey: projectKeys.tasks(projectId) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient, supabase]);

  return useQuery({
    queryKey: projectKeys.tasks(projectId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select(`*`)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const assigneeIds = Array.from(new Set(data.map(t => t.assignee_id).filter(Boolean))) as string[];
      let profilesMap = new Map();
      if (assigneeIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("*").in("id", assigneeIds);
        profilesMap = new Map(profiles?.map(p => [p.id, p]));
      }

      const tasksWithDetails = data.map(task => ({
        ...task,
        profiles: task.assignee_id ? profilesMap.get(task.assignee_id) || null : null
      }));

      return tasksWithDetails as unknown as TaskWithDetails[];
    },
    enabled: !!projectId,
  });
}
