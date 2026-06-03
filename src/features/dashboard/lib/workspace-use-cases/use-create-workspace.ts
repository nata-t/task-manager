import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { workspaceKeys, type WorkspaceWithProjectsCount } from "../../schema";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const supabase = createClient();

      // Verify session is active before inserting
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("workspaces")
        .insert([{ name }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (newName) => {
      await queryClient.cancelQueries({ queryKey: workspaceKeys.all });
      const previous = queryClient.getQueryData<WorkspaceWithProjectsCount[]>(
        workspaceKeys.all,
      );

      queryClient.setQueryData<WorkspaceWithProjectsCount[]>(
        workspaceKeys.all,
        (old) => {
          const dummy: WorkspaceWithProjectsCount = {
            id: crypto.randomUUID(),
            name: newName,
            created_at: new Date().toISOString(),
            projects: [{ count: 0 }],
            owner_id: null,
          };
          return [dummy, ...(old || [])];
        },
      );

      return { previous };
    },
    onError: (err, _newName, context) => {
      if (context?.previous) {
        queryClient.setQueryData(workspaceKeys.all, context.previous);
      }
      if (err.message === "Not authenticated") {
        toast.error("You must be logged in to create a workspace.");
      } else {
        toast.error("Failed to create workspace. Please try again.");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
    onSuccess: () => {
      toast.success("Workspace created");
    },
  });
}
