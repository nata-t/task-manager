import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "../project-use-cases/use-get-project-by-id";
import { toast } from "sonner";
import type { TaskWithDetails } from "../project-use-cases/use-get-project-tasks";

interface DeleteTaskVars {
  id: string;
  projectId: string;
}

export function useDeleteTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteTaskVars) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw error;
      return id;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: projectKeys.tasks(variables.projectId),
      });

      const previousTasks = queryClient.getQueryData<TaskWithDetails[]>(
        projectKeys.tasks(variables.projectId),
      );

      if (previousTasks) {
        queryClient.setQueryData<TaskWithDetails[]>(
          projectKeys.tasks(variables.projectId),
          (old) => (old ? old.filter((t) => t.id !== variables.id) : []),
        );
      }

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          projectKeys.tasks(variables.projectId),
          context.previousTasks,
        );
      }
      toast.error(err.message || "Failed to delete task");
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.tasks(variables.projectId),
      });
    },
    onSuccess: () => {
      toast.success("Task deleted");
    },
  });
}
