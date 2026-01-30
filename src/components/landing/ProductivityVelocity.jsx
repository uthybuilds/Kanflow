import { BarChart3, TrendingUp, ArrowUpRight } from "lucide-react";

export const ProductivityVelocity = () => {
  return (
    <section className="py-24 bg-zinc-950 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Insights that actually matter
          </h2>
          <p className="text-lg text-zinc-400">
            Stop guessing. Measure your team's velocity and cycle time
            automatically.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl bg-zinc-900/30 border border-white/5 rounded-2xl p-4 md:p-8 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  Sprint Velocity
                </h3>
                <p className="text-xs text-zinc-500">Last 6 sprints</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <TrendingUp className="w-3 h-3" />
              +12% vs last sprint
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="h-64 w-full flex items-end justify-between gap-4 px-4 pb-4 relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-px bg-white/5 border-t border-dashed border-white/5"
                ></div>
              ))}
            </div>

            {/* Bars */}
            {[45, 52, 48, 60, 58, 72].map((height, i) => (
              <div
                key={i}
                className="relative group w-full flex flex-col justify-end h-full"
              >
                <div
                  className="w-full bg-gradient-to-t from-blue-500/20 to-blue-500/50 rounded-t-sm hover:from-blue-400/30 hover:to-blue-400/60 transition-all duration-500 cursor-pointer relative"
                  style={{ height: `${height}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap z-10">
                    {height} points
                  </div>
                </div>
                <div className="mt-4 text-xs text-zinc-500 text-center font-mono">
                  S{i + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Overlay Stat */}
          <div className="md:absolute md:top-1/2 md:right-12 md:transform md:-translate-y-1/2 relative mt-6 md:mt-0 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="flex items-center justify-between gap-8 mb-2">
              <span className="text-xs text-zinc-500 uppercase font-bold">
                Avg Velocity
              </span>
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">56.4</div>
            <div className="text-xs text-zinc-400">Points per sprint</div>
          </div>
        </div>
      </div>
    </section>
  );
};
