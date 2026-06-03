import { useWorkspaceProjects } from "../../../lib/workspace-use-cases/use-get-workspace-projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FolderKanban,
  Info,
  ListTodo,
  TrendingUp,
  Users,
} from "lucide-react";
import type { WorkspaceDetail } from "../../schema";

interface WorkspaceInfoTabProps {
  workspace: WorkspaceDetail;
}

export function InfoTab({ workspace }: WorkspaceInfoTabProps) {
  const { data: projects = [], isLoading } = useWorkspaceProjects(workspace.id);

  const totalMembers = workspace.workspace_members?.[0]?.count || 0;
  const ownerName = workspace.profiles?.full_name || "Unknown";

  const totalProjects = projects.length;

  let totalTasks = 0;
  let doneTasks = 0;
  let inProgressTasks = 0;
  let todoTasks = 0;
  let overdueTasks = 0;

  let mostActiveProject = { name: "None", taskCount: 0 };

  const now = new Date();

  const allTasks: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    project_name: string;
  }[] = [];

  projects.forEach((project) => {
    const tasks = project.tasks || [];
    totalTasks += tasks.length;

    if (tasks.length > mostActiveProject.taskCount) {
      mostActiveProject = { name: project.name, taskCount: tasks.length };
    }

    tasks.forEach((task) => {
      allTasks.push({ ...task, project_name: project.name });

      if (task.status === "done") doneTasks++;
      if (task.status === "in_progress") inProgressTasks++;
      if (task.status === "todo") todoTasks++;

      if (
        task.status !== "done" &&
        task.due_date &&
        new Date(task.due_date) < now
      ) {
        overdueTasks++;
      }
    });
  });

  const notDoneTasks = allTasks.filter((t) => t.status !== "done");
  const doneTasksOnly = allTasks.filter((t) => t.status === "done");
  const sortedTasksForOverview = [...notDoneTasks, ...doneTasksOnly];

  const completionRate =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">
          Workspace Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Quick access to pressing tasks and summarized analytics.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sortedTasksForOverview.length > 0 && (
          <Card className="overflow-hidden p-2">
            <CardContent className="flex flex-col gap-4">
              {sortedTasksForOverview.slice(0, 6).map((task, index) => (
                <Card
                  key={task.id}
                  className={`flex flex-col gap-1.5 transition-all duration-500 ease-in-out border-border py-2 px-4 ${
                    index === 0
                      ? "shadow-md shadow-primary/5 translate-y-5 scale-105 z-10 -rotate-3"
                      : "opacity-80 blur-[1.5px] select-none pointer-events-none"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-semibold text-sm line-clamp-1 leading-tight">
                      {task.title}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4" /> Overview And Insights
            </CardTitle>
            <CardDescription>
              Detailed metrics and insights for {workspace.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Owned by</span>
                <span className="font-medium">{ownerName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Projects</span>
                <span className="font-medium">{totalProjects}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Members</span>
                <span className="font-medium">{totalMembers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Tasks</span>
                <span className="font-medium">{totalTasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">To Do</span>
                <span className="font-medium">{todoTasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-medium">{inProgressTasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Done</span>
                <span className="font-medium">{doneTasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
            </div>
          </CardContent>
          <CardContent className="space-y-4">
            {overdueTasks > 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p className="text-sm font-medium">
                  You have {overdueTasks} overdue task
                  {overdueTasks !== 1 && "s"}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 p-3 text-primary">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <p className="text-sm font-medium">
                  No overdue tasks. You are all caught up!
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
              <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-foreground">
                Most active project:{" "}
                <span className="font-semibold">{mostActiveProject.name}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
