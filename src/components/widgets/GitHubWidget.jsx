import { useState, useEffect, useCallback } from "react";
import {
  Github,
  RefreshCw,
  ArrowRight,
  GitPullRequest,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import { taskService } from "../../services/taskService";
import { useNavigate } from "react-router-dom";

export const GitHubWidget = ({ session, onTasksUpdated }) => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [config, setConfig] = useState(null);
  const navigate = useNavigate();

  const loadConfig = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const { data } = await supabase
        .from("integrations")
        .select("data")
        .eq("user_id", session.user.id)
        .eq("provider", "github")
        .single();

      if (data?.data) {
        setConfig(data.data);
        fetchIssues(data.data);
      } else {
        setConfig(null);
      }
    } catch (err) {
      console.error("Failed to load GitHub config", err);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const fetchIssues = async (cfg) => {
    if (!cfg?.token || !cfg?.repo) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${cfg.repo}/issues?state=open&per_page=4`,
        {
          headers: { Authorization: `token ${cfg.token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const syncIssue = async (issue) => {
    if (!session?.user?.id) {
      toast.error("User not authenticated");
      return;
    }
    setIsSyncing(true);
    try {
      await taskService.createTask({
        title: issue.title,
        description: issue.body || `Imported from GitHub #${issue.number}`,
        priority: "medium",
        status: "todo",
        user_id: session.user.id,
      });
      toast.success("Issue synced to board");
      if (onTasksUpdated) onTasksUpdated();
    } catch {
      toast.error("Failed to sync issue");
    } finally {
      setIsSyncing(false);
    }
  };

  if (!config) {
    return (
      <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-24 bg-zinc-800/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10 text-center max-w-[200px]">
          <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Github className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">GitHub</h3>
            <p className="text-sm text-zinc-400">Connect to view issues</p>
          </div>
          <button
            onClick={() => navigate("/dashboard?open=integrations")}
            className="mt-2 px-6 py-2 bg-zinc-800 text-white rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors shadow-lg shadow-black/20"
          >
            Connect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-24 bg-zinc-800/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
            <Github className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Issues
            </h3>
            <p className="text-xs text-zinc-500 font-medium truncate max-w-[150px]">
              {config.repo}
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchIssues(config)}
          className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
          title="Refresh Issues"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading issues...</span>
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <CheckCircle2 className="w-8 h-8 mb-3 text-emerald-500/50" />
            <p className="text-sm">No open issues</p>
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              className="group p-4 bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-800/50 hover:border-zinc-700 rounded-2xl transition-all duration-300 flex items-start gap-3 cursor-pointer"
              onClick={() => syncIssue(issue)}
            >
              <div className="mt-1">
                {issue.pull_request ? (
                  <GitPullRequest className="w-4 h-4 text-purple-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white truncate transition-colors">
                  {issue.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500 font-mono">
                    #{issue.number}
                  </span>
                  <span className="text-xs text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500 truncate">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                <div className="p-2 bg-zinc-800 text-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-20" />
    </div>
  );
};
