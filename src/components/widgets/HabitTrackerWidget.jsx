import { useState, useEffect } from "react";
import { Check, Flame, Trophy, Plus, Trash2, X } from "lucide-react";

export const HabitTrackerWidget = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("kanflow_habits");
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  useEffect(() => {
    localStorage.setItem("kanflow_habits", JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id) => {
    setHabits(
      habits.map((h) =>
        h.id === id
          ? {
              ...h,
              completed: !h.completed,
              streak: !h.completed ? h.streak + 1 : h.streak - 1,
            }
          : h,
      ),
    );
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const colors = [
      {
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
      },
      {
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
      },
      {
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      },
      {
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
      },
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      completed: false,
      streak: 0,
      ...randomColor,
    };

    setHabits([...habits, newHabit]);
    setNewHabitName("");
    setIsAdding(false);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const progress =
    habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col relative overflow-hidden group hover:border-zinc-700/60 transition-all duration-500">
      {/* Atmospheric Background */}
      <div className="absolute bottom-0 left-0 p-32 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-500" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight mb-1">
            Daily Habits
          </h2>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-zinc-500">
              {progress}% done
            </span>
          </div>
        </div>
        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
          <Trophy className="w-6 h-6" />
        </div>
      </div>

      {/* Habits List */}
      <div className="relative z-10 flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {habits.length === 0 && !isAdding ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 opacity-60">
            <Flame className="w-8 h-8 mb-2" />
            <p className="text-sm">No habits tracked</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-amber-400 hover:text-amber-300 underline"
            >
              Start a streak
            </button>
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className={`w-full p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between group/habit ${
                habit.completed
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-zinc-950 border-zinc-800/50 hover:bg-zinc-900/30"
              }`}
            >
              <button
                onClick={() => toggleHabit(habit.id)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    habit.completed
                      ? `${habit.bg} ${habit.border} ${habit.color}`
                      : "border-zinc-700 bg-transparent group-hover/habit:border-zinc-600"
                  }`}
                >
                  <Check
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${habit.completed ? "scale-100" : "scale-0"}`}
                  />
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${habit.completed ? "text-zinc-500 line-through" : "text-zinc-300"}`}
                >
                  {habit.name}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${habit.completed ? "bg-amber-500/10 text-amber-400" : "bg-zinc-900 text-zinc-600"}`}
                >
                  <Flame className="w-3 h-3" />
                  <span className="text-xs font-bold">{habit.streak}</span>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="opacity-0 group-hover/habit:opacity-100 p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Habit Form */}
      <div className="relative z-20 mt-4 pt-4 border-t border-zinc-800/50">
        {isAdding ? (
          <form
            onSubmit={addHabit}
            className="animate-in slide-in-from-bottom-2 flex gap-2"
          >
            <input
              type="text"
              placeholder="Habit name..."
              autoFocus
              className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
            />
            <button
              type="submit"
              disabled={!newHabitName.trim()}
              className="px-3 py-2 rounded-xl bg-amber-600 text-white text-xs font-medium hover:bg-amber-500 disabled:opacity-50 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-medium hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-sm font-medium hover:bg-zinc-900/50 hover:text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 group/add"
          >
            <Plus className="w-4 h-4 group-hover/add:scale-110 transition-transform" />
            Add Habit
          </button>
        )}
      </div>
    </div>
  );
};
