import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { integrationService } from "./integrationService";

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

    let allTasks = data || [];

    // Fetch Integrations
    try {
      const integrations = await integrationService.getIntegrations();

      // --- GitHub ---
      if (
        integrations?.github?.connected &&
        integrations.github.config?.token &&
        integrations.github.config?.repo
      ) {
        try {
          const response = await fetch(
            `https://api.github.com/repos/${integrations.github.config.repo}/issues?state=open`,
            {
              headers: {
                Authorization: `token ${integrations.github.config.token}`,
                Accept: "application/vnd.github.v3+json",
              },
            },
          );
          if (response.ok) {
            const issues = await response.json();
            const actualIssues = Array.isArray(issues)
              ? issues.filter((i) => !i.pull_request)
              : [];
            allTasks = [
              ...allTasks,
              ...actualIssues.map((issue) => ({
                id: `gh-${issue.id}`,
                title: issue.title,
                description: issue.body,
                status: "todo",
                priority: "medium",
                created_at: issue.created_at,
                is_external: true,
                external_source: "GitHub",
                external_url: issue.html_url,
                position: 1000,
                user_id: "github",
              })),
            ];
          }
        } catch (e) {
          console.error("GitHub fetch failed", e);
        }
      }

      // --- GitLab ---
      if (
        integrations?.gitlab?.connected &&
        integrations.gitlab.config?.token &&
        integrations.gitlab.config?.projectId
      ) {
        try {
          const response = await fetch(
            `https://gitlab.com/api/v4/projects/${integrations.gitlab.config.projectId}/issues?state=opened`,
            {
              headers: { "PRIVATE-TOKEN": integrations.gitlab.config.token },
            },
          );
          if (response.ok) {
            const issues = await response.json();
            allTasks = [
              ...allTasks,
              ...issues.map((issue) => ({
                id: `gl-${issue.id}`,
                title: issue.title,
                description: issue.description,
                status: "todo",
                priority: "medium",
                created_at: issue.created_at,
                is_external: true,
                external_source: "GitLab",
                external_url: issue.web_url,
                position: 1001,
                user_id: "gitlab",
              })),
            ];
          }
        } catch (e) {
          console.error("GitLab fetch failed", e);
        }
      }

      // --- Sentry ---
      if (
        integrations?.sentry?.connected &&
        integrations.sentry.config?.authToken &&
        integrations.sentry.config?.orgSlug &&
        integrations.sentry.config?.projectSlug
      ) {
        try {
          const { orgSlug, projectSlug, authToken } =
            integrations.sentry.config;
          const response = await fetch(
            `https://sentry.io/api/0/projects/${orgSlug}/${projectSlug}/issues/?query=is:unresolved`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            },
          );
          if (response.ok) {
            const issues = await response.json();
            allTasks = [
              ...allTasks,
              ...issues.map((issue) => ({
                id: `sen-${issue.id}`,
                title: issue.title,
                description: issue.culprit,
                status: "todo",
                priority: "high",
                created_at: issue.firstSeen,
                is_external: true,
                external_source: "Sentry",
                external_url: issue.permalink,
                position: 1002,
                user_id: "sentry",
              })),
            ];
          }
        } catch (e) {
          console.error("Sentry fetch failed", e);
        }
      }

      // --- Figma ---
      if (
        integrations?.figma?.connected &&
        integrations.figma.config?.token &&
        integrations.figma.config?.teamId
      ) {
        try {
          // Fetch Team Projects
          const response = await fetch(
            `https://api.figma.com/v1/teams/${integrations.figma.config.teamId}/projects`,
            {
              headers: { "X-Figma-Token": integrations.figma.config.token },
            },
          );
          if (response.ok) {
            const data = await response.json();
            if (data.projects) {
              allTasks = [
                ...allTasks,
                ...data.projects.map((proj) => ({
                  id: `fig-${proj.id}`,
                  title: `Review: ${proj.name}`,
                  description: "Figma Project Review",
                  status: "todo",
                  priority: "medium",
                  created_at: new Date().toISOString(),
                  is_external: true,
                  external_source: "Figma",
                  external_url: `https://www.figma.com/files/project/${proj.id}`,
                  position: 1003,
                  user_id: "figma",
                })),
              ];
            }
          }
        } catch (e) {
          console.error("Figma fetch failed", e);
        }
      }

      // --- Zoom (Scheduled Meetings) ---
      if (
        integrations?.zoom?.connected &&
        integrations.zoom.config?.accountId &&
        integrations.zoom.config?.clientId &&
        integrations.zoom.config?.clientSecret
      ) {
        try {
          // 1. Get Access Token (Client Credentials)
          const { accountId, clientId, clientSecret } =
            integrations.zoom.config;
          const authString = btoa(`${clientId}:${clientSecret}`);
          const tokenRes = await fetch(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
            {
              method: "POST",
              headers: { Authorization: `Basic ${authString}` },
            },
          );

          if (tokenRes.ok) {
            const tokenData = await tokenRes.json();
            const accessToken = tokenData.access_token;

            // 2. Get Meetings
            const meetingsRes = await fetch(
              `https://api.zoom.us/v2/users/me/meetings?type=scheduled`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              },
            );

            if (meetingsRes.ok) {
              const meetingsData = await meetingsRes.json();
              if (meetingsData.meetings) {
                allTasks = [
                  ...allTasks,
                  ...meetingsData.meetings.map((meeting) => ({
                    id: `zoom-${meeting.id}`,
                    title: `Meeting: ${meeting.topic}`,
                    description: `Start time: ${meeting.start_time}`,
                    status: "todo",
                    priority: "medium",
                    due_date: meeting.start_time,
                    created_at: meeting.created_at,
                    is_external: true,
                    external_source: "Zoom",
                    external_url: meeting.join_url,
                    position: 0, // Top priority
                    user_id: "zoom",
                  })),
                ];
              }
            }
          }
        } catch (e) {
          console.error("Zoom fetch failed", e);
        }
      }

      // --- Slack (Reminders) ---
      if (integrations?.slack?.connected && integrations.slack.config?.token) {
        try {
          const response = await fetch(`https://slack.com/api/reminders.list`, {
            headers: {
              Authorization: `Bearer ${integrations.slack.config.token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.ok && data.reminders) {
              // Filter for incomplete reminders
              const incompleteReminders = data.reminders.filter(
                (r) => !r.complete,
              );

              allTasks = [
                ...allTasks,
                ...incompleteReminders.map((reminder) => ({
                  id: `slack-${reminder.id}`,
                  title: reminder.text,
                  description: "Slack Reminder",
                  status: "todo",
                  priority: "medium",
                  created_at: new Date(reminder.time * 1000).toISOString(),
                  is_external: true,
                  external_source: "Slack",
                  external_url: "slack://open", // Deep link fallback
                  position: 1004,
                  user_id: "slack",
                })),
              ];
            }
          }
        } catch (e) {
          console.error("Slack fetch failed", e);
        }
      }

      // --- Discord (Channel Messages) ---
      if (
        integrations?.discord?.connected &&
        integrations.discord.config?.botToken &&
        integrations.discord.config?.channelId
      ) {
        try {
          const response = await fetch(
            `https://discord.com/api/v10/channels/${integrations.discord.config.channelId}/messages?limit=10`,
            {
              headers: {
                Authorization: `Bot ${integrations.discord.config.botToken}`,
              },
            },
          );

          if (response.ok) {
            const messages = await response.json();
            if (Array.isArray(messages)) {
              allTasks = [
                ...allTasks,
                ...messages.map((msg) => ({
                  id: `disc-${msg.id}`,
                  title:
                    msg.content.length > 50
                      ? msg.content.substring(0, 50) + "..."
                      : msg.content,
                  description: `From: ${msg.author.username}`,
                  status: "todo",
                  priority: "medium",
                  created_at: msg.timestamp,
                  is_external: true,
                  external_source: "Discord",
                  external_url: `https://discord.com/channels/@me/${integrations.discord.config.channelId}/${msg.id}`,
                  position: 1005,
                  user_id: "discord",
                })),
              ];
            }
          }
        } catch (e) {
          console.error("Discord fetch failed", e);
        }
      }
    } catch (e) {
      console.error("Failed to load integrations", e);
    }

    return allTasks;
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
    if (
      typeof id === "string" &&
      (id.startsWith("gh-") ||
        id.startsWith("gl-") ||
        id.startsWith("sen-") ||
        id.startsWith("fig-") ||
        id.startsWith("zoom-") ||
        id.startsWith("slack-") ||
        id.startsWith("disc-"))
    ) {
      throw new Error(
        "External tasks cannot be edited here. Please edit on the source platform.",
      );
    }

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
    if (
      typeof id === "string" &&
      (id.startsWith("gh-") ||
        id.startsWith("gl-") ||
        id.startsWith("sen-") ||
        id.startsWith("fig-") ||
        id.startsWith("zoom-") ||
        id.startsWith("slack-") ||
        id.startsWith("disc-"))
    ) {
      throw new Error(
        "External tasks cannot be deleted here. Please remove on the source platform.",
      );
    }

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
