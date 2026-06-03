"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { workspaceDetailKeys } from "../../workspace/schema";

interface CreateProjectInput {
  workspaceId: string;
  name: string;
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, name }: CreateProjectInput) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .insert({ workspace_id: workspaceId, name })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceDetailKeys.projects(variables.workspaceId),
      });
    },
  });
}
