import { useState, useRef, useEffect } from "react";
import { type TaskWithDetails } from "../../lib/project-use-cases/use-get-project-tasks";
import { useUpdateTask } from "../../lib/task-use-cases/use-update-task";
import { useDeleteTask } from "../../lib/task-use-cases/use-delete-task";
import { Card } from "@/components/ui/card";
import {
  CalendarIcon,
  User,
  GripVertical,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables } from "@/types/database.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface TaskCardProps {
  task: TaskWithDetails;
  projectId: string;
  members: { user_id: string; profiles: Tables<"profiles"> | null }[];
  isDragging?: boolean;
  dragHandleProps?: any;
  innerRef?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
  viewMode?: "list" | "board";
}

export function TaskCard({
  task,
  projectId,
  members,
  isDragging,
  dragHandleProps,
  innerRef,
  style,
  viewMode = "board",
}: TaskCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState(task.description || "");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.focus();
    if (isEditingDesc) descInputRef.current?.focus();
  }, [isEditingTitle, isEditingDesc]);

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      updateTask.mutate({ id: task.id, projectId, title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
    setIsEditingTitle(false);
  };

  const handleSaveDesc = () => {
    if (editDesc.trim() !== (task.description || "")) {
      updateTask.mutate({
        id: task.id,
        projectId,
        description: editDesc.trim(),
      });
    } else {
      setEditDesc(task.description || "");
    }
    setIsEditingDesc(false);
  };

  const handleStatusChange = (newStatus: "todo" | "in_progress" | "done") => {
    if (newStatus !== task.status) {
      updateTask.mutate({ id: task.id, projectId, status: newStatus });
    }
  };

  const StatusIcon = () => {
    if (task.status === "done")
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (task.status === "in_progress")
      return <Clock className="h-4 w-4 text-yellow-500" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "done";
  const isList = viewMode === "list";

  return (
    <Card
      ref={innerRef}
      style={style}
      className={cn(
        "group relative flex flex-col p-3 transition-colors hover:bg-accent/50 cursor-default",
        isList ? "sm:flex-row sm:items-start w-full gap-4" : "gap-2",
        isDragging &&
          "shadow-lg scale-100 z-10 rotate-1 ring-1 ring-primary/20",
        task.status === "done" && "opacity-60",
      )}
    >
      <div className={cn("flex items-start gap-2", isList && "flex-1 min-w-0")}>
        {!isList && (
          <div
            className="mt-1 flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground opacity-30 hover:opacity-100"
            {...dragHandleProps}
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}

        {/* Subdued Status Button on Board (or left corner) */}
        {!isList && (
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-6 w-auto border-0 bg-transparent p-0 flex items-center justify-center -ml-1 mt-0.5 shadow-none [&>svg]:hidden ring-0 focus:ring-0">
              <StatusIcon />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") {
                  setEditTitle(task.title);
                  setIsEditingTitle(false);
                }
              }}
              onBlur={handleSaveTitle}
              className="h-6 py-0 px-1 text-sm font-medium w-full"
            />
          ) : (
            <p
              className={cn(
                "text-sm font-medium hover:underline decoration-muted-foreground underline-offset-2 break-words cursor-text",
                task.status === "done" && "line-through text-muted-foreground",
              )}
              onClick={() => {
                setEditTitle(task.title);
                setIsEditingTitle(true);
              }}
            >
              {task.title}
            </p>
          )}

          {isEditingDesc ? (
            <Textarea
              ref={descInputRef}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              onBlur={handleSaveDesc}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveDesc();
                }
                if (e.key === "Escape") {
                  setEditDesc(task.description || "");
                  setIsEditingDesc(false);
                }
              }}
              placeholder="Add a description..."
              className="min-h-[60px] text-xs resize-none px-2 py-1 mt-1"
            />
          ) : (
            <p
              className={cn(
                "text-xs break-words w-full line-clamp-3 p-0.5 rounded cursor-text hover:bg-muted/50 transition-colors",
                !task.description
                  ? "italic text-muted-foreground/60"
                  : "text-muted-foreground",
              )}
              onClick={() => {
                setEditDesc(task.description || "");
                setIsEditingDesc(true);
              }}
            >
              {task.description || "Add description..."}
            </p>
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-2 flex-wrap shrink-0",
          isList
            ? "sm:ml-auto ml-0 mt-2 sm:mt-0 items-start self-start"
            : "ml-6 mt-1",
        )}
      >
        {/* Full styled Status button for List View aligned with others */}
        {isList && (
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-6 px-2 py-0 text-xs flex items-center gap-1.5 bg-background/50 hover:bg-muted/80 font-medium transition-colors rounded-md border border-input [&>svg]:hidden">
              <SelectValue>
                <span className="flex items-center gap-1.5 shrink-0">
                  <StatusIcon />
                  <span className="capitalize">
                    {task.status.replace("_", " ")}
                  </span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">
                <div className="flex items-center gap-1.5">
                  <Circle className="h-3 w-3 text-muted-foreground" /> Todo
                </div>
              </SelectItem>
              <SelectItem value="in_progress">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-yellow-500" /> In Progress
                </div>
              </SelectItem>
              <SelectItem value="done">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-green-500" /> Done
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Assignee Picker */}
        <Select
          value={task.assignee_id || "unassigned"}
          onValueChange={(val) => {
            updateTask.mutate({
              id: task.id,
              projectId,
              assignee_id: val === "unassigned" ? null : val,
            });
          }}
        >
          <SelectTrigger className="h-6 px-2 py-0 text-xs flex items-center gap-1.5 shadow-none bg-background/50 hover:bg-muted/80 transition-colors rounded-md border border-input [&>svg]:hidden">
            <SelectValue placeholder="Unassigned">
              {task.profiles ? (
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[80px]">
                    {task.profiles.full_name}
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <User className="h-3 w-3" />
                  Unassigned
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned" className="text-muted-foreground">
              Unassigned
            </SelectItem>
            {members.map((member) => (
              <SelectItem key={member.user_id} value={member.user_id}>
                {member.profiles?.full_name || "Unknown User"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Due Date Picker */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9 px-2 py-0 text-xs flex items-center gap-1.5 shadow-none bg-background/50 hover:bg-muted/80 transition-colors font-medium border border-input",
                !task.due_date && "text-muted-foreground",
                isOverdue &&
                  "text-destructive border-destructive/30 bg-destructive/5 hover:bg-destructive/10 hover:text-destructive",
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              {task.due_date
                ? format(new Date(task.due_date), "MMM d")
                : "No date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={task.due_date ? new Date(task.due_date) : undefined}
              onSelect={(date) => {
                let dateStr = null;
                if (date) dateStr = format(date, "yyyy-MM-dd");
                updateTask.mutate({
                  id: task.id,
                  projectId,
                  due_date: dateStr,
                });
                setIsCalendarOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Delete */}
        <div className={cn(!isList && "absolute top-1 right-2")}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive cursor-pointer",
                  isList && "opacity-100 sm:opacity-0",
                )}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  onClick={() => deleteTask.mutate({ id: task.id, projectId })}
                  disabled={deleteTask.isPending}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
