import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { StickyNote, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export const QuickNotes = ({ session }) => {
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const userId = session?.user?.id;

  // Load notes
  useEffect(() => {
    const loadNotes = async () => {
      if (!userId) return;
      try {
        const { data, error } = await supabase
          .from("integrations")
          .select("data")
          .eq("user_id", userId)
          .eq("provider", "quick_notes")
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error loading notes:", error);
        }

        if (data?.data?.content) {
          setNote(data.data.content);
        }
      } catch (err) {
        console.error("Failed to load notes", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotes();
  }, [userId]);

  // Debounced save
  useEffect(() => {
    if (isLoading || !userId) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        const { error } = await supabase.from("integrations").upsert(
          {
            user_id: userId,
            provider: "quick_notes",
            data: { content: note },
          },
          { onConflict: "user_id,provider" },
        );

        if (error) throw error;
      } catch (err) {
        console.error("Failed to save notes", err);
        toast.error("Failed to save notes");
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [note, userId, isLoading]);

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col relative overflow-hidden group">
      {/* Subtle yellow tint for notes vibe */}
      <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
            <StickyNote className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight">
            Notes
          </h3>
        </div>

        <div>
          {isSaving ? (
            <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
          ) : (
            <div
              className={`w-2 h-2 rounded-full bg-emerald-500 transition-all duration-500 ${
                note ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type something..."
          className="w-full h-full bg-transparent text-base text-zinc-300 placeholder:text-zinc-700 resize-none focus:outline-none leading-relaxed font-medium"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
