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
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

    // 1. Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    // 2. Fetch Supabase Tasks
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .order("position", { ascending: true });

    if (error) throw error;

    let allTasks = tasks || [];

    // 3. Fetch Integrations Config
    const { data: integrationsData } = await supabase
      .from("integrations")
      .select("*")
      .eq("user_id", user.id);

    const integrations = {};
    integrationsData?.forEach((row) => {
      integrations[row.provider] = row.data;
    });

    // 4. Fetch External Tasks
    // --- GitHub ---
    if (integrations.github?.token && integrations.github?.repo) {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${integrations.github.repo}/issues?state=open`,
          {
            headers: { Authorization: `token ${integrations.github.token}` },
          },
        );
        if (res.ok) {
          const issues = await res.json();
          allTasks = [
            ...allTasks,
            ...issues.map((issue) => ({
              id: `gh-${issue.number}`,
              title: issue.title,
              description: `On GitHub: #${issue.number}`,
              status: "todo",
              priority: "medium",
              created_at: issue.created_at,
              is_external: true,
              external_source: "GitHub",
              external_url: issue.html_url,
              position: 1000,
              user_id: user.id,
            })),
          ];
        }
      } catch (e) {
        console.error("GitHub fetch failed", e);
      }
    }

    // --- GitLab ---
    if (integrations.gitlab?.token && integrations.gitlab?.projectId) {
      try {
        const res = await fetch(
          `https://gitlab.com/api/v4/projects/${integrations.gitlab.projectId}/issues?state=opened`,
          {
            headers: { "PRIVATE-TOKEN": integrations.gitlab.token },
          },
        );
        if (res.ok) {
          const issues = await res.json();
          allTasks = [
            ...allTasks,
            ...issues.map((issue) => ({
              id: `gl-${issue.id}`,
              title: issue.title,
              description: `On GitLab: #${issue.iid}`,
              status: "todo",
              priority: "medium",
              created_at: issue.created_at,
              is_external: true,
              external_source: "GitLab",
              external_url: issue.web_url,
              position: 1001,
              user_id: user.id,
            })),
          ];
        }
      } catch (e) {
        console.error("GitLab fetch failed", e);
      }
    }

    // --- Sentry ---
    if (
      integrations.sentry?.token &&
      integrations.sentry?.orgSlug &&
      integrations.sentry?.projectSlug
    ) {
      try {
        const res = await fetch(
          `https://sentry.io/api/0/projects/${integrations.sentry.orgSlug}/${integrations.sentry.projectSlug}/issues/?query=is:unresolved`,
          {
            headers: { Authorization: `Bearer ${integrations.sentry.token}` },
          },
        );
        if (res.ok) {
          const issues = await res.json();
          allTasks = [
            ...allTasks,
            ...issues.map((issue) => ({
              id: `sen-${issue.id}`,
              title: issue.title,
              description: `Sentry Error`,
              status: "todo",
              priority: "high",
              created_at: issue.lastSeen,
              is_external: true,
              external_source: "Sentry",
              external_url: issue.permalink,
              position: 1002,
              user_id: user.id,
            })),
          ];
        }
      } catch (e) {
        console.error("Sentry fetch failed", e);
      }
    }

    // --- Figma ---
    if (integrations.figma?.token && integrations.figma?.teamId) {
      try {
        const res = await fetch(
          `https://api.figma.com/v1/teams/${integrations.figma.teamId}/projects`,
          {
            headers: { "X-Figma-Token": integrations.figma.token },
          },
        );
        if (res.ok) {
          const data = await res.json();
          if (data.projects) {
            allTasks = [
              ...allTasks,
              ...data.projects.map((proj) => ({
                id: `fig-${proj.id}`,
                title: proj.name,
                description: "Figma Project",
                status: "todo",
                priority: "medium",
                created_at: new Date().toISOString(),
                is_external: true,
                external_source: "Figma",
                external_url: `https://www.figma.com/files/project/${proj.id}`,
                position: 1003,
                user_id: user.id,
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
      integrations.zoom?.accountId &&
      integrations.zoom?.clientId &&
      integrations.zoom?.clientSecret
    ) {
      try {
        const { accountId, clientId, clientSecret } = integrations.zoom;
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
                  position: 1, // Default position
                  user_id: user.id,
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
    if (integrations.slack?.token) {
      try {
        // Slack API usually requires a proxy if called from browser due to CORS
        // Assuming user might have a proxy or this is for local dev/Electron/native-like environment
        // OR standard OAuth token flow allows it? Slack Web API has strict CORS.
        // If this fails due to CORS, we might need a backend proxy.
        // However, for now we implement it as requested.
        const response = await fetch(`https://slack.com/api/reminders.list`, {
          headers: { Authorization: `Bearer ${integrations.slack.token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.ok && data.reminders) {
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
                external_url: "slack://open",
                position: 1004,
                user_id: user.id,
              })),
            ];
          }
        }
      } catch (e) {
        console.error("Slack fetch failed", e);
      }
    }

    // --- Discord (Channel Messages) ---
    if (integrations.discord?.botToken && integrations.discord?.channelId) {
      try {
        const response = await fetch(
          `https://discord.com/api/v10/channels/${integrations.discord.channelId}/messages?limit=10`,
          {
            headers: {
              Authorization: `Bot ${integrations.discord.botToken}`,
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
                external_url: `https://discord.com/channels/@me/${integrations.discord.channelId}/${msg.id}`,
                position: 1005,
                user_id: user.id,
              })),
            ];
          }
        }
      } catch (e) {
        console.error("Discord fetch failed", e);
      }
    }

    return allTasks;
  },

  async createTask(task) {
    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ ...task, position: task.position ?? 1 }])
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

    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase is not configured. Please connect your project.",
      );
    }

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
