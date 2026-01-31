import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
import {
  Github,
  Gitlab,
  Slack,
  Disc,
  Figma,
  AlertTriangle,
  Video,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { taskService } from "../../services/taskService";

// --- Integration Card Component ---
const IntegrationCard = ({
  title,
  description,
  icon: Icon,
  fields,
  values,
  onChange,
  onSave,
  onAction,
  actionLabel,
  isSaving,
  isLoading,
  isConnected,
}) => (
  <div className="group relative flex flex-col h-full rounded-[32px] border border-zinc-800/50 bg-zinc-950 p-6 hover:border-zinc-700/50 transition-all duration-500 overflow-hidden">
    {/* Ambient Glow */}
    <div className="absolute top-0 right-0 p-32 bg-zinc-800/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-zinc-800/10 transition-colors duration-500" />

    {/* Header */}
    <div className="relative z-10 flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 group-hover:scale-105 group-hover:border-zinc-700 transition-all duration-300 shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "bg-zinc-800"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                isConnected ? "text-emerald-400" : "text-zinc-600"
              }`}
            >
              {isConnected ? "Active" : "Not connected"}
            </span>
          </div>
        </div>
      </div>
    </div>

    <p className="relative z-10 text-sm text-zinc-500 leading-relaxed mb-8 min-h-[2.5rem] line-clamp-2">
      {description}
    </p>

    {/* Inputs */}
    <div className="relative z-10 flex-grow space-y-5 mb-8">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <label className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold pl-1">
            {field.label}
          </label>
          <input
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={values[field.key] || ""}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="w-full h-11 px-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-base sm:text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none outline-none focus:border-zinc-600 focus:bg-zinc-900 focus:ring-4 focus:ring-zinc-800/20 transition-all shadow-sm"
          />
        </div>
      ))}
    </div>

    {/* Footer Actions */}
    <div className="relative z-10 flex items-center justify-between gap-3 pt-6 border-t border-zinc-800/50 mt-auto">
      {/* Action Button (Left) */}
      {onAction ? (
        <button
          onClick={onAction}
          disabled={isLoading || isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          <span>{actionLabel || "Sync"}</span>
        </button>
      ) : (
        <div />
      )}

      {/* Save Button (Right) */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105 active:scale-95 shadow-lg shadow-black/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        Save Changes
      </button>
    </div>
  </div>
);

// --- Main Panel Component ---
export const IntegrationsPanel = ({ session, onTasksUpdated }) => {
  const userId = session?.user?.id;

  // Centralized State for all configs
  const [configs, setConfigs] = useState({
    github: { token: "", repo: "" },
    gitlab: { token: "", projectId: "" },
    slack: { token: "" },
    discord: { botToken: "", channelId: "" },
    figma: { token: "", teamId: "" },
    sentry: { token: "", orgSlug: "", projectSlug: "" },
    zoom: { accountId: "", clientId: "", clientSecret: "" },
  });

  const [loadingStates, setLoadingStates] = useState({});
  const [savingStates, setSavingStates] = useState({});

  // --- Load / Save Logic ---

  const loadIntegrations = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      const newConfigs = { ...configs };
      data?.forEach((row) => {
        if (newConfigs[row.provider]) {
          newConfigs[row.provider] = {
            ...newConfigs[row.provider],
            ...row.data,
          };
        }
      });
      setConfigs(newConfigs);
    } catch (err) {
      console.error("Failed to load integrations:", err);
      toast.error("Could not load integration settings");
    }
  }, [userId]);

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const handleConfigChange = (provider, key, value) => {
    setConfigs((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], [key]: value },
    }));
  };

  const saveConfig = async (provider) => {
    try {
      setSavingStates((prev) => ({ ...prev, [provider]: true }));
      if (!userId) throw new Error("No user session");

      const { error } = await supabase.from("integrations").upsert(
        {
          user_id: userId,
          provider,
          data: configs[provider],
        },
        { onConflict: "user_id,provider" },
      );

      if (error) throw error;
      toast.success(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} settings saved`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSavingStates((prev) => ({ ...prev, [provider]: false }));
    }
  };

  // --- Provider Specific Actions ---

  const handleGithubSync = async () => {
    const { token, repo } = configs.github;
    if (!token || !repo) return toast.error("Missing GitHub token or repo");

    setLoadingStates((prev) => ({ ...prev, github: true }));
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/issues?state=open&per_page=10`,
        {
          headers: { Authorization: `token ${token}` },
        },
      );
      if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);
      const issues = await res.json();

      let count = 0;
      for (const issue of issues) {
        await taskService.createTask({
          title: issue.title,
          description: issue.body || `Imported from GitHub #${issue.number}`,
          priority: "medium",
          status: "todo",
          user_id: userId,
        });
        count++;
      }
      toast.success(`Imported ${count} issues from GitHub`);
      if (onTasksUpdated) onTasksUpdated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, github: false }));
    }
  };

  const handleGitlabSync = async () => {
    const { token, projectId } = configs.gitlab;
    if (!token || !projectId)
      return toast.error("Missing GitLab token or Project ID");

    setLoadingStates((prev) => ({ ...prev, gitlab: true }));
    try {
      const res = await fetch(
        `https://gitlab.com/api/v4/projects/${projectId}/issues?state=opened&per_page=10`,
        {
          headers: { "PRIVATE-TOKEN": token },
        },
      );
      if (!res.ok) throw new Error(`GitLab API Error: ${res.status}`);
      const issues = await res.json();

      let count = 0;
      for (const issue of issues) {
        await taskService.createTask({
          title: issue.title,
          description:
            issue.description || `Imported from GitLab #${issue.iid}`,
          priority: "medium",
          status: "todo",
          user_id: userId,
        });
        count++;
      }
      toast.success(`Imported ${count} issues from GitLab`);
      if (onTasksUpdated) onTasksUpdated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, gitlab: false }));
    }
  };

  const handleSlackTest = async () => {
    const { token } = configs.slack;
    if (!token) return toast.error("Missing Slack Token");

    setLoadingStates((prev) => ({ ...prev, slack: true }));
    try {
      const res = await fetch("https://slack.com/api/auth.test", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to connect to Slack");
      toast.success(`Connected to Slack as ${data.user}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, slack: false }));
    }
  };

  const handleDiscordTest = async () => {
    const { botToken } = configs.discord;
    if (!botToken) return toast.error("Missing Discord Bot Token");

    setLoadingStates((prev) => ({ ...prev, discord: true }));
    try {
      const res = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bot ${botToken}` },
      });
      if (!res.ok) throw new Error("Failed to connect to Discord");
      const data = await res.json();
      toast.success(`Connected to Discord as ${data.username}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, discord: false }));
    }
  };

  const handleFigmaSync = async () => {
    const { token } = configs.figma;
    if (!token) return toast.error("Missing Figma Token");

    setLoadingStates((prev) => ({ ...prev, figma: true }));
    try {
      const res = await fetch("https://api.figma.com/v1/me", {
        headers: { "X-Figma-Token": token },
      });
      if (!res.ok) throw new Error("Failed to connect to Figma");
      const data = await res.json();
      toast.success(`Connected to Figma as ${data.handle}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, figma: false }));
    }
  };

  const handleSentrySync = async () => {
    const { token, orgSlug, projectSlug } = configs.sentry;
    if (!token || !orgSlug || !projectSlug)
      return toast.error("Missing Sentry credentials");

    setLoadingStates((prev) => ({ ...prev, sentry: true }));
    try {
      const res = await fetch(
        `https://sentry.io/api/0/projects/${orgSlug}/${projectSlug}/issues/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error(`Sentry API Error: ${res.status}`);
      const issues = await res.json();
      const criticalIssues = issues
        .filter((i) => i.level === "error" || i.level === "fatal")
        .slice(0, 5);

      let count = 0;
      for (const issue of criticalIssues) {
        await taskService.createTask({
          title: `[Sentry] ${issue.title}`,
          description: `Sentry Issue: ${issue.permalink}\n\n${issue.culprit}`,
          priority: "high",
          status: "todo",
          user_id: userId,
        });
        count++;
      }
      if (count > 0) {
        toast.success(`Connected! Imported ${count} critical issues.`);
        if (onTasksUpdated) onTasksUpdated();
      } else {
        toast.success("Connected to Sentry (No new critical issues)");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to Sentry. Check credentials.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, sentry: false }));
    }
  };

  const handleZoomTest = async () => {
    const { accountId, clientId, clientSecret } = configs.zoom;
    if (!accountId || !clientId || !clientSecret)
      return toast.error("Missing Zoom credentials");

    setLoadingStates((prev) => ({ ...prev, zoom: true }));
    try {
      const authString = btoa(`${clientId}:${clientSecret}`);
      const res = await fetch(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
        {
          method: "POST",
          headers: { Authorization: `Basic ${authString}` },
        },
      );
      if (!res.ok) throw new Error("Failed to connect to Zoom");
      toast.success("Connected to Zoom!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, zoom: false }));
    }
  };

  const providers = [
    {
      id: "github",
      title: "GitHub",
      description: "Import issues as tasks and sync status changes.",
      icon: Github,
      fields: [
        {
          key: "token",
          label: "Personal Access Token",
          placeholder: "ghp_...",
        },
        { key: "repo", label: "Repository", placeholder: "owner/repo" },
      ],
      action: handleGithubSync,
      actionLabel: "Import",
    },
    {
      id: "gitlab",
      title: "GitLab",
      description: "Sync issues from GitLab projects to your board.",
      icon: Gitlab,
      fields: [
        { key: "token", label: "Access Token", placeholder: "glpat-..." },
        { key: "projectId", label: "Project ID", placeholder: "12345678" },
      ],
      action: handleGitlabSync,
      actionLabel: "Import",
    },
    {
      id: "slack",
      title: "Slack",
      description: "Fetch reminders and notifications from Slack.",
      icon: Slack,
      fields: [
        {
          key: "token",
          label: "User OAuth Token",
          placeholder: "xoxp-...",
          type: "password",
        },
      ],
      action: handleSlackTest,
      actionLabel: "Test",
    },
    {
      id: "discord",
      title: "Discord",
      description: "Fetch channel messages as tasks.",
      icon: Disc,
      fields: [
        {
          key: "botToken",
          label: "Bot Token",
          placeholder: "MTA...",
          type: "password",
        },
        {
          key: "channelId",
          label: "Channel ID",
          placeholder: "123456...",
        },
      ],
      action: handleDiscordTest,
      actionLabel: "Test",
    },
    {
      id: "figma",
      title: "Figma",
      description: "Link Figma projects to tasks.",
      icon: Figma,
      fields: [
        {
          key: "token",
          label: "Personal Access Token",
          placeholder: "figd_...",
          type: "password",
        },
        { key: "teamId", label: "Team ID", placeholder: "Team ID" },
      ],
      action: handleFigmaSync,
      actionLabel: "Verify",
    },
    {
      id: "sentry",
      title: "Sentry",
      description: "View Sentry issues automatically.",
      icon: AlertTriangle,
      fields: [
        {
          key: "token",
          label: "Auth Token",
          placeholder: "sntry_...",
          type: "password",
        },
        { key: "orgSlug", label: "Org Slug", placeholder: "my-org" },
        {
          key: "projectSlug",
          label: "Project Slug",
          placeholder: "my-project",
        },
      ],
      action: handleSentrySync,
      actionLabel: "Sync",
    },
    {
      id: "zoom",
      title: "Zoom",
      description: "Fetch scheduled meetings as tasks.",
      icon: Video,
      fields: [
        {
          key: "accountId",
          label: "Account ID",
          placeholder: "From App Marketplace",
        },
        {
          key: "clientId",
          label: "Client ID",
          placeholder: "From App Marketplace",
        },
        {
          key: "clientSecret",
          label: "Client Secret",
          placeholder: "From App Marketplace",
          type: "password",
        },
      ],
      action: handleZoomTest,
      actionLabel: "Test",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">
          Integrations
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Connect your favorite tools to automate your workflow. Settings are
          automatically saved and synced across your devices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-8">
        {providers.map((provider) => (
          <IntegrationCard
            key={provider.id}
            {...provider}
            values={configs[provider.id]}
            onChange={(key, val) => handleConfigChange(provider.id, key, val)}
            onSave={() => saveConfig(provider.id)}
            onAction={provider.action}
            isSaving={savingStates[provider.id]}
            isLoading={loadingStates[provider.id]}
            isConnected={Object.values(configs[provider.id]).every(
              (v) => v && v.length > 0,
            )}
          />
        ))}
      </div>
    </div>
  );
};
