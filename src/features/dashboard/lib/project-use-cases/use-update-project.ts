import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "./use-get-project-by-id";
import { workspaceDetailKeys } from "../../workspace/schema";
import { toast } from "sonner";

interface UpdateProjectVars {
  id: string;
  name?: string;
  description?: string;
  workspaceId: string;
}

export function useUpdateProject() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: UpdateProjectVars) => {
      const { data, error } = await supabase
        .from("projects")
        .update({ name, description })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate project details
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
      // Invalidate workspace projects in case name changed
      queryClient.invalidateQueries({ queryKey: workspaceDetailKeys.projects(variables.workspaceId) });
      queryClient.invalidateQueries({ queryKey: workspaceDetailKeys.detail(variables.workspaceId) });
      toast.success("Project updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });
}
