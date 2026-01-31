import { useState, useEffect } from "react";
import { X, Calendar, User, Tag, Trash2 } from "lucide-react";
import { taskService } from "../../services/taskService";
import { toast } from "sonner";

export const EditTaskModal = ({
  isOpen,
  onClose,
  task,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [assignee, setAssignee] = useState("");
  const [labels, setLabels] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
      setAssignee(task.assignee || "");
      setLabels(task.labels ? task.labels.join(", ") : "");
      setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleUpdate = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const updatedTask = await taskService.updateTask(task.id, {
        title,
        description,
        priority,
        status,
        assignee,
        labels: labels
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        due_date: dueDate || null,
      });
      onTaskUpdated(updatedTask);
      toast.success("Task updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
      if (error.message?.includes("Could not find the 'assignee' column")) {
        toast.error(
          "Database schema missing columns. Please run the SQL in supabase/schema_update.sql",
          { duration: 10000 },
        );
      } else {
        toast.error("Failed to update task: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setIsLoading(true);
    try {
      await taskService.deleteTask(task.id);
      onTaskDeleted(task.id);
      // Toast is handled in parent
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl transform overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-medium text-zinc-100">Edit Task</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-xl font-semibold text-zinc-100 placeholder:text-zinc-600 focus:outline-none outline-none mb-4"
              placeholder="Issue title"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[300px] bg-transparent text-base sm:text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none outline-none resize-none leading-relaxed"
              placeholder="Add a description..."
            />
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-zinc-800 bg-zinc-900/30 p-4 space-y-6 overflow-y-auto">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-base sm:text-sm text-zinc-300 focus:outline-none outline-none focus:border-zinc-700"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-base sm:text-sm text-zinc-300 focus:outline-none outline-none focus:border-zinc-700"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <User className="h-3 w-3" />
                  <span>Assignee</span>
                </div>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Add assignee..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-base sm:text-sm text-zinc-300 focus:outline-none outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <Tag className="h-3 w-3" />
                  <span>Labels</span>
                </div>
                <input
                  type="text"
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                  placeholder="Comma separated..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-base sm:text-sm text-zinc-300 focus:outline-none outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <Calendar className="h-3 w-3" />
                  <span>Due Date</span>
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-base sm:text-sm text-zinc-300 focus:outline-none outline-none focus:border-zinc-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/50 px-6 py-4">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
