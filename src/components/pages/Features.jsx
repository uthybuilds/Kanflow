import { PageLayout } from "../layout/PageLayout";
import {
  Zap,
  Keyboard,
  GitMerge,
  Command,
  CheckCircle2,
  Search,
  BarChart3,
  Plus,
  Circle,
} from "lucide-react";

export const Features = () => {
  const toggleCommandMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Dispatch a keyboard event to trigger the command menu
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      }),
    );
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-8">
            Built for speed.
            <br />
            <span className="text-zinc-500">Designed for focus.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
            KanFlow is a purpose-built tool for modern software development. It
            streamlines your workflow so you can focus on shipping.
          </p>

          {/* Hero Visual - Detailed CSS Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-zinc-900 shadow-2xl overflow-hidden aspect-[16/9] group text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-900/10"></div>

            {/* Window Header */}
            <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/5 bg-zinc-950/80 backdrop-blur flex items-center px-4 gap-2 z-20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <div className="mx-auto w-64 h-6 rounded bg-zinc-800/50 border border-white/5 flex items-center justify-center">
                <span className="text-[10px] text-zinc-500 font-medium">
                  kanflow.app
                </span>
              </div>
            </div>

            {/* App UI */}
            <div className="absolute inset-0 top-10 flex">
              {/* Sidebar */}
              <div className="w-48 border-r border-white/5 bg-zinc-950/50 hidden md:flex flex-col p-3 gap-1">
                <div className="h-8 rounded-md bg-zinc-800/50 mb-4"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-6 rounded-md hover:bg-white/5 flex items-center gap-2 px-2"
                  >
                    <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                    <div className="h-2 w-20 bg-zinc-800 rounded"></div>
                  </div>
                ))}
              </div>

              {/* Main Board Area */}
              <div className="flex-1 p-6 overflow-hidden bg-zinc-900/30">
                <div className="flex gap-6 h-full">
                  {/* Column 1: Todo */}
                  <div className="w-72 flex-shrink-0 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
                        <span className="text-sm font-medium text-zinc-400">
                          Todo
                        </span>
                        <span className="text-xs text-zinc-600">3</span>
                      </div>
                      <Plus className="w-4 h-4 text-zinc-600" />
                    </div>

                    <div className="bg-zinc-800/40 border border-white/5 rounded-lg p-3 hover:border-white/10 transition-colors cursor-pointer group/card">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-medium text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                          Design
                        </span>
                        <div className="h-4 w-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500" />
                      </div>
                      <div className="h-2 w-3/4 bg-white/10 rounded mb-1.5" />
                      <div className="h-2 w-1/2 bg-white/10 rounded mb-3" />
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-4 rounded bg-white/5" />
                        <div className="flex -space-x-1">
                          <div className="h-4 w-4 rounded-full ring-2 ring-zinc-900 bg-zinc-700" />
                          <div className="h-4 w-4 rounded-full ring-2 ring-zinc-900 bg-zinc-600" />
                        </div>
                      </div>
                    </div>

                    {/* Ghost Card 1 */}
                    <div className="bg-zinc-800/20 border border-white/5 rounded-lg p-3 opacity-60">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-3 w-10 bg-white/5 rounded" />
                        <div className="h-4 w-4 rounded-full bg-white/5" />
                      </div>
                      <div className="h-2 w-2/3 bg-white/5 rounded mb-1.5" />
                      <div className="h-2 w-1/3 bg-white/5 rounded" />
                    </div>

                    {/* Ghost Card 2 */}
                    <div className="bg-zinc-800/20 border border-white/5 rounded-lg p-3 opacity-60">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-3 w-8 bg-white/5 rounded" />
                        <div className="h-4 w-4 rounded-full bg-white/5" />
                      </div>
                      <div className="h-2 w-1/2 bg-white/5 rounded mb-1.5" />
                      <div className="h-2 w-1/4 bg-white/5 rounded" />
                    </div>
                  </div>

                  {/* Column 2: In Progress */}
                  <div className="w-72 flex-shrink-0 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-zinc-400">
                          In Progress
                        </span>
                        <span className="text-xs text-zinc-600">1</span>
                      </div>
                    </div>

                    {/* Active Card */}
                    <div className="bg-zinc-800 border border-blue-500/30 rounded-lg p-3 shadow-lg shadow-blue-900/10 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-blue-400 font-mono">
                          KAN-120
                        </span>
                      </div>
                      <p className="text-sm text-white font-medium mb-3">
                        Refactor database schema for scalability
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-400">
                          High Priority
                        </div>
                        <div className="w-5 h-5 rounded-full bg-blue-500 ml-auto border border-blue-400 flex items-center justify-center text-[8px] font-bold text-white">
                          U
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Done */}
                  <div className="w-72 flex-shrink-0 flex flex-col gap-3 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-zinc-400">
                          Done
                        </span>
                        <span className="text-xs text-zinc-600">5</span>
                      </div>
                    </div>

                    <div className="bg-zinc-800/20 border border-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-zinc-600 font-mono line-through">
                          KAN-119
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 font-medium mb-3 line-through">
                        Setup project repository
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Command Menu Overlay (Floating) */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-zinc-900 rounded-xl border border-white/10 shadow-2xl shadow-black/50 p-2 z-30 transform scale-90 md:scale-100 cursor-pointer hover:border-white/20 hover:scale-[1.02] transition-all"
              onClick={toggleCommandMenu}
            >
              <div className="flex items-center px-3 py-2 border-b border-white/5 gap-2 pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-300">Create issue...</span>
                <span className="ml-auto text-xs text-zinc-600 border border-white/10 px-1 rounded">
                  Esc
                </span>
              </div>
              <div className="p-1 mt-1 pointer-events-none">
                <div className="flex items-center gap-3 px-3 py-2 bg-blue-600 rounded-lg text-white">
                  <Circle className="w-4 h-4" />
                  <span className="text-sm">Create new issue</span>
                  <span className="ml-auto text-xs opacity-70">Enter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-white mb-12">Core Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {/* Card 1: Large */}
          <div className="md:col-span-2 row-span-2 rounded-3xl bg-zinc-900 border border-white/10 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <Keyboard className="w-64 h-64 text-white" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6">
                <Keyboard className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Keyboard First
              </h3>
              <p className="text-zinc-400 max-w-md">
                Navigate your entire workspace without lifting your hands. Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-xs font-mono">
                  ?
                </kbd>{" "}
                to view shortcuts.
              </p>
            </div>
          </div>

          {/* Card 2: Small */}
          <div className="rounded-3xl bg-zinc-900 border border-white/10 p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-6">
              <GitMerge className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Git Integration
            </h3>
            <p className="text-sm text-zinc-400">
              Automate your workflow with deep GitHub & GitLab integration.
            </p>
          </div>

          {/* Card 3: Small */}
          <div className="rounded-3xl bg-zinc-900 border border-white/10 p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Real-time Sync
            </h3>
            <p className="text-sm text-zinc-400">
              Collaborate instantly with 15ms latency globally.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Rows */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 space-y-32">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Command className="w-4 h-4" />
              <span>Command Menu</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Power at your fingertips.
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Access every action, view, and setting in seconds. The Command
              Menu is your control center for KanFlow. Switch contexts, assign
              issues, or change statuses without breaking flow.
            </p>
            <ul className="space-y-4">
              {[
                "Global search across all projects",
                "Quick actions for common tasks",
                "Keyboard navigation support",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl">
            <div className="rounded-xl bg-zinc-950 p-6 aspect-square flex flex-col relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="w-full h-12 border-b border-white/5 mb-4 flex items-center px-4 gap-3 text-zinc-500 bg-zinc-900/50 rounded-t-lg z-10">
                <Search className="w-4 h-4" />
                <span className="text-sm">Search or type a command...</span>
                <div className="ml-auto flex gap-2">
                  <span className="text-xs border border-white/10 rounded px-1.5 py-0.5">
                    ⌘
                  </span>
                  <span className="text-xs border border-white/10 rounded px-1.5 py-0.5">
                    K
                  </span>
                </div>
              </div>
              <div className="space-y-2 z-10">
                {[
                  "Create new issue",
                  "Go to board",
                  "My issues",
                  "Change theme",
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg flex items-center justify-between transition-all ${i === 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 transform scale-105" : "text-zinc-400 hover:bg-white/5"}`}
                  >
                    <span className="text-sm font-medium">{item}</span>
                    {i === 0 && (
                      <span className="text-xs opacity-70">Enter</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
          <div className="lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              <span>Insights</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Data driven decisions.
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Visualize your team's velocity and progress. Identify bottlenecks
              before they become blockers. KanFlow provides powerful analytics
              without the configuration headache.
            </p>
          </div>
          <div className="lg:order-1 rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl">
            <div className="rounded-xl bg-zinc-950 p-6 aspect-video flex items-end justify-between gap-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-purple-500/20 rounded-t-sm relative group z-10"
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-purple-500 rounded-t-sm transition-all duration-1000 group-hover:bg-purple-400"
                    style={{ height: `${h}%` }}
                  ></div>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    {h} tasks
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
