import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isSupabaseConfigured = () => {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_URL &&
    process.env.EXPO_PUBLIC_SUPABASE_URL !== "your_supabase_url_here"
  );
};

// Helper to check if we are in guest mode
const isGuestMode = async () => {
  try {
    const guest = await AsyncStorage.getItem("guest_mode");
    return guest === "true";
  } catch {
    return false;
  }
};

// Helper for guest tasks
const getGuestTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem("guest_tasks");
    return tasks ? JSON.parse(tasks) : [];
  } catch {
    return [];
  }
};

const saveGuestTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem("guest_tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save guest tasks", e);
  }
};

export const taskService = {
  async getTasks() {
    if (await isGuestMode()) {
      const tasks = await getGuestTasks();
      if (tasks.length === 0) {
        // Return some initial mock data for guests
        const initialTasks = [
          {
            id: "1",
            title: "Welcome to Guest Mode",
            status: "todo",
            position: 0,
            priority: "high",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Try moving this task",
            status: "in_progress",
            position: 1,
            priority: "medium",
            created_at: new Date().toISOString(),
          },
        ];
        await saveGuestTasks(initialTasks);
        return initialTasks;
      }
      return tasks;
    }

    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      throw error;
    }
    return data || [];
  },

  async createTask(task) {
    if (await isGuestMode()) {
      const tasks = await getGuestTasks();
      const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
      tasks.push(newTask);
      await saveGuestTasks(tasks);
      return newTask;
    }

    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

    console.log("Creating task with payload:", task);

    const { data, error } = await supabase
      .from("tasks")
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error("Supabase createTask error:", error);
      throw error;
    }
    return data;
  },

  async updateTask(id, updates) {
    if (await isGuestMode()) {
      const tasks = await getGuestTasks();
      const index = tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        await saveGuestTasks(tasks);
        return tasks[index];
      }
      throw new Error("Task not found");
    }

    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

    console.log(`Updating task ${id} with:`, updates);

    // 10s timeout to prevent infinite hanging
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 10000),
    );

    const request = supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select();

    try {
      const { data, error } = await Promise.race([request, timeout]);

      if (error) {
        console.error("Supabase updateTask error:", error);
        throw new Error(error.message || "Database update failed");
      }

      if (!data || data.length === 0) {
        throw new Error("Task not found or permission denied (RLS)");
      }

      return data[0];
    } catch (err) {
      console.error("Task update failed:", err);
      throw err;
    }
  },

  async deleteTask(id) {
    if (await isGuestMode()) {
      const tasks = await getGuestTasks();
      const newTasks = tasks.filter((t) => t.id !== id);
      await saveGuestTasks(newTasks);
      return true;
    }

    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      throw error;
    }
    return true;
  },

  async deleteAllTasks() {
    if (await isGuestMode()) {
      await saveGuestTasks([]);
      return true;
    }

    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    // 1. Fetch all tasks for the user first to ensure we target existing records
    const { data: tasks, error: fetchError } = await supabase
      .from("tasks")
      .select("id")
      .eq("user_id", user.id);

    if (fetchError) throw fetchError;

    if (!tasks || tasks.length === 0) return true;

    // 2. Delete using the exact list of IDs
    const ids = tasks.map((t) => t.id);
    const { error } = await supabase.from("tasks").delete().in("id", ids);

    if (error) {
      throw error;
    }
    return true;
  },
};
