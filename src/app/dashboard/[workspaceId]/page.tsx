import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getWorkspace,
  getProjectsByWorkspace,
  countTasksByStatus,
} from "@/lib/data";

interface Props {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { workspaceId } = await params;
  const workspace = getWorkspace(workspaceId);
  if (!workspace) notFound();

  const projects = getProjectsByWorkspace(workspaceId);

  // Aggregate stats
  const totalTasks = projects.reduce(
    (sum, p) => sum + countTasksByStatus(p.id).total,
    0
  );
  const doneTasks = projects.reduce(
    (sum, p) => sum + countTasksByStatus(p.id).done,
    0
  );
  const inProgressTasks = projects.reduce(
    (sum, p) => sum + countTasksByStatus(p.id).in_progress,
    0
  );
  const todoTasks = projects.reduce(
    (sum, p) => sum + countTasksByStatus(p.id).todo,
    0
  );

  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Workspace hero */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-3xl shadow-lg"
          style={{ background: workspace.color }}
        >
          {workspace.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {workspace.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} projects · {totalTasks} tasks
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Tasks",  value: totalTasks,      color: "text-foreground" },
          { label: "In Progress",  value: inProgressTasks, color: "text-amber-400" },
          { label: "Completed",    value: doneTasks,        color: "text-emerald-400" },
          { label: "To Do",        value: todoTasks,        color: "text-sky-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className={`mt-1 text-3xl font-bold tabular-nums ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="mb-8 rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Overall completion</span>
          <span className="font-semibold text-foreground">{completionPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-sidebar-primary transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Projects grid */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Projects
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const counts = countTasksByStatus(project.id);
          const pct =
            counts.total > 0
              ? Math.round((counts.done / counts.total) * 100)
              : 0;

          return (
            <Link
              key={project.id}
              href={`/dashboard/${workspaceId}/${project.id}`}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:border-sidebar-primary/50 hover:shadow-md hover:shadow-sidebar-primary/5"
            >
              {/* Project header */}
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-lg transition-transform duration-150 group-hover:scale-110"
                  style={{
                    background: `color-mix(in oklch, ${project.color} 15%, transparent)`,
                  }}
                >
                  {project.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground group-hover:text-sidebar-primary">
                    {project.name}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: project.color,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{counts.done} / {counts.total} tasks done</span>
                  <span className="font-medium" style={{ color: project.color }}>
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Status pills */}
              <div className="flex gap-1.5">
                {[
                  { label: "todo",        count: counts.todo,        bg: "bg-sky-400/10",   text: "text-sky-400" },
                  { label: "in progress", count: counts.in_progress, bg: "bg-amber-400/10", text: "text-amber-400" },
                  { label: "done",        count: counts.done,        bg: "bg-emerald-400/10", text: "text-emerald-400" },
                ].map((s) => (
                  <span
                    key={s.label}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.bg} ${s.text}`}
                  >
                    {s.count} {s.label}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
