import { useState, useEffect, useCallback } from "react";
import { Slack, Disc, Send, MessageSquare, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CommunicationWidget = ({ session }) => {
  const [slackConfig, setSlackConfig] = useState(null);
  const [discordConfig, setDiscordConfig] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loadConfig = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const { data } = await supabase
        .from("integrations")
        .select("provider, data")
        .eq("user_id", session.user.id)
        .in("provider", ["slack", "discord"]);

      if (data) {
        const slack = data.find((d) => d.provider === "slack")?.data;
        const discord = data.find((d) => d.provider === "discord")?.data;
        if (slack?.webhookUrl) setSlackConfig(slack);
        if (discord?.webhookUrl) setDiscordConfig(discord);
      }
    } catch (err) {
      console.error("Failed to load comms config", err);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const sendUpdate = async (provider) => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      const url =
        provider === "slack"
          ? slackConfig.webhookUrl
          : discordConfig.webhookUrl;
      const body =
        provider === "slack" ? { text: message } : { content: message };

      const res = await fetch(url, {
        method: "POST",
        headers:
          provider === "discord" ? { "Content-Type": "application/json" } : {},
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to send");
      toast.success(`Update sent to ${provider}`);
      setMessage(""); // Clear message after sending
    } catch (err) {
      toast.error(`Failed to send to ${provider}`);
    } finally {
      setIsSending(false);
    }
  };

  if (!slackConfig && !discordConfig) {
    return (
      <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 z-0" />
        <div className="absolute top-0 right-0 p-20 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex -space-x-3 mb-6">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 shadow-lg z-10">
              <Slack className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 shadow-lg">
              <Disc className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
            Updates
          </h3>
          <p className="text-zinc-400 text-center mb-8 max-w-[200px] leading-relaxed">
            Send updates to Slack or Discord.
          </p>
          <button
            onClick={() => navigate("/dashboard?open=integrations")}
            className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-full hover:bg-zinc-700 transition-colors shadow-lg shadow-black/20 active:scale-95"
          >
            Connect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-24 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white tracking-tight">
          Team Comms
        </h3>
      </div>

      <div className="flex-1 flex flex-col gap-4 relative z-10">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you working on?"
          className="w-full h-full min-h-[80px] bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 resize-none transition-colors"
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() =>
              slackConfig
                ? sendUpdate("slack")
                : navigate("/dashboard?open=integrations")
            }
            disabled={slackConfig && (isSending || !message.trim())}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 group ${
              slackConfig
                ? "bg-zinc-900 hover:bg-[#4A154B] border-zinc-800 hover:border-[#4A154B]"
                : "bg-zinc-900/30 border-zinc-800/30 opacity-50 hover:opacity-100 hover:bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            <Slack
              className={`w-4 h-4 ${
                slackConfig
                  ? "text-[#E01E5A] group-hover:text-white"
                  : "text-zinc-500"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                slackConfig
                  ? "text-zinc-300 group-hover:text-white"
                  : "text-zinc-500"
              }`}
            >
              {slackConfig ? "Slack" : "Connect"}
            </span>
          </button>

          <button
            onClick={() =>
              discordConfig
                ? sendUpdate("discord")
                : navigate("/dashboard?open=integrations")
            }
            disabled={discordConfig && (isSending || !message.trim())}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 group ${
              discordConfig
                ? "bg-zinc-900 hover:bg-[#5865F2] border-zinc-800 hover:border-[#5865F2]"
                : "bg-zinc-900/30 border-zinc-800/30 opacity-50 hover:opacity-100 hover:bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            <Disc
              className={`w-4 h-4 ${
                discordConfig
                  ? "text-[#5865F2] group-hover:text-white"
                  : "text-zinc-500"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                discordConfig
                  ? "text-zinc-300 group-hover:text-white"
                  : "text-zinc-500"
              }`}
            >
              {discordConfig ? "Discord" : "Connect"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
