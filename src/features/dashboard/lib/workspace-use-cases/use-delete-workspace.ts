import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { workspaceKeys, type WorkspaceWithProjectsCount } from "../../schema";

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("workspaces").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: workspaceKeys.all });
      const previous = queryClient.getQueryData<WorkspaceWithProjectsCount[]>(
        workspaceKeys.all,
      );

      queryClient.setQueryData<WorkspaceWithProjectsCount[]>(
        workspaceKeys.all,
        (old) => {
          return old?.filter((ws) => ws.id !== deletedId) || [];
        },
      );

      return { previous };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(workspaceKeys.all, context.previous);
      }
      toast.error("Failed to delete workspace. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
    onSuccess: () => {
      toast.success("Workspace deleted");
    },
  });
}
