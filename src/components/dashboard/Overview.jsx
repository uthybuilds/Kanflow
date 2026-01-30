import { useMemo, useState, useEffect } from "react";
import { GitHubWidget } from "../widgets/GitHubWidget";
import { GitLabWidget } from "../widgets/GitLabWidget";
import { CommunicationWidget } from "../widgets/CommunicationWidget";
import { DesignWidget } from "../widgets/DesignWidget";
import { MonitoringWidget } from "../widgets/MonitoringWidget";
import { Pomodoro } from "../widgets/Pomodoro";
import { QuickNotes } from "../widgets/QuickNotes";
import { WaterWidget } from "../widgets/WaterWidget";
import { QuoteWidget } from "../widgets/QuoteWidget";
import { WorldClockWidget } from "../widgets/WorldClockWidget";
import { CalendarWidget } from "../widgets/CalendarWidget";
import { HabitTrackerWidget } from "../widgets/HabitTrackerWidget";
import { ZoomWidget } from "../widgets/ZoomWidget";
import { ListView } from "./ListView";
import { Zap, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const Overview = ({
  session,
  tasks,
  onTasksUpdated,
  searchQuery,
  onTaskClick,
}) => {
  // Greeting Logic
  const email = session?.user?.email || "User";
  const fullName = session?.user?.user_metadata?.full_name;
  const displayName = fullName || email.split("@")[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const randomQuote = useMemo(() => {
    const localQuotes = [
      "The secret of getting ahead is getting started.",
      "It always seems impossible until it's done.",
      "Don't watch the clock; do what it does. Keep going.",
      "Quality is not an act, it is a habit.",
      "Believe you can and you're halfway there.",
    ];
    const seed = displayName || "user";
    const sum = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const idx = sum % localQuotes.length;
    return localQuotes[idx];
  }, [displayName]);

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const inReviewTasks = tasks.filter((t) => t.status === "review").length;

  const progressPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          ((completedTasks * 1.0 +
            inReviewTasks * 0.75 +
            inProgressTasks * 0.5) /
            totalTasks) *
            100,
        );
  const points = completedTasks * 10 + inReviewTasks * 8 + inProgressTasks * 5;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[32px] bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-zinc-950 border border-zinc-800/50 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-blue-600/15 transition-colors duration-500" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              {getGreeting()},{" "}
              <span className="text-blue-400">
                {displayName}
              </span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-lg font-light leading-relaxed">
              "{randomQuote}"
            </p>

            <div className="mt-8 flex items-center gap-12">
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                  Overall Progress
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              <div className="w-px h-12 bg-zinc-800" />
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                  Productivity XP
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-400 tracking-tight">
                    {points}
                  </span>
                  <span className="text-sm text-zinc-500 font-medium">
                    points
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-6">
          <div className="rounded-[32px] bg-zinc-950 border border-zinc-800/60 p-6 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
                Active
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-bold text-white mb-1 tracking-tight">
                {inProgressTasks}
              </p>
              <p className="text-sm text-zinc-500 font-medium">
                Tasks in progress
              </p>
            </div>
          </div>
          <div className="rounded-[32px] bg-zinc-950 border border-zinc-800/60 p-6 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
                Done
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-bold text-white mb-1 tracking-tight">
                {completedTasks}
              </p>
              <p className="text-sm text-zinc-500 font-medium">
                Total Completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {searchQuery ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">
            Search Results for "{searchQuery}"
          </h2>
          <ListView tasks={tasks} onTaskClick={onTaskClick} />
        </div>
      ) : (
        <>
          {/* Bento Grid Widgets - Row 1 (Daily & Personal) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto lg:h-[400px]">
            {/* Water Tracker */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px] lg:h-full">
              <WaterWidget />
            </div>

            {/* Inspiration */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px] lg:h-full">
              <QuoteWidget />
            </div>

            {/* World Clock */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px] lg:h-full">
              <WorldClockWidget />
            </div>

            {/* Calendar */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px] lg:h-full">
              <CalendarWidget />
            </div>
          </div>

          {/* Bento Grid Widgets - Row 2 (Productivity) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto lg:h-[400px]">
            {/* Habit Tracker */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px] lg:h-full">
              <HabitTrackerWidget />
            </div>

            {/* Pomodoro */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px] lg:h-full">
              <Pomodoro />
            </div>

            {/* Notes */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px] lg:h-full flex flex-col gap-6">
              <div className="h-full">
                <QuickNotes session={session} />
              </div>
            </div>

            {/* Communication */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px] lg:h-full">
              <CommunicationWidget session={session} />
            </div>
          </div>

          {/* Bento Grid Widgets - Row 3 (Integrations) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* GitHub */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px]">
              <GitHubWidget session={session} onTasksUpdated={onTasksUpdated} />
            </div>

            {/* GitLab */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px]">
              <GitLabWidget session={session} onTasksUpdated={onTasksUpdated} />
            </div>

            {/* Figma */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px]">
              <DesignWidget session={session} />
            </div>

            {/* Sentry */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px]">
              <MonitoringWidget session={session} />
            </div>

            {/* Zoom */}
            <div className="md:col-span-1 lg:col-span-1 h-[400px]">
              <ZoomWidget session={session} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
