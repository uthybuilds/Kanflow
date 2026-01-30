import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  Layout,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden perspective-1000">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full opacity-20 pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-medium text-zinc-300">
              KanFlow 1.0 is now available
            </span>
            <ChevronRight className="h-3 w-3 text-zinc-500" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
            The new standard for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              building & shipping
            </span>
          </h1>

          <p className="text-lg text-zinc-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            KanFlow is the unified workspace for engineering teams and creative
            pros. Plan sprints, manage roadmaps, and ship products all in one
            place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link
              to="/auth?view=signup"
              className="h-10 px-6 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-100 font-medium hover:bg-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer">
              View Method
            </button>
          </div>
        </div>

        {/* Hero Visual - Clickable & Animated */}
        <Link
          to="/auth"
          className="block mt-20 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 group cursor-pointer perspective-1000"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-20 pointer-events-none"></div>

          <div className="transform-style-3d transition-transform duration-700 group-hover:rotate-x-2 group-hover:scale-[1.02]">
            <div className="rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm p-4 shadow-2xl ring-1 ring-white/10 animate-float">
              {/* Browser Header */}
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 px-2">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-white/5 border border-white/5">
                    <Layout className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-xs text-zinc-400 font-medium hidden sm:block">
                      kanflow.app/board/marketing
                    </span>
                    <span className="text-xs text-zinc-400 font-medium sm:hidden">
                      kanflow.app
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 border border-zinc-900 flex items-center justify-center text-[10px] text-white font-medium">
                      JD
                    </div>
                    <div className="h-6 w-6 rounded-full bg-emerald-500 border border-zinc-900 flex items-center justify-center text-[10px] text-white font-medium">
                      AS
                    </div>
                    <div className="h-6 w-6 rounded-full bg-zinc-700 border border-zinc-900 flex items-center justify-center text-[10px] text-zinc-300 font-medium">
                      +3
                    </div>
                  </div>
                  <div className="hidden sm:block h-4 w-px bg-white/10"></div>
                  <Search className="h-4 w-4 text-zinc-500" />
                  <Plus className="h-4 w-4 text-zinc-500" />
                </div>
              </div>

              {/* Board Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 mb-6 gap-4 sm:gap-0">
                <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
                  <h3 className="text-sm font-medium text-white">
                    Engineering Sprint 24
                  </h3>
                  <div className="hidden sm:block h-4 w-px bg-white/10"></div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filter</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
                  <button className="text-xs bg-blue-600/10 text-blue-400 px-2 py-1 rounded border border-blue-600/20 cursor-pointer whitespace-nowrap">
                    All Issues
                  </button>
                  <button className="text-xs text-zinc-500 px-2 py-1 hover:text-zinc-300 cursor-pointer whitespace-nowrap">
                    Active
                  </button>
                  <button className="text-xs text-zinc-500 px-2 py-1 hover:text-zinc-300 cursor-pointer whitespace-nowrap">
                    Backlog
                  </button>
                </div>
              </div>

              {/* Board Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90 group-hover:opacity-100 transition-opacity px-2 pb-4">
                {/* Column 1: Backlog */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="text-xs font-medium text-zinc-400">
                        Backlog
                      </span>
                      <span className="text-xs text-zinc-600">3</span>
                    </div>
                    <MoreHorizontal className="h-3.5 w-3.5 text-zinc-600" />
                  </div>

                  {/* Card 1 */}
                  <div className="rounded-lg bg-zinc-800/50 border border-white/5 p-3 space-y-3 hover:bg-zinc-800/80 transition-colors cursor-pointer group/card">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-zinc-500">
                        TASK-102
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                    </div>
                    <p className="text-sm text-zinc-200 font-medium leading-snug">
                      Finalize venue and catering budget
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Finance
                      </span>
                      <div className="ml-auto h-5 w-5 rounded-full bg-zinc-700 text-[9px] flex items-center justify-center text-zinc-400">
                        MJ
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="rounded-lg bg-zinc-800/50 border border-white/5 p-3 space-y-3 hover:bg-zinc-800/80 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-zinc-500">
                        TASK-105
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-pink-500"></div>
                    </div>
                    <p className="text-sm text-zinc-200 font-medium leading-snug">
                      Design invitation assets and social media kit
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        Design
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-blue-400" />
                      <span className="text-xs font-medium text-zinc-400">
                        In Progress
                      </span>
                      <span className="text-xs text-zinc-600">2</span>
                    </div>
                    <MoreHorizontal className="h-3.5 w-3.5 text-zinc-600" />
                  </div>

                  {/* Card 3 (Highlighted) */}
                  <div className="rounded-lg bg-zinc-800/80 border border-blue-500/30 p-3 space-y-3 shadow-lg shadow-blue-900/10 relative group-hover:translate-y-[-2px] transition-transform duration-300 cursor-pointer">
                    <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-blue-400">
                        TASK-98
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium leading-snug">
                      Implement OAuth 2.0 authentication flow
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Backend
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        High
                      </span>
                      <div className="ml-auto flex -space-x-1.5">
                        <div className="h-5 w-5 rounded-full bg-blue-600 text-[9px] flex items-center justify-center text-white border border-zinc-800">
                          JD
                        </div>
                        <div className="h-5 w-5 rounded-full bg-emerald-600 text-[9px] flex items-center justify-center text-white border border-zinc-800">
                          AS
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="rounded-lg bg-zinc-800/50 border border-white/5 p-3 space-y-3 hover:bg-zinc-800/80 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-zinc-500">
                        KAN-110
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    </div>
                    <p className="text-sm text-zinc-200 font-medium leading-snug">
                      Fix navigation state persistence bug
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        Bug
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Done */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs font-medium text-zinc-400">
                        Done
                      </span>
                      <span className="text-xs text-zinc-600">5</span>
                    </div>
                    <MoreHorizontal className="h-3.5 w-3.5 text-zinc-600" />
                  </div>

                  {/* Card 5 */}
                  <div className="rounded-lg bg-zinc-800/30 border border-white/5 p-3 space-y-3 opacity-75 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-zinc-600 line-through">
                        KAN-95
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <p className="text-sm text-zinc-400 font-medium leading-snug line-through">
                      Landing page redesign and animations
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Frontend
                      </span>
                      <div className="ml-auto h-5 w-5 rounded-full bg-zinc-700 text-[9px] flex items-center justify-center text-zinc-500">
                        MK
                      </div>
                    </div>
                  </div>

                  {/* Card 6 */}
                  <div className="rounded-lg bg-zinc-800/30 border border-white/5 p-3 space-y-3 opacity-75 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-zinc-600 line-through">
                        KAN-92
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 font-medium leading-snug line-through">
                      Update dependency packages
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                        Maint
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay Hover Effect */}
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};
