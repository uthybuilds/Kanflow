import { useState, useEffect, useCallback } from "react";
import { Figma, ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export const DesignWidget = ({ session }) => {
  const [config, setConfig] = useState(null);
  const [fileData, setFileData] = useState({
    name: "Project File",
    lastModified: "",
    thumbnailUrl: null,
    loading: true,
  });
  const navigate = useNavigate();

  const loadConfig = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const { data } = await supabase
        .from("integrations")
        .select("data")
        .eq("user_id", session.user.id)
        .eq("provider", "figma")
        .single();

      if (data?.data) {
        setConfig(data.data);
        fetchFigmaMetadata(data.data);
      } else {
        setConfig(null);
      }
    } catch (err) {
      console.error("Failed to load Figma config", err);
      setConfig(null);
    }
  }, [session?.user?.id]);

  const fetchFigmaMetadata = async (conf) => {
    if (!conf.token || !conf.fileKey) {
      setFileData((f) => ({ ...f, loading: false }));
      return;
    }

    try {
      const res = await fetch(
        `https://api.figma.com/v1/files/${conf.fileKey}`,
        {
          headers: { "X-Figma-Token": conf.token },
        },
      );

      if (!res.ok) throw new Error("API Error");
      const data = await res.json();

      setFileData({
        name: data.name,
        lastModified: new Date(data.lastModified).toLocaleDateString(),
        thumbnailUrl: data.thumbnailUrl,
        loading: false,
      });
    } catch (err) {
      console.error("Figma fetch error", err);
      setFileData((f) => ({ ...f, loading: false }));
    }
  };

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  if (!config) {
    return (
      <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-24 bg-pink-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10 text-center max-w-[200px]">
          <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Figma className="w-8 h-8 text-[#F24E1E]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Figma</h3>
            <p className="text-sm text-zinc-400">Connect to view files</p>
          </div>
          <button
            onClick={() => navigate("/dashboard?open=integrations")}
            className="mt-2 px-6 py-2 bg-[#F24E1E] text-white rounded-full text-sm font-medium hover:bg-[#D63B0E] transition-colors shadow-lg shadow-[#F24E1E]/10"
          >
            Connect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-32 bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
          <Figma className="w-5 h-5 text-[#F24E1E]" />
        </div>
        <h3 className="text-lg font-semibold text-white tracking-tight">
          Design
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <a
          href={`https://www.figma.com/file/${config.fileKey}`}
          target="_blank"
          rel="noreferrer"
          className="group/card block w-full aspect-video bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden"
        >
          {/* Preview UI */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-zinc-900">
            {fileData.loading ? (
              <div className="animate-pulse w-full h-full bg-zinc-800" />
            ) : fileData.thumbnailUrl ? (
              <img
                src={fileData.thumbnailUrl}
                alt="Figma File"
                className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity duration-500"
              />
            ) : (
              <Figma className="w-12 h-12 text-zinc-800 group-hover/card:text-[#F24E1E] transition-colors duration-500 transform group-hover/card:scale-110" />
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {fileData.name}
              </p>
              <p className="text-xs text-zinc-500 font-mono truncate">
                {fileData.lastModified
                  ? `Updated ${fileData.lastModified}`
                  : config.fileKey}
              </p>
            </div>
            <div className="p-2 bg-zinc-800 text-white rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity transform translate-x-2 group-hover/card:translate-x-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
