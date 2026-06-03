import { WorkspaceRail } from "./workspace-rail";
import { ProjectSidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Far-left navigation rail — always visible */}
        {/* <WorkspaceRail /> */}

        {/* shadcn SidebarProvider wraps the project sidebar + main area */}
        <SidebarProvider
          defaultOpen={true}
          className="flex flex-1 overflow-hidden"
        >
          {/* Project sidebar */}
          <ProjectSidebar />

          {/* Main content */}
          <SidebarInset className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
