import {
  format,
  addDays,
  startOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  differenceInDays,
  startOfDay,
  isAfter,
  isBefore,
} from "date-fns";
import { useRef, useEffect } from "react";

export const TimelineView = ({ tasks, onTaskClick }) => {
  const scrollContainerRef = useRef(null);
  const today = startOfDay(new Date());
  const startDate = startOfWeek(today);
  const endDate = addDays(startDate, 13); // Show 2 weeks

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Scroll to today on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const todayIndex = differenceInDays(today, startDate);
      if (todayIndex >= 0) {
        // Calculate approximate position:
        // Task column (192px/w-48) + (todayIndex * Day column (100px))
        // We center it by subtracting half the container width
        const taskColWidth = 192;
        const dayColWidth = 100;
        const scrollPos =
          taskColWidth +
          todayIndex * dayColWidth -
          scrollContainerRef.current.clientWidth / 2 +
          dayColWidth / 2;

        // Use setTimeout to ensure layout is stable
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = Math.max(0, scrollPos);
          }
        }, 100);
      }
    }
  }, [startDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-emerald-500/20 border-emerald-500/50 text-emerald-200";
      case "in-progress":
        return "bg-blue-500/20 border-blue-500/50 text-blue-200";
      case "review":
        return "bg-amber-500/20 border-amber-500/50 text-amber-200";
      default:
        return "bg-zinc-500/20 border-zinc-500/50 text-zinc-200";
    }
  };

  const getTaskDuration = (task) => {
    const start = startOfDay(
      task.created_at ? parseISO(task.created_at) : new Date(),
    );
    let end = start;

    if (task.due_date) {
      end = startOfDay(parseISO(task.due_date));
    }

    // If task is done, cap the duration at completion time (updated_at)
    // This prevents tasks done "yesterday" from showing on "today"
    if (task.status === "done") {
      // Use updated_at as completion time, fallback to created_at if missing
      const completedAt = startOfDay(
        parseISO(task.updated_at || task.created_at),
      );

      // If completedAt is before the planned end date, use completedAt
      // (We stop showing the task after it was completed)
      if (isBefore(completedAt, end)) {
        end = completedAt;
      }
      // Note: If completedAt is AFTER planned end (overdue), we could extend it,
      // but for now let's stick to the "don't show on future days" rule.
      // If completedAt > end, we leave end as is (planned duration), or we could extend.
      // Given user complaint is about "showing on today when done yesterday",
      // the case we care about is completedAt < current view day.
    }

    // Ensure end is not before start (minimum 1 day)
    if (isBefore(end, start)) {
      end = start;
    }

    return differenceInDays(end, start) + 1;
  };

  const isTaskActiveOnDay = (task, day) => {
    const taskStart = startOfDay(
      task.created_at ? parseISO(task.created_at) : new Date(),
    );
    const dayStart = startOfDay(day);
    const diff = differenceInDays(dayStart, taskStart);
    const duration = getTaskDuration(task);

    return diff >= 0 && diff < duration;
  };

  return (
    <div className="h-full w-full">
      {/* Mobile View (Vertical Agenda) */}
      <div className="lg:hidden h-full overflow-y-auto p-4 space-y-6">
        {days.map((day) => {
          const activeTasks = tasks.filter((task) =>
            isTaskActiveOnDay(task, day),
          );
          const isToday = isSameDay(day, today);

          return (
            <div key={day.toString()} className="flex gap-4">
              {/* Date Column */}
              <div className="flex-shrink-0 w-14 flex flex-col items-center pt-1">
                <span
                  className={`text-xs font-medium uppercase ${isToday ? "text-blue-500" : "text-zinc-500"}`}
                >
                  {format(day, "EEE")}
                </span>
                <span
                  className={`text-xl font-bold ${isToday ? "text-blue-400" : "text-zinc-200"}`}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Tasks Column */}
              <div
                className={`flex-1 min-h-[60px] rounded-xl border ${isToday ? "border-blue-500/30 bg-blue-500/5" : "border-zinc-800 bg-zinc-900/40"} p-3 space-y-2`}
              >
                {activeTasks.length > 0 ? (
                  activeTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`text-sm font-medium px-3 py-2 rounded-lg border ${getStatusColor(task.status)} truncate`}
                      onClick={() => onTaskClick?.(task)}
                    >
                      {task.title}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center text-zinc-600 text-sm italic">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View (Horizontal Timeline) */}
      <div
        ref={scrollContainerRef}
        className="hidden lg:block w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 h-full min-h-[500px] scroll-smooth"
      >
        <div className="min-w-max h-full flex flex-col">
          {/* Header - Days */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="w-48 flex-shrink-0 p-4 border-r border-zinc-800 font-medium text-zinc-400 text-sm sticky left-0 z-30 bg-zinc-950/95 backdrop-blur-md shadow-lg">
              Task
            </div>
            <div className="flex flex-row">
              {days.map((day) => (
                <div
                  key={day.toString()}
                  className={`flex-shrink-0 w-[100px] border-r border-zinc-800 p-3 text-center ${
                    isSameDay(day, today) ? "bg-blue-500/5" : ""
                  }`}
                >
                  <div
                    className={`text-xs font-medium mb-1 ${isSameDay(day, today) ? "text-blue-400" : "text-zinc-400"}`}
                  >
                    {format(day, "EEE")}
                  </div>
                  <div
                    className={`text-lg font-bold ${isSameDay(day, today) ? "text-blue-500" : "text-zinc-200"}`}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Body - Tasks */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {tasks.map((task) => {
              const taskStart = startOfDay(
                task.created_at ? parseISO(task.created_at) : new Date(),
              );
              // Calculate offset days from start of view
              const daysFromStart = differenceInDays(taskStart, startDate);

              // Only show if within range (0 to 13)
              if (daysFromStart < 0 || daysFromStart > 13) return null;

              // Calculate duration using shared logic
              const duration = getTaskDuration(task);

              return (
                <div
                  key={task.id}
                  className="flex border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors group"
                >
                  <div className="w-48 flex-shrink-0 p-4 border-r border-zinc-800 flex items-center gap-2 sticky left-0 z-10 bg-zinc-950/95 backdrop-blur-md group-hover:bg-zinc-900/95 transition-colors shadow-lg">
                    <span
                      className="text-sm font-medium text-zinc-300 truncate"
                      title={task.title}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex-1 relative py-3">
                    {/* Grid lines background */}
                    <div className="absolute inset-0 flex flex-row pointer-events-none">
                      {days.map((day) => (
                        <div
                          key={day.toString()}
                          className="flex-shrink-0 w-[100px] border-r border-zinc-800/60 h-full"
                        ></div>
                      ))}
                    </div>

                    {/* Task Bar */}
                    <div
                      className={`absolute h-8 top-3 rounded-md border text-xs flex items-center px-2 font-medium truncate shadow-sm transition-all hover:brightness-110 cursor-pointer ${getStatusColor(task.status)}`}
                      style={{
                        left: `${daysFromStart * 100}px`,
                        width: `${duration * 100}px`,
                        marginLeft: "4px",
                        marginRight: "4px",
                        maxWidth: "calc(100% - 8px)", // Prevent overflow
                      }}
                    >
                      {task.title}
                    </div>
                  </div>
                </div>
              );
            })}

            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-40 text-zinc-500">
                No tasks to display
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
