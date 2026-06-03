import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { workspaceKeys, type WorkspaceWithProjectsCount } from "../../schema";

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("workspaces")
        .update({ name })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (newVars) => {
      await queryClient.cancelQueries({ queryKey: workspaceKeys.all });
      const previous = queryClient.getQueryData<WorkspaceWithProjectsCount[]>(
        workspaceKeys.all,
      );

      queryClient.setQueryData<WorkspaceWithProjectsCount[]>(
        workspaceKeys.all,
        (old) => {
          return (
            old?.map((ws) =>
              ws.id === newVars.id ? { ...ws, name: newVars.name } : ws,
            ) || []
          );
        },
      );

      return { previous };
    },
    onError: (_err, _newVars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(workspaceKeys.all, context.previous);
      }
      toast.error("Failed to rename workspace. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
    onSuccess: () => {
      toast.success("Workspace name updated");
    },
  });
}
