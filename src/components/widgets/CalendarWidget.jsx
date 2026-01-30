import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronRight,
  X,
  Trash2,
} from "lucide-react";

export const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("kanflow_calendar_events");
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    color: "bg-blue-500",
  });

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("kanflow_calendar_events", JSON.stringify(events));
  }, [events]);

  const addEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.time) return;

    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setNewEvent({ title: "", time: "", color: "bg-blue-500" });
    setIsAdding(false);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((ev) => ev.id !== id));
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const colors = [
    { name: "Blue", value: "bg-blue-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Emerald", value: "bg-emerald-500" },
    { name: "Amber", value: "bg-amber-500" },
    { name: "Red", value: "bg-red-500" },
  ];

  return (
    <div className="h-full bg-zinc-950 border border-zinc-800/60 rounded-[32px] p-6 flex flex-col relative overflow-hidden group hover:border-zinc-700/60 transition-all duration-500">
      {/* Atmospheric Background */}
      <div className="absolute top-0 right-0 p-32 bg-red-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-red-500/10 transition-colors duration-500" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {days[date.getDay()]}
          </h2>
          <p className="text-zinc-400 font-medium">
            {months[date.getMonth()]} {date.getDate()}
          </p>
        </div>
        <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400">
          <CalendarIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {events.length === 0 && !isAdding ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 opacity-60">
            <CalendarIcon className="w-8 h-8 mb-2" />
            <p className="text-sm">No events today</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Add your first event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 group/event"
                >
                  <div className="flex flex-col items-end min-w-[60px]">
                    <span className="text-xs font-medium text-zinc-500">
                      {event.time}
                    </span>
                  </div>
                  <div className="flex-1 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 group-hover/event:bg-zinc-900 group-hover/event:border-zinc-700 transition-all flex items-center justify-between relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-1.5 h-8 rounded-full ${event.color}`}
                      />
                      <span className="text-sm font-medium text-zinc-200">
                        {event.title}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="opacity-0 group-hover/event:opacity-100 p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add Event Form/Button */}
      <div className="relative z-20 mt-4 pt-4 border-t border-zinc-800/50">
        {isAdding ? (
          <form
            onSubmit={addEvent}
            className="animate-in slide-in-from-bottom-2 space-y-3"
          >
            <input
              type="text"
              placeholder="Event title..."
              autoFocus
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <div className="flex gap-2">
              <input
                type="time"
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-700"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, time: e.target.value })
                }
              />
              <div className="flex-1 flex gap-1 justify-end items-center">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, color: c.value })}
                    className={`w-6 h-6 rounded-full ${c.value} ${newEvent.color === c.value ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950" : "opacity-50 hover:opacity-100"} transition-all`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-medium hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newEvent.title || !newEvent.time}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-sm font-medium hover:bg-zinc-900/50 hover:text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 group/add"
          >
            <Plus className="w-4 h-4 group-hover/add:scale-110 transition-transform" />
            Add Event
          </button>
        )}
      </div>
    </div>
  );
};
