import { useState } from "react";
import { X } from "lucide-react";
import { taskService } from "../../services/taskService";
import { toast } from "sonner";

export const CreateTaskModal = ({
  isOpen,
  onClose,
  onTaskCreated,
  session,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [assignee, setAssignee] = useState("");
  const [labels, setLabels] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      console.log("Submitting new task...");

      const newTask = await taskService.createTask({
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
        user_id: userId,
      });
      onTaskCreated(newTask);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("todo");
      setAssignee("");
      setLabels("");
      setDueDate("");
      onClose();
    } catch (error) {
      console.error(error);
      if (error.message?.includes("Could not find the 'assignee' column")) {
        toast.error(
          "Database schema missing columns. Please run the SQL in supabase/schema_update.sql",
          { duration: 10000 },
        );
      } else {
        toast.error("Failed to create task: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm transform overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-medium text-zinc-100">Create New Task</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-20 resize-none outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-base sm:text-sm text-zinc-300 focus:border-blue-500/50 focus:outline-none outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-base sm:text-sm text-zinc-300 focus:border-blue-500/50 focus:outline-none outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                Assignee
              </label>
              <input
                type="text"
                placeholder="Assign to..."
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500/50 focus:outline-none outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500/50 focus:outline-none outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Labels
            </label>
            <input
              type="text"
              placeholder="bug, feature, etc."
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500/50 focus:outline-none outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-zinc-800 bg-zinc-900/50 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Creating..." : "Create Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
