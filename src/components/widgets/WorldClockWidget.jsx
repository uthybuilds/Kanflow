import { useState, useEffect } from "react";
import { Globe, Clock, Plus, X } from "lucide-react";
import { toast } from "sonner";

export const WorldClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [clocks, setClocks] = useState(() => {
    const saved = localStorage.getItem("world_clocks");
    return saved
      ? JSON.parse(saved)
      : [
          { city: "New York", zone: "America/New_York" },
          { city: "London", zone: "Europe/London" },
          { city: "Tokyo", zone: "Asia/Tokyo" },
        ];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [newZone, setNewZone] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("world_clocks", JSON.stringify(clocks));
  }, [clocks]);

  const addClock = (e) => {
    e.preventDefault();
    if (!newCity || !newZone) {
      toast.error("Please fill in both fields");
      return;
    }

    // Validate timezone
    try {
      new Date().toLocaleString("en-US", { timeZone: newZone });
      setClocks([...clocks, { city: newCity, zone: newZone }]);
      setNewCity("");
      setNewZone("");
      setIsAdding(false);
      toast.success("Clock added");
    } catch (error) {
      toast.error("Invalid timezone (e.g., 'America/Los_Angeles')");
    }
  };

  const removeClock = (index) => {
    const newClocks = [...clocks];
    newClocks.splice(index, 1);
    setClocks(newClocks);
  };

  const formatTime = (date, zone) => {
    return date.toLocaleTimeString("en-US", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDayOffset = (date, zone) => {
    const localDay = date.getDay();
    const targetDate = new Date(
      date.toLocaleString("en-US", { timeZone: zone }),
    );
    const targetDay = targetDate.getDay();

    if (localDay === targetDay) return "Today";
    if ((localDay + 1) % 7 === targetDay) return "Tomorrow";
    if ((localDay - 1 + 7) % 7 === targetDay) return "Yesterday";
    return "";
  };

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight">
            World Clock
          </h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={addClock}
          className="mb-4 space-y-2 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 animate-in slide-in-from-top-2"
        >
          <input
            type="text"
            placeholder="City Name (e.g. Paris)"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            placeholder="Timezone (e.g. Europe/Paris)"
            value={newZone}
            onChange={(e) => setNewZone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            Add Clock
          </button>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2 relative z-10">
        {clocks.map((clock, index) => (
          <div
            key={index}
            className="group/item flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-900/40 transition-colors border border-transparent hover:border-zinc-800/50"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-zinc-200 font-medium">{clock.city}</span>
                <span className="text-[10px] text-zinc-500 font-medium px-1.5 py-0.5 bg-zinc-900 rounded-md border border-zinc-800">
                  {getDayOffset(time, clock.zone)}
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                {clock.zone}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-white tracking-tight tabular-nums">
                {formatTime(time, clock.zone)}
              </span>
              <button
                onClick={() => removeClock(index)}
                className="opacity-0 group-hover/item:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all text-zinc-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
