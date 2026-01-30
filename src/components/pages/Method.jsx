import { PageLayout } from "../layout/PageLayout";
import {
  Zap,
  Target,
  List,
  CheckCircle2,
  Layers,
  Repeat,
  GitPullRequest,
} from "lucide-react";

export const Method = () => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <div className="mb-32 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Momentum
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We believe software tools should be invisible. They should get out
            of your way and let you flow. This is the philosophy behind KanFlow.
          </p>
        </div>

        {/* Core Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-40">
          <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors group shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Speed is a Feature
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Every interaction is optimistic. We don't wait for the server. You
              click, it happens. Syncing happens in the background.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors group shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Opinionated Software
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              We don't give you 100 ways to do one thing. We give you the right
              way. Configurability is debt. Convention is freedom.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors group shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Focus on Craft
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Software is functional art. We sweat the details—animations,
              typography, and contrast—so you enjoy using the tool.
            </p>
          </div>
        </div>

        {/* Detailed Sections with Visuals */}
        <div className="space-y-40">
          {/* Section 1: Issues */}
          <section className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden p-8 flex flex-col justify-center items-center shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent"></div>
                {/* Visual: Issue Card Construction */}
                <div className="w-64 bg-zinc-800 rounded-lg p-4 shadow-2xl border border-white/5 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                      <List className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500">
                      KAN-128
                    </span>
                  </div>
                  <div className="h-2 w-16 bg-zinc-700 rounded mb-2"></div>
                  <div className="h-2 w-32 bg-zinc-700 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-4 w-12 bg-zinc-700/50 rounded"></div>
                    <div className="h-4 w-12 bg-zinc-700/50 rounded"></div>
                  </div>
                </div>
                <div className="w-64 bg-zinc-800/80 rounded-lg p-4 shadow-xl border border-white/5 transform rotate-6 translate-y-4 translate-x-4 blur-[1px]"></div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-6">
                <List className="w-3 h-3" />
                <span>Issues</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Issues, not tickets.
              </h2>
              <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
                Tickets are for parking violations. Issues are for work. We
                designed our issue tracker to be as lightweight as possible.
                Markdown support, drag and drop, and instant search.
              </p>
              <ul className="space-y-3">
                {[
                  "Markdown descriptions with slash commands",
                  "Linear-style keyboard shortcuts",
                  "Instant filtering and search",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 2: Cycles */}
          <section className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400 mb-6">
                <Repeat className="w-3 h-3" />
                <span>Cycles</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Rhythm for your team.
              </h2>
              <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
                Stop planning endlessly. Cycles help your team focus on what
                matters right now. Set a duration, add issues, and get to work.
                Unfinished work rolls over automatically.
              </p>
              <ul className="space-y-3">
                {[
                  "Automated sprint rollover",
                  "Burn-up and velocity charts",
                  "Scope creep warnings",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden p-8 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent"></div>
                {/* Visual: Cycle Progress */}
                <div className="w-full max-w-sm bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="font-bold text-white">Cycle 14</h4>
                      <p className="text-xs text-zinc-500">Oct 24 - Nov 7</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">68%</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-4 bg-zinc-800 rounded-full overflow-hidden flex mb-2">
                    <div className="w-[45%] bg-purple-500"></div>
                    <div className="w-[15%] bg-blue-500"></div>
                    <div className="w-[8%] bg-yellow-500"></div>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>4 days remaining</span>
                    <span>12 issues left</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Roadmap */}
          <section className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden p-8 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent"></div>
                {/* Visual: Roadmap GANTT */}
                <div className="w-full h-full bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                  <div className="h-10 border-b border-white/5 bg-zinc-900/50 flex items-center px-4 gap-4">
                    <div className="w-32 h-2 bg-zinc-800 rounded"></div>
                  </div>
                  <div className="flex-1 p-4 space-y-3">
                    <div className="flex gap-4">
                      <div className="w-24 mt-2 h-2 bg-zinc-800 rounded"></div>
                      <div className="flex-1 h-6 rounded bg-blue-500/20 border border-blue-500/30 relative">
                        <div className="absolute inset-y-0 left-0 bg-blue-500 w-1/2 rounded-l opacity-20"></div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24 mt-2 h-2 bg-zinc-800 rounded"></div>
                      <div className="flex-1 ml-12 h-6 rounded bg-purple-500/20 border border-purple-500/30"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24 mt-2 h-2 bg-zinc-800 rounded"></div>
                      <div className="flex-1 mr-8 h-6 rounded bg-pink-500/20 border border-pink-500/30"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-medium text-pink-400 mb-6">
                <GitPullRequest className="w-3 h-3" />
                <span>Roadmap</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The big picture.
              </h2>
              <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
                Don't get lost in the day-to-day. The Roadmap view gives you a
                high-level overview of where your project is heading. Visualize
                dependencies and spot bottlenecks before they happen.
              </p>
              <ul className="space-y-3">
                {[
                  "Drag-and-drop timeline",
                  "Project dependencies",
                  "Milestone tracking",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};
