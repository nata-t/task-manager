import { Loader2 } from "lucide-react";
import { InfoTab } from "./info-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceById } from "../../../lib/workspace-use-cases/use-get-workspace-by-id";
import { RecentTab } from "./recent-tab";
import { MembersTab } from "./members-tab";

export default function TabsSection({ workspaceId }: { workspaceId: string }) {
  const {
    data: workspace,
    isLoading: isLoadingWorkspace,
    error: workspaceError,
  } = useWorkspaceById(workspaceId);

  const isLoading = isLoadingWorkspace;
  const error = workspaceError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3 text-muted-foreground w-full h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin opacity-50" />
        <p className="text-sm">Loading workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3 text-destructive w-full h-[50vh]">
        <p className="text-sm font-medium">Failed to load workspace details</p>
      </div>
    );
  }

  if (!workspace) {
    return null; // or empty state, but normally handled by the loading/error states
  }
  return (
    <Tabs defaultValue="info" className="w-full mt-4">
      <TabsList variant="line">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="recent">Recent</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-4 outline-none">
        <InfoTab workspace={workspace} />
      </TabsContent>
      <TabsContent value="recent" className="mt-4 outline-none pl-1">
        <RecentTab />
      </TabsContent>
      <TabsContent value="members" className="mt-4 outline-none pl-1">
        <MembersTab />
      </TabsContent>
    </Tabs>
  );
}
