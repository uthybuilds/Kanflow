import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle2, Activity, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export const MonitoringWidget = ({ session }) => {
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState({
    operational: false,
    issues: 0,
    loading: true,
    error: null,
  });
  const navigate = useNavigate();

  const loadConfig = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const { data } = await supabase
        .from("integrations")
        .select("data")
        .eq("user_id", session.user.id)
        .eq("provider", "sentry")
        .single();

      if (data?.data) {
        setConfig(data.data);
        fetchSentryStatus(data.data);
      } else {
        setConfig(null);
      }
    } catch (err) {
      console.error("Failed to load Sentry config", err);
      setConfig(null);
    }
  }, [session?.user?.id]);

  const fetchSentryStatus = async (conf) => {
    if (!conf.token || !conf.orgSlug || !conf.projectSlug) {
      setStats({
        operational: false,
        issues: 0,
        loading: false,
        error: "Misconfigured",
      });
      return;
    }

    try {
      const res = await fetch(
        `https://sentry.io/api/0/projects/${conf.orgSlug}/${conf.projectSlug}/issues/`,
        {
          headers: { Authorization: `Bearer ${conf.token}` },
        },
      );

      if (!res.ok) throw new Error("API Error");

      const issues = await res.json();
      // Count unresolved issues
      const unresolvedCount = issues.length; // Default endpoint returns unresolved

      setStats({
        operational: true,
        issues: unresolvedCount,
        loading: false,
        error: null,
      });
    } catch (err) {
      setStats({
        operational: false,
        issues: 0,
        loading: false,
        error: "Connection Failed",
      });
    }
  };

  useEffect(() => {
    loadConfig();
    const interval = setInterval(() => {
      if (config) fetchSentryStatus(config);
    }, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [loadConfig]);

  if (!config) {
    return (
      <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-24 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10 text-center max-w-[200px]">
          <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Activity className="w-8 h-8 text-[#6C5FC7]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Sentry</h3>
            <p className="text-sm text-zinc-400">Connect to monitor errors</p>
          </div>
          <button
            onClick={() => navigate("/dashboard?open=integrations")}
            className="mt-2 px-6 py-2 bg-[#6C5FC7] text-white rounded-full text-sm font-medium hover:bg-[#5A4EB0] transition-colors shadow-lg shadow-[#6C5FC7]/10"
          >
            Connect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-24 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
          <Activity
            className={`w-5 h-5 ${stats.issues > 0 ? "text-red-500" : "text-emerald-500"}`}
          />
        </div>
        <h3 className="text-lg font-semibold text-white tracking-tight">
          System Status
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {stats.loading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-24 h-24 bg-zinc-900 rounded-full mb-6" />
            <div className="h-6 w-32 bg-zinc-900 rounded" />
          </div>
        ) : stats.error ? (
          <>
            <div className="relative mb-6">
              <div className="relative w-24 h-24 bg-zinc-900 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-zinc-500" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-zinc-400 mb-1 tracking-tight">
              Offline
            </h4>
            <p className="text-xs text-zinc-600">{stats.error}</p>
          </>
        ) : (
          <>
            <div className="relative mb-6">
              <div
                className={`absolute inset-0 blur-[30px] rounded-full animate-pulse ${stats.issues > 0 ? "bg-red-500/20" : "bg-emerald-500/20"}`}
              />
              <div
                className={`relative w-24 h-24 bg-zinc-900 rounded-full border-4 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.2)] ${stats.issues > 0 ? "border-red-500/10" : "border-emerald-500/10"}`}
              >
                {stats.issues > 0 ? (
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                )}
              </div>
            </div>

            <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {stats.issues > 0 ? `${stats.issues} Issues` : "Operational"}
            </h4>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border ${stats.issues > 0 ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20"}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${stats.issues > 0 ? "bg-red-500" : "bg-emerald-500"}`}
              />
              <span
                className={`text-xs font-medium ${stats.issues > 0 ? "text-red-400" : "text-emerald-400"}`}
              >
                {stats.issues > 0 ? "Action Required" : "All Systems Go"}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
        <p className="text-xs text-zinc-500 font-mono truncate px-4 opacity-50 hover:opacity-100 transition-opacity max-w-[150px]">
          {config.projectSlug}
        </p>
        <button
          onClick={() => fetchSentryStatus(config)}
          className="p-2 text-zinc-500 hover:text-white transition-colors"
          title="Refresh Status"
        >
          <RefreshCw
            className={`w-3 h-3 ${stats.loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};
