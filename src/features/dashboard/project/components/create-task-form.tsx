import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, User, Circle, Clock, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useCreateTask } from "../../lib/task-use-cases/use-create-task";
import type { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";

interface CreateTaskFormProps {
  projectId: string;
  members: { user_id: string; profiles: Tables<"profiles"> | null }[];
  defaultStatus?: "todo" | "in_progress" | "done";
  onCancel: () => void;
}

export function CreateTaskForm({ projectId, members, defaultStatus = "todo", onCancel }: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">(defaultStatus);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const createTask = useCreateTask();
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (!title.trim()) return;
    
    createTask.mutate(
      { 
        projectId, 
        title: title.trim(), 
        description: description.trim() || undefined, 
        status, 
        assignee_id: assigneeId,
        due_date: dueDate
      },
      {
        onSettled: () => {
          onCancel();
        }
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const StatusIcon = () => {
    if (status === "done") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === "in_progress") return <Clock className="h-4 w-4 text-yellow-500" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="flex flex-col gap-3 p-4 border border-primary/20 shadow-sm bg-accent/20 mb-3 animate-in fade-in-50 zoom-in-95 duration-200">
      <Input
        ref={titleInputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task title..."
        disabled={createTask.isPending}
        className="font-medium bg-background"
      />
      
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a description (optional)..."
        className="min-h-[60px] text-sm resize-none bg-background shadow-none"
        disabled={createTask.isPending}
      />

      <div className="flex items-center justify-between flex-wrap gap-2 mt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Picker */}
          <Select value={status} onValueChange={(val: any) => setStatus(val)} disabled={createTask.isPending}>
            <SelectTrigger className="h-8 px-2.5 text-xs flex items-center gap-1.5 bg-background font-medium hover:bg-muted transition-colors rounded-md border border-input">
              <SelectValue>
                <div className="flex items-center gap-1.5">
                  <StatusIcon />
                  <span className="capitalize">{status.replace("_", " ")}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">
                <div className="flex items-center gap-1.5"><Circle className="h-4 w-4 text-muted-foreground" /> Todo</div>
              </SelectItem>
              <SelectItem value="in_progress">
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-yellow-500" /> In Progress</div>
              </SelectItem>
              <SelectItem value="done">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Done</div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Assignee Picker */}
          <Select
            value={assigneeId || "unassigned"}
            onValueChange={(val) => setAssigneeId(val === "unassigned" ? null : val)}
            disabled={createTask.isPending}
          >
            <SelectTrigger className="h-8 px-2.5 text-xs flex items-center gap-1.5 bg-background hover:bg-muted transition-colors rounded-md border border-input font-medium [&>svg]:hidden">
              <SelectValue placeholder="Unassigned">
                {assigneeId ? (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[80px]">
                      {members.find(m => m.user_id === assigneeId)?.profiles?.full_name || "Unknown"}
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Unassigned
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned" className="text-muted-foreground">Unassigned</SelectItem>
              {members.map(member => (
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
                disabled={createTask.isPending}
                className={cn(
                  "h-8 px-2.5 text-xs flex items-center gap-1.5 shadow-none bg-background hover:bg-muted transition-colors font-medium border border-input",
                  !dueDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {dueDate ? format(new Date(dueDate), "MMM d, yyyy") : "Due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate ? new Date(dueDate) : undefined}
                onSelect={(date) => {
                  if (date) setDueDate(format(date, "yyyy-MM-dd"));
                  else setDueDate(null);
                  setIsCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={createTask.isPending}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!title.trim() || createTask.isPending}>
            Create Task
          </Button>
        </div>
      </div>
    </Card>
  );
}
