import { useEffect, useState } from "react";
import { Command, Calendar, User, Hash, CornerDownLeft } from "lucide-react";

export const KeyboardPower = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const commands = [
    { icon: User, label: "Assign to...", shortcut: "A" },
    { icon: Calendar, label: "Set due date...", shortcut: "D" },
    { icon: Hash, label: "Change status...", shortcut: "S" },
  ];

  return (
    <section className="py-24 bg-zinc-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
        {/* Text Content */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-400 mb-6">
            <Command className="w-3 h-3" />
            <span>Command Menu</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Don't lift your hands.
          </h2>
          <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
            Every action is just a keystroke away. Power users move at the speed
            of thought with our global command menu.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "Cmd + K", action: "Open menu" },
              { key: "C", action: "Create task" },
              { key: "/", action: "Search" },
              { key: "?", action: "Shortcuts" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-white/5"
              >
                <span className="text-zinc-400 text-sm">{item.action}</span>
                <kbd className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs font-mono border border-white/5">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Visual */}
        <div className="flex-1 w-full max-w-md">
          <div className="relative rounded-xl bg-zinc-900 border border-white/10 shadow-2xl p-2 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            {/* Search Input */}
            <div className="flex items-center px-3 py-3 border-b border-white/5 gap-3 mb-2">
              <Command className="w-4 h-4 text-zinc-500" />
              <div className="h-4 w-1 bg-blue-500 animate-pulse"></div>
              <span className="text-sm text-zinc-500">Type a command...</span>
              <span className="ml-auto text-xs text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
                ESC
              </span>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {commands.map((cmd, i) => (
                <div
                  key={i}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors
                    ${i === activeIndex ? "bg-blue-500 text-white" : "text-zinc-400 hover:bg-zinc-800"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <cmd.icon
                      className={`w-4 h-4 ${i === activeIndex ? "text-white" : "text-zinc-500"}`}
                    />
                    <span className="text-sm font-medium">{cmd.label}</span>
                  </div>
                  {i === activeIndex && (
                    <CornerDownLeft className="w-3 h-3 text-white/70" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-2 pt-2 border-t border-white/5 px-2 flex justify-between text-[10px] text-zinc-600">
              <span>Navigation</span>
              <div className="flex gap-1">
                <span className="bg-zinc-800 px-1 rounded">↑</span>
                <span className="bg-zinc-800 px-1 rounded">↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
