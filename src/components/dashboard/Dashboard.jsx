import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { KanbanBoard } from "../board/KanbanBoard";
import { ListView } from "./ListView";
import { TimelineView } from "./TimelineView";
import { SettingsModal } from "./SettingsModal";
import { CreateTaskModal } from "../board/CreateTaskModal";
import { EditTaskModal } from "../board/EditTaskModal";
import { taskService } from "../../services/taskService";
import { toast } from "sonner";
import { Sidebar } from "../layout/Sidebar";
import { Header } from "../layout/Header";
import { Overview } from "./Overview";
import { useNavigate, useLocation } from "react-router-dom";

export const Dashboard = ({ session }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState("profile");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentView, setCurrentView] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Data State
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      navigate("/"); // Navigate home immediately
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  // Fetch Tasks
  useEffect(() => {
    loadTasks();
  }, [refreshKey]);

  // Open Settings from URL param (?open=settings or ?open=integrations)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const open = params.get("open");
    if ((open === "settings" || open === "integrations") && !isSettingsOpen) {
      setSettingsInitialTab(
        open === "integrations" ? "integrations" : "profile",
      );
      setIsSettingsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast.error("Failed to load tasks: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setRefreshKey((prev) => prev + 1);
    toast.success("Task created");
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    if (editingTask?.id === updatedTask.id) {
      setEditingTask(updatedTask);
    }
    // Toast is handled in EditTaskModal
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    setEditingTask(null);
    toast.success("Task deleted");
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await taskService.updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to save status change");
      loadTasks();
    }
  };

  // User Info for Sidebar
  const email = session?.user?.email || "User";
  const fullName = session?.user?.user_metadata?.full_name;
  const avatarUrl = session?.user?.user_metadata?.avatar_url;
  const initials = (fullName || email).substring(0, 2).toUpperCase();

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.labels?.some((l) =>
        l.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-50 font-sans flex transition-colors duration-300">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        userInitials={initials}
        userEmail={email}
        userAvatar={avatarUrl}
        onOpenSettings={() => {
          setSettingsInitialTab("profile");
          setIsSettingsOpen(true);
        }}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-64 ml-0 flex flex-col min-h-screen bg-zinc-950/50 transition-all duration-300">
        <Header
          onNewIssue={() => setIsCreateModalOpen(true)}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-zinc-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
              Loading workspace...
            </div>
          ) : (
            <>
              {currentView === "overview" && (
                <Overview
                  session={session}
                  tasks={filteredTasks}
                  onTasksUpdated={loadTasks}
                  searchQuery={searchQuery}
                  onTaskClick={setEditingTask}
                />
              )}

              {currentView !== "overview" && (
                <div className="p-3 md:p-6 h-full">
                  {currentView === "timeline" ? (
                    <TimelineView
                      tasks={filteredTasks}
                      onTaskClick={setEditingTask}
                      onAddClick={() => setIsCreateModalOpen(true)}
                    />
                  ) : (
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden h-full">
                      <div className="p-1 h-full">
                        {currentView === "board" && (
                          <KanbanBoard
                            tasks={filteredTasks}
                            onTaskClick={setEditingTask}
                            onTaskStatusChange={handleTaskStatusChange}
                            onAddClick={() => setIsCreateModalOpen(true)}
                          />
                        )}
                        {currentView === "list" && (
                          <ListView
                            tasks={filteredTasks}
                            onTaskClick={setEditingTask}
                            onAddClick={() => setIsCreateModalOpen(true)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        session={session}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          navigate("/dashboard", { replace: true });
        }}
        session={session}
        onTasksUpdated={loadTasks}
        initialTab={settingsInitialTab}
      />
    </div>
  );
};
