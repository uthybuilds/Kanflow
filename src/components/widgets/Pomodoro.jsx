import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Flag, Timer } from "lucide-react";
import { cn } from "../../lib/utils";

// High-precision stopwatch hook
const useStopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const requestRef = useRef();
  const startTimeRef = useRef(0);
  const pausedTimeRef = useRef(0);

  const animate = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current + pausedTimeRef.current;
    setTime(elapsed);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
      pausedTimeRef.current = time;
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    pausedTimeRef.current = 0;
    startTimeRef.current = 0;
  };
  const lap = () => {
    setLaps((prev) => [time, ...prev]);
  };

  return { time, isRunning, start, stop, reset, lap, laps };
};

export const Pomodoro = () => {
  const { time, isRunning, start, stop, reset, lap, laps } = useStopwatch();

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return (
      <div className="flex items-baseline justify-center font-variant-numeric tabular-nums tracking-tight">
        <span className="text-5xl font-bold text-white">
          {minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-5xl font-bold text-zinc-500 mx-1">:</span>
        <span className="text-5xl font-bold text-white">
          {seconds.toString().padStart(2, "0")}
        </span>
        <span className="text-2xl font-medium text-zinc-500 ml-2 w-12">
          .{milliseconds.toString().padStart(2, "0")}
        </span>
      </div>
    );
  };

  const formatLapTime = (ms) => {
    const mins = Math.floor(ms / 60000)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    const msecs = Math.floor((ms % 1000) / 10)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}.${msecs}`;
  };

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
          <Timer className="w-5 h-5 text-blue-500" />
        </div>
        <span className="text-lg font-semibold text-white tracking-tight">
          Stopwatch
        </span>
      </div>

      {/* Main Display */}
      <div className="flex-none h-[45%] flex flex-col items-center justify-center bg-zinc-900/10 border-b border-zinc-800/50 pt-12 relative z-10">
        {formatTime(time)}
      </div>

      {/* Laps List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-950/50 relative z-10">
        <div className="p-4 space-y-1">
          {laps.map((lapTime, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 rounded-xl hover:bg-zinc-900/50 transition-colors border-b border-zinc-800/30 last:border-0"
            >
              <span className="text-sm font-medium text-zinc-400">
                Lap {laps.length - index}
              </span>
              <span className="text-sm font-mono text-zinc-300">
                {formatLapTime(lapTime)}
              </span>
            </div>
          ))}
          {laps.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-8 text-zinc-600">
              <span className="text-sm">No laps recorded</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-zinc-950 border-t border-zinc-800/50 flex justify-between items-center relative z-10">
        <button
          onClick={isRunning ? lap : reset}
          className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 active:scale-95 transition-all duration-200"
        >
          {isRunning ? (
            <span className="text-sm font-medium text-zinc-300">Lap</span>
          ) : (
            <span className="text-sm font-medium text-zinc-300">Reset</span>
          )}
        </button>

        <div className="flex gap-2">
          {/* Page indicators style decoration */}
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>

        <button
          onClick={isRunning ? stop : start}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-200 active:scale-95 shadow-lg",
            isRunning
              ? "bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20"
              : "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/20",
          )}
        >
          {isRunning ? (
            <span className="text-sm font-medium">Stop</span>
          ) : (
            <span className="text-sm font-medium">Start</span>
          )}
        </button>
      </div>
    </div>
  );
};
