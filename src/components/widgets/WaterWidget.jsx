import { useState, useEffect } from "react";
import { Droplets, Plus, Minus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const WaterWidget = () => {
  const [glasses, setGlasses] = useState(0);
  const target = 8;

  useEffect(() => {
    const savedGlasses = localStorage.getItem("daily_water_glasses");
    const savedDate = localStorage.getItem("daily_water_date");
    const today = new Date().toDateString();

    if (savedDate === today && savedGlasses) {
      setGlasses(parseInt(savedGlasses));
    } else {
      setGlasses(0);
      localStorage.setItem("daily_water_date", today);
    }
  }, []);

  const updateGlasses = (newValue) => {
    if (newValue < 0) return;
    setGlasses(newValue);
    localStorage.setItem("daily_water_glasses", newValue.toString());
    localStorage.setItem("daily_water_date", new Date().toDateString());
    
    if (newValue === target) {
      toast.success("Hydration goal reached! 💧");
    }
  };

  return (
    <div className="h-full p-6 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] flex flex-col relative overflow-hidden group hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 rounded-2xl">
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-lg font-medium text-white/90">Hydration</span>
        </div>
        <button 
          onClick={() => updateGlasses(0)}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white/60"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center z-10 gap-6">
        <div className="text-center space-y-1">
          <div className="text-5xl font-bold text-white tracking-tight">
            {glasses}<span className="text-2xl text-white/40 font-medium">/{target}</span>
          </div>
          <p className="text-sm text-white/40 font-medium">glasses today</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => updateGlasses(glasses - 1)}
            disabled={glasses === 0}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95 border border-white/5"
          >
            <Minus className="w-5 h-5 text-white/70" />
          </button>
          
          <button
            onClick={() => updateGlasses(glasses + 1)}
            className="w-16 h-16 rounded-2xl bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>

      {/* Background Liquid Effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-blue-500/10 transition-all duration-700 ease-in-out"
        style={{ height: `${Math.min((glasses / target) * 100, 100)}%` }}
      />
    </div>
  );
};
