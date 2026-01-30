import { supabase } from "../lib/supabase";

const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== "your_supabase_url_here"
  );
};

export const taskService = {
  async getTasks() {
    if (!isSupabaseConfigured()) {
      // If Supabase is not configured, we return an empty array or throw an error.
      // Since the user wants NO simulation, we should probably throw or return empty.
      // Returning empty allows the UI to render without crashing, but might be confusing.
      // Throwing ensures they know they need to connect.
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
    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

    console.log("Creating task with payload:", task);

    // We let Supabase handle ID generation.
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
        // This might happen if RLS prevents selecting the updated row
        // But if error is null, update might have succeeded but returned no data?
        // Actually, .select() returns data.
        // If row doesn't exist or RLS hides it, data is [].
        // We should treat this as an error or just return null.
        // Let's check if the update was successful by other means?
        // No, assuming data[0] is required.
        throw new Error("Task not found or permission denied (RLS)");
      }

      return data[0];
    } catch (err) {
      console.error("Task update failed:", err);
      throw err;
    }
  },

  async deleteTask(id) {
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
    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .not("id", "is", null);

    if (error) {
      throw error;
    }
    return true;
  },
};
