import { useEffect, useState } from "react";
import { type TaskWithDetails } from "../../lib/project-use-cases/use-get-project-tasks";
import { useUpdateTask } from "../../lib/task-use-cases/use-update-task";
import { TaskCard } from "../components/task-card";
import { CreateTaskForm } from "../components/create-task-form";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import type { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";

interface BoardViewProps {
  tasks: TaskWithDetails[];
  projectId: string;
  members: { user_id: string; profiles: Tables<"profiles"> | null }[];
}

type StatusColumns = Record<"todo" | "in_progress" | "done", TaskWithDetails[]>;

const LABELS = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
} as const;

export function BoardView({ tasks, projectId, members }: BoardViewProps) {
  const [columns, setColumns] = useState<StatusColumns>({
    todo: [],
    in_progress: [],
    done: [],
  });

  const [creatingIn, setCreatingIn] = useState<
    "todo" | "in_progress" | "done" | null
  >(null);

  const updateTask = useUpdateTask();

  useEffect(() => {
    // Derive columns from tasks prop natively to maintain optimistic UI state
    setColumns({
      todo: tasks.filter((t) => t.status === "todo"),
      in_progress: tasks.filter((t) => t.status === "in_progress"),
      done: tasks.filter((t) => t.status === "done"),
    });
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as keyof StatusColumns;
    const destStatus = destination.droppableId as keyof StatusColumns;

    const sourceItems = Array.from(columns[sourceStatus]);
    const destItems =
      sourceStatus === destStatus
        ? sourceItems
        : Array.from(columns[destStatus]);

    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceStatus === destStatus) {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({ ...columns, [sourceStatus]: sourceItems });
    } else {
      movedItem.status = destStatus;
      destItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [sourceStatus]: sourceItems,
        [destStatus]: destItems,
      });

      // Actually update the DB status
      updateTask.mutate({ id: draggableId, projectId, status: destStatus });
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch for dnd

  return (
    <div className="py-4 overflow-x-auto min-h-[500px]">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex items-start gap-4 h-full min-w-max pb-4">
          {(["todo", "in_progress", "done"] as const).map((status) => (
            <div
              key={status}
              className="w-[320px] shrink-0 flex flex-col bg-muted/40 rounded-xl max-h-[80vh] overflow-hidden"
            >
              <div className="px-3 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm capitalize">
                    {LABELS[status]}
                  </h3>
                  <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium text-muted-foreground">
                    {columns[status].length}
                  </span>
                </div>
                <button
                  onClick={() => setCreatingIn(status)}
                  className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="px-2 pb-2 overflow-y-auto flex-1 custom-scrollbar">
                {creatingIn === status && (
                  <CreateTaskForm
                    projectId={projectId}
                    members={members}
                    defaultStatus={status}
                    onCancel={() => setCreatingIn(null)}
                  />
                )}
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "min-h-[50px] transition-colors rounded-lg flex flex-col gap-2 p-1",
                        snapshot.isDraggingOver && "bg-muted/60",
                      )}
                    >
                      {columns[status].map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TaskCard
                              task={task}
                              projectId={projectId}
                              members={members}
                              viewMode="board"
                              innerRef={provided.innerRef}
                              dragHandleProps={{
                                ...provided.dragHandleProps,
                                ...provided.draggableProps,
                              }}
                              style={provided.draggableProps.style}
                              isDragging={snapshot.isDragging}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
