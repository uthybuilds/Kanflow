import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";

const initialColumns = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "In Review" },
  { id: "done", title: "Done" },
];

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export const KanbanBoard = ({
  tasks: initialTasks,
  onTaskClick,
  onTaskStatusChange,
  onAddClick,
}) => {
  const [columns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px movement required to start drag (prevents accidental clicks)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getTasksByColumn = (columnId) => {
    return tasks.filter((task) => task.status === columnId);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Dragging a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          // Different column: update status
          const newTasks = [...tasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            status: tasks[overIndex].status,
          };
          return arrayMove(newTasks, activeIndex, overIndex - 1); // Insert before
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dragging a task over a column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        if (tasks[activeIndex].status !== overId) {
          const newTasks = [...tasks];
          newTasks[activeIndex] = { ...newTasks[activeIndex], status: overId };
          return arrayMove(newTasks, activeIndex, activeIndex); // Just update status
        }
        return tasks;
      });
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      setTasks(initialTasks);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Determine the new status accurately
    let newStatus = null;
    const isOverColumn = over.data.current?.type === "Column";
    const isOverTask = over.data.current?.type === "Task";

    // If dropped on a column, the status is the column ID
    if (isOverColumn) {
      newStatus = overId;
    }
    // If dropped on a task, the status is that task's status
    else if (isOverTask) {
      // Find the task we dropped over in the CURRENT tasks state (or initialTasks if state update hasn't flushed)
      // Note: We should trust the 'tasks' state which should have been updated by handleDragOver
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    const isActiveTask = active.data.current?.type === "Task";

    if (activeId !== overId && isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status === tasks[overIndex].status) {
          return arrayMove(tasks, activeIndex, overIndex);
        }
        return tasks;
      });
    }

    // Persist the status change
    const originalTask = tasks.find((t) => t.id === activeId);

    // Use the explicitly calculated newStatus if available, otherwise fall back to the task's status in state
    const finalStatus = newStatus || originalTask?.status;

    if (originalTask && finalStatus && onTaskStatusChange) {
      // Only trigger update if status actually changed or we want to ensure persistence
      // We check if the original task's status (before drag started) is different?
      // No, 'originalTask' here comes from 'tasks' state which might be updated.
      // So we just send the update. The parent component handles optimization.

      // Ensure status is valid
      if (["todo", "in-progress", "review", "done"].includes(finalStatus)) {
        onTaskStatusChange(originalTask.id, finalStatus);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row h-full w-full gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
            onTaskClick={onTaskClick}
            onAddClick={onAddClick}
          />
        ))}
      </div>

      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask && <TaskCard task={activeTask} isOverlay />}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};
