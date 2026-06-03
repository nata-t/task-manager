"use client";

import { useState } from "react";
import { Search, Plus, LayoutGrid, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WorkspaceCard } from "./components/workspace-card";
import { useWorkspaces } from "./lib/workspace-use-cases/use-get-workspaces";
import { useCreateWorkspace } from "./lib/workspace-use-cases/use-create-workspace";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const { data: workspaces, isLoading, error } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();

  const filtered =
    workspaces?.filter((w) =>
      w.name.toLowerCase().includes(query.toLowerCase()),
    ) || [];

  return (
    <div className="p-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
        Your Workspaces
      </h1>

      <div className="mb-5 flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for a workspace"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 w-72 pl-8 text-sm"
          />
        </div>

        <Button
          size="sm"
          className="ml-auto"
          onClick={() => createWorkspace.mutate("New Workspace")}
          disabled={createWorkspace.isPending}
        >
          {createWorkspace.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
          ) : (
            <Plus className="h-3.5 w-3.5 mr-1.5" />
          )}
          New workspace
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin opacity-40" />
          <p className="text-sm">Loading workspaces...</p>
        </div>
      ) : error ? (
        <div className="mt-20 flex flex-col items-center gap-3 text-destructive">
          <p className="text-sm font-medium">Failed to load workspaces</p>
        </div>
      ) : workspaces?.length === 0 ? (
        <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
          <LayoutGrid className="h-8 w-8 opacity-40" />
          <p className="text-sm">No workspaces found</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => createWorkspace.mutate("New Workspace")}
            disabled={createWorkspace.isPending}
          >
            Create your first workspace
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
          <Search className="h-8 w-8 opacity-40" />
          <p className="text-sm">No workspaces match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2.5">
          {filtered.map((ws) => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}
        </div>
      )}
    </div>
  );
}
