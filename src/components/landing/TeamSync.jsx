import { useEffect, useState } from "react";

export const TeamSync = () => {
  const [positions, setPositions] = useState([
    { x: 20, y: 20 },
    { x: 60, y: 40 },
    { x: 40, y: 70 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map(() => ({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
        })),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const users = [
    { name: "Alex", color: "bg-blue-500", border: "border-blue-400" },
    { name: "Sarah", color: "bg-purple-500", border: "border-purple-400" },
    { name: "Mike", color: "bg-emerald-500", border: "border-emerald-400" },
  ];

  return (
    <section className="py-32 bg-zinc-950 relative overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              Real-time synchronization.
              <span className="block text-zinc-500">
                Built for distributed teams.
              </span>
            </h2>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              See who's viewing what, in real-time. KanFlow handles conflict
              resolution automatically, so you never overwrite someone else's
              work.
            </p>

            <div className="space-y-4">
              {[
                "Live presence indicators",
                "Instant updates",
                "No more conflicts",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <span className="text-zinc-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Interactive Board */}
          <div className="order-1 lg:order-2 relative h-[500px] w-full bg-zinc-900/50 rounded-2xl border border-white/5 p-6 overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>

            {/* Mock Board Columns */}
            <div className="grid grid-cols-2 gap-4 h-full relative z-10">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="h-8 w-24 bg-zinc-800/50 rounded mb-4"></div>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-zinc-800/40 border border-white/5 p-4 rounded-lg backdrop-blur-sm"
                  >
                    <div className="h-2 w-16 bg-zinc-700/50 rounded mb-2"></div>
                    <div className="h-2 w-full bg-zinc-700/30 rounded"></div>
                  </div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-4 pt-12">
                <div className="bg-zinc-800/40 border border-white/5 p-4 rounded-lg backdrop-blur-sm">
                  <div className="h-2 w-20 bg-zinc-700/50 rounded mb-2"></div>
                  <div className="h-2 w-3/4 bg-zinc-700/30 rounded mb-2"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cursors */}
            {users.map((user, i) => (
              <div
                key={i}
                className="absolute transition-all duration-[2000ms] ease-in-out z-20 pointer-events-none"
                style={{
                  left: `${positions[i].x}%`,
                  top: `${positions[i].y}%`,
                }}
              >
                <svg
                  className={`w-5 h-5 ${user.color.replace("bg-", "text-")} transform -rotate-12 drop-shadow-lg`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                </svg>
                <div
                  className={`
                  ml-4 -mt-2 px-2 py-1 rounded-md text-[10px] font-bold text-white
                  ${user.color} ${user.border} border shadow-lg
                `}
                >
                  {user.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
