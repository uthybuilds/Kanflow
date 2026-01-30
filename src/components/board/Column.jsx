import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { cn } from "../../lib/utils";
import { Plus } from "lucide-react";

export const Column = ({ column, tasks, onTaskClick, onAddClick }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div className="flex h-auto md:h-full w-full md:w-[350px] flex-col gap-4 p-3 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base md:text-sm font-semibold text-zinc-100">
            {column.title}
          </h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-800 px-1.5 text-xs text-zinc-400">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddClick}
          className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 md:h-3.5 md:w-3.5" />
        </button>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden min-h-[150px]",
          "scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent",
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-zinc-800/50 bg-zinc-900/20 text-xs text-zinc-600">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};
