import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import {
  MoreHorizontal,
  MessageSquare,
  Calendar,
  User,
  Tag,
  GripVertical,
} from "lucide-react";
import { format } from "date-fns";

export const TaskCard = ({ task, isOverlay, onClick }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const priorityColors = {
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    high: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  const handleClick = (e) => {
    // Prevent click when dragging
    if (isDragging) return;
    onClick?.(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col gap-3 rounded-lg border bg-zinc-900 p-3 md:p-4 shadow-sm transition-all hover:border-zinc-700 hover:shadow-md",
        isDragging ? "opacity-30 ring-2 ring-blue-500/20" : "border-zinc-800",
        isOverlay
          ? "cursor-grabbing rotate-2 scale-105 border-zinc-700 shadow-xl z-50 opacity-100"
          : "cursor-grab",
        "animate-in fade-in zoom-in-95 duration-200",
      )}
    >
      <div className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="space-y-1 pr-4">
        <h3 className="text-sm font-medium text-zinc-100 leading-tight">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-zinc-500 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "px-2 py-0.5 rounded text-[10px] uppercase font-semibold border",
              priorityColors[task.priority],
            )}
          >
            {task.priority}
          </div>

          <div className="flex items-center gap-2">
            {task.assignee && (
              <div
                className="flex items-center gap-1 text-zinc-500"
                title={`Assigned to ${task.assignee}`}
              >
                <User className="h-3 w-3" />
                <span className="text-[10px] max-w-[60px] truncate">
                  {task.assignee}
                </span>
              </div>
            )}
            {task.due_date && (
              <div
                className="flex items-center gap-1 text-zinc-500"
                title={`Due ${format(new Date(task.due_date), "MMM d")}`}
              >
                <Calendar className="h-3 w-3" />
                <span className="text-[10px]">
                  {format(new Date(task.due_date), "MMM d")}
                </span>
              </div>
            )}
            {task.comments > 0 && (
              <div className="flex items-center gap-1 text-zinc-500 text-xs">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments}</span>
              </div>
            )}
          </div>
        </div>

        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400"
              >
                <Tag className="h-2.5 w-2.5" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
