"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { workspaceDetailKeys } from "../../workspace/schema";

interface DeleteProjectInput {
  projectId: string;
  workspaceId: string;
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: DeleteProjectInput) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceDetailKeys.projects(variables.workspaceId),
      });
    },
  });
}
