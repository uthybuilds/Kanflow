import { useState, useEffect, useCallback } from "react";
import { Video, ArrowUpRight } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export const ZoomWidget = ({ session }) => {
  const [zoomUrl, setZoomUrl] = useState("");
  const navigate = useNavigate();

  const loadConfig = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const { data } = await supabase
        .from("integrations")
        .select("data")
        .eq("user_id", session.user.id)
        .eq("provider", "zoom")
        .single();

      if (data?.data?.url) {
        setZoomUrl(data.data.url);
      } else {
        setZoomUrl("");
      }
    } catch (err) {
      console.error("Failed to load Zoom config", err);
      setZoomUrl("");
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <div className="h-full rounded-[32px] bg-zinc-950 border border-zinc-800/60 p-6 flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-24 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-lg font-semibold text-white tracking-tight">
          Quick Access
        </h3>
        {!zoomUrl && (
          <button
            onClick={() => navigate("/dashboard?open=integrations")}
            className="p-1.5 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
            title="Connect Zoom"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="space-y-2 relative z-10 mt-auto">
        <a
          href={zoomUrl || "https://zoom.us/join"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300 group/item"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Video className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-zinc-300 group-hover/item:text-white transition-colors">
              {zoomUrl ? "My Zoom" : "Zoom"}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
          </div>
        </a>
      </div>
    </div>
  );
};
