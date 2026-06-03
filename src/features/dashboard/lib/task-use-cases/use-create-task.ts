import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "../project-use-cases/use-get-project-by-id";
import { toast } from "sonner";
import type { TaskWithDetails } from "../project-use-cases/use-get-project-tasks";

interface CreateTaskVars {
  projectId: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  description?: string;
  assignee_id?: string | null;
  due_date?: string | null;
}

export function useCreateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      title,
      status,
      description,
      assignee_id,
      due_date,
    }: CreateTaskVars) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          project_id: projectId,
          title,
          status,
          description,
          assignee_id,
          due_date,
        })
        .select(`*`)
        .single();

      if (error) throw error;

      let profileData = null;
      if (data.assignee_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.assignee_id)
          .maybeSingle();
        profileData = profile;
      }

      return { ...data, profiles: profileData } as unknown as TaskWithDetails;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.tasks(variables.projectId),
      });
      toast.success("Task created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create task");
    },
  });
}
