import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "../project-use-cases/use-get-project-by-id";
import { toast } from "sonner";
import type { TaskWithDetails } from "../project-use-cases/use-get-project-tasks";

interface UpdateTaskVars {
  id: string;
  projectId: string;
  title?: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  assignee_id?: string | null;
  due_date?: string | null;
}

export function useUpdateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId, ...updates }: UpdateTaskVars) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select(`*`)
        .single();

      if (error) throw error;

      let profileData = null;
      if (data.assignee_id) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.assignee_id).maybeSingle();
        profileData = profile;
      }

      return { ...data, profiles: profileData } as unknown as TaskWithDetails;
    },
    // Optimistically update the UI
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.tasks(variables.projectId) });
      
      const previousTasks = queryClient.getQueryData<TaskWithDetails[]>(projectKeys.tasks(variables.projectId));
      
      if (previousTasks) {
        queryClient.setQueryData<TaskWithDetails[]>(
          projectKeys.tasks(variables.projectId), 
          (old) => {
            if (!old) return old;
            return old.map(task => 
              task.id === variables.id 
                ? { ...task, ...variables } as TaskWithDetails 
                : task
            );
          }
        );
      }
      
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(projectKeys.tasks(variables.projectId), context.previousTasks);
      }
      toast.error(err.message || "Failed to update task");
    },
    onSettled: (data, error, variables) => {
      // Refresh to ensure server state is perfectly aligned, 
      // though our optimistic update handles the UI instantly
      queryClient.invalidateQueries({ queryKey: projectKeys.tasks(variables.projectId) });
    },
  });
}
