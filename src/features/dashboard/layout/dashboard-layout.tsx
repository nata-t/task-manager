'use client'

import { WorkspaceRail } from "./workspace-rail";
import { ProjectSidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

// import company_logo from "@/assets/company-logo/koket-logo.svg";
// import company_logo_small from "@/assets/company-logo/koket-logo-small.svg";

function SidebarLogo() {
  const { state } = useSidebar();

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-50 flex h-14 items-center justify-center bg-sidebar border-b border-r border-border transition-[width] duration-200 ease-linear",
        state === "expanded"
          ? "w-[calc(3.5rem+var(--sidebar-width))]"
          : "w-[calc(3.5rem+var(--sidebar-width-icon))]",
      )}
    >
      <div className="relative flex h-10 w-full items-center justify-center">
        <Link href="/dashboard">
            <h1 className="text-lg font-bold text-primary">ASPIO BOARD</h1>
        </Link>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <SidebarProvider
          defaultOpen={true}
          className="flex flex-1 overflow-hidden"
        >
          {/* Top Logo spanning across WorkspaceRail and ProjectSidebar */}
          <SidebarLogo />

          {/* Far-left navigation rail — pushed below the logo via CSS */}
          <WorkspaceRail />

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
