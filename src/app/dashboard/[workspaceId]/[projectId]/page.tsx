import { notFound } from "next/navigation";
import { getProject, getTasksByProject, getWorkspace } from "@/lib/data";
import type { Database } from "@/types/database.types";
import { cn } from "@/lib/utils";

type TaskStatus = Database["public"]["Enums"]["task_status"];

interface Props {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; dotColor: string; bg: string }
> = {
  todo: {
    label: "To Do",
    color: "text-sky-400",
    dotColor: "bg-sky-400",
    bg: "bg-sky-400/10",
  },
  in_progress: {
    label: "In Progress",
    color: "text-amber-400",
    dotColor: "bg-amber-400",
    bg: "bg-amber-400/10",
  },
  done: {
    label: "Done",
    color: "text-emerald-400",
    dotColor: "bg-emerald-400",
    bg: "bg-emerald-400/10",
  },
};

const STATUS_ORDER: TaskStatus[] = ["in_progress", "todo", "done"];

function formatDate(date: string | null): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default async function ProjectPage({ params }: Props) {
  const { workspaceId, projectId } = await params;

  const workspace = getWorkspace(workspaceId);
  const project = getProject(projectId);

  if (!workspace || !project || project.workspace_id !== workspaceId) {
    notFound();
  }

  const tasks = getTasksByProject(projectId);
  const grouped = STATUS_ORDER.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  const donePct =
    tasks.length > 0
      ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Project hero */}
      <div className="mb-8 flex items-end gap-4">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl shadow-lg"
          style={{
            background: `color-mix(in oklch, ${project.color} 20%, transparent)`,
          }}
        >
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {project.name}
          </h1>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        {/* Progress badge */}
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: project.color }}
          >
            {donePct}%
          </span>
          <span className="text-[10px] text-muted-foreground">complete</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${donePct}%`, background: project.color }}
        />
      </div>

      {/* Task groups */}
      <div className="flex flex-col gap-6">
        {grouped.map(({ status, tasks: groupTasks }) => {
          const cfg = STATUS_CONFIG[status];
          if (groupTasks.length === 0) return null;

          return (
            <section key={status}>
              {/* Group header */}
              <div className="mb-3 flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", cfg.dotColor)} />
                <h2 className={cn("text-xs font-semibold uppercase tracking-widest", cfg.color)}>
                  {cfg.label}
                </h2>
                <span
                  className={cn(
                    "ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                    cfg.bg,
                    cfg.color
                  )}
                >
                  {groupTasks.length}
                </span>
              </div>

              {/* Task cards */}
              <div className="flex flex-col gap-2">
                {groupTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "group flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3",
                      "transition-all duration-150 hover:border-border/80 hover:bg-card/80 hover:shadow-sm",
                      task.status === "done" && "opacity-60"
                    )}
                  >
                    {/* Status dot / checkbox */}
                    <button
                      className={cn(
                        "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded",
                        "border-2 transition-colors",
                        task.status === "done"
                          ? "border-emerald-400 bg-emerald-400/20"
                          : task.status === "in_progress"
                            ? "border-amber-400 bg-amber-400/10"
                            : "border-muted-foreground/40"
                      )}
                      aria-label={`Mark ${task.title} as complete`}
                    >
                      {task.status === "done" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          className="text-emerald-400"
                        >
                          <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
                        </svg>
                      )}
                      {task.status === "in_progress" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      )}
                    </button>

                    {/* Task content */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium leading-snug text-foreground",
                          task.status === "done" && "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="ml-auto flex flex-shrink-0 flex-col items-end gap-1">
                      {task.assignee_name && (
                        <span className="rounded-full border border-border bg-sidebar-accent px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {task.assignee_name}
                        </span>
                      )}
                      {task.due_date && (
                        <span
                          className={cn(
                            "text-[10px] tabular-nums",
                            new Date(task.due_date) < new Date() && task.status !== "done"
                              ? "text-destructive"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatDate(task.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
