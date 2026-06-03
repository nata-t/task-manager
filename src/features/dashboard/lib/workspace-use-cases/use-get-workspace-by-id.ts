import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { workspaceDetailKeys, type WorkspaceDetail } from "../../workspace/schema";

export function useWorkspaceById(workspaceId: string) {
  return useQuery({
    queryKey: workspaceDetailKeys.detail(workspaceId),
    queryFn: async () => {
      const supabase = createClient();
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select(`
          *,
          workspace_members(count)
        `)
        .eq("id", workspaceId)
        .single();

      if (workspaceError) throw workspaceError;

      let profileData = null;
      if (workspaceData?.owner_id) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", workspaceData.owner_id)
          .maybeSingle();
        profileData = data;
      }

      const finalData = {
        ...workspaceData,
        profiles: profileData
      };

      return finalData as unknown as WorkspaceDetail;
    },
    enabled: !!workspaceId,
  });
}
