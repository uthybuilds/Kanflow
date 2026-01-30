import { useState, useEffect } from "react";
import { Quote, RefreshCw, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

export const QuoteWidget = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (!res.ok) throw new Error("Failed to fetch quote");
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inspiration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const copyToClipboard = () => {
    if (quote) {
      navigator.clipboard.writeText(`"${quote.quote}" - ${quote.author}`);
      toast.success("Quote copied to clipboard");
    }
  };

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-8 flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 left-0 p-32 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
          <Quote className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={fetchQuote}
            className={`p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {loading && !quote ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-zinc-900 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-zinc-900 rounded w-1/2 mx-auto"></div>
          </div>
        ) : (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-xl md:text-2xl font-serif text-zinc-200 leading-relaxed italic mb-6">
              "{quote?.quote}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-zinc-800"></div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
                {quote?.author}
              </p>
              <div className="h-px w-8 bg-zinc-800"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
