import { useState } from "react";
import { type TaskWithDetails } from "../../lib/project-use-cases/use-get-project-tasks";
import { TaskCard } from "../components/task-card";
import { CreateTaskForm } from "../components/create-task-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Tables } from "@/types/database.types";

interface ListViewProps {
  tasks: TaskWithDetails[];
  projectId: string;
  members: { user_id: string; profiles: Tables<"profiles"> | null }[];
}

export function ListView({ tasks, projectId, members }: ListViewProps) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col gap-3 py-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">All Tasks ({tasks.length})</h3>
        {!isCreating && (
          <Button
            size="sm"
            className="gap-1.5 h-8 bg-primary"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {isCreating && (
          <CreateTaskForm
            projectId={projectId}
            members={members}
            onCancel={() => setIsCreating(false)}
          />
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            projectId={projectId}
            members={members}
            viewMode="list"
          />
        ))}

        {tasks.length === 0 && !isCreating && (
          <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
            <p>No tasks yet. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
