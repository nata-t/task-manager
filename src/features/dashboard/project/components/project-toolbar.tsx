import { Search, List, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/types/database.types";
import { useQueryState } from 'nuqs';
import { cn } from "@/lib/utils";

interface ProjectToolbarProps {
  viewMode: "list" | "board";
  setViewMode: (mode: "list" | "board") => void;
  members: { user_id: string; profiles: Tables<"profiles"> | null }[];
}

export function ProjectToolbar({ viewMode, setViewMode, members }: ProjectToolbarProps) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [statusFilter, setStatusFilter] = useQueryState("status", { defaultValue: "all" });
  const [assigneeFilter, setAssigneeFilter] = useQueryState("assignee", { defaultValue: "all" });

  const tabs = [
    { value: "all", label: "All" },
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center py-4 border-b">
      <div className="flex border rounded-lg bg-muted/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value === "all" ? null : tab.value)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              statusFilter === tab.value || (statusFilter === "" && tab.value === "all")
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 h-9 w-full bg-background"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 relative bg-background">
              <SlidersHorizontal className="h-4 w-4" />
              {assigneeFilter !== "all" && assigneeFilter !== "" && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Narrow down tasks in this project.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid items-center gap-2 max-w-full">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select 
                    value={assigneeFilter === "" ? "all" : assigneeFilter} 
                    onValueChange={(val) => setAssigneeFilter(val === "all" ? null : val)}
                  >
                    <SelectTrigger id="assignee" className="w-full truncate">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      {members.map(({ user_id, profiles }) => (
                        <SelectItem key={user_id} value={user_id}>
                          {profiles?.full_name || "Unknown User"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center border rounded-md h-9 ml-2 bg-muted/50 p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("list")}
            className={cn(
              "h-7 w-8 rounded-sm",
              viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("board")}
            className={cn(
              "h-7 w-8 rounded-sm",
              viewMode === "board" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
