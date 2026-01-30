import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Circle,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export const ListView = ({ tasks, onTaskClick }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "in-progress":
        return <Circle className="w-4 h-4 text-blue-500" />;
      case "review":
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Circle className="w-4 h-4 text-zinc-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "low":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
      {/* Mobile View (Cards) */}
      <div className="block md:hidden divide-y divide-zinc-800">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No tasks found</div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 space-y-3 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              onClick={() => onTaskClick && onTaskClick(task)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-medium text-zinc-200 text-sm line-clamp-2">
                  {task.title}
                </div>
                <button className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300 transition-colors shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-xs text-zinc-300 capitalize px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50">
                  {getStatusIcon(task.status)}
                  {task.status.replace("-", " ")}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(
                    task.priority,
                  )}`}
                >
                  {task.priority}
                </span>
                {task.due_date && (
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(task.due_date), "MMM d")}
                  </div>
                )}
              </div>

              {task.assignee && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] border border-zinc-700 text-zinc-300">
                    {task.assignee.charAt(0).toUpperCase()}
                  </div>
                  <span>{task.assignee}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/50 text-zinc-400">
            <tr>
              <th
                className="px-6 py-3 font-medium cursor-pointer hover:text-zinc-200 transition-colors"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-2">
                  Title
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th
                className="px-6 py-3 font-medium cursor-pointer hover:text-zinc-200 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th
                className="px-6 py-3 font-medium cursor-pointer hover:text-zinc-200 transition-colors"
                onClick={() => handleSort("priority")}
              >
                <div className="flex items-center gap-2">
                  Priority
                  {sortConfig.key === "priority" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th className="px-6 py-3 font-medium">
                <div className="flex items-center gap-2">Assignee</div>
              </th>
              <th className="px-6 py-3 font-medium">
                <div className="flex items-center gap-2">Due Date</div>
              </th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => (
                <tr
                  key={task.id}
                  className="group hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  onClick={() => onTaskClick && onTaskClick(task)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-zinc-200">
                        {task.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-300 capitalize">
                      {getStatusIcon(task.status)}
                      {task.status.replace("-", " ")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(
                        task.priority,
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.assignee ? (
                      <div className="flex items-center gap-2 text-zinc-300">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs border border-zinc-700">
                          {task.assignee.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{task.assignee}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-600 text-sm italic">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {task.due_date ? (
                      <div className="flex items-center gap-2 text-zinc-300 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {format(parseISO(task.due_date), "MMM d")}
                      </div>
                    ) : (
                      <span className="text-zinc-600 text-sm italic">
                        No date
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
