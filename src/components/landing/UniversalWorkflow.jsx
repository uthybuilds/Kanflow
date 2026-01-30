import { useEffect, useState } from "react";
import { Lightbulb, Terminal, Activity, Trophy } from "lucide-react";

export const UniversalWorkflow = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      icon: Lightbulb,
      label: "Plan",
      code: "Idea captured & scoped",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: Terminal,
      label: "Build",
      code: "git commit -m 'feat: ui'",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      icon: Activity,
      label: "Review",
      code: "Automated checks passed",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      icon: Trophy,
      label: "Launch",
      code: "Deployed to production",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Automate your success rhythm
          </h2>
          <p className="text-lg text-zinc-400">
            From idea to impact. KanFlow syncs with your life to keep momentum
            automatic.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 hidden md:block">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-1000 ease-in-out"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 relative">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`relative group transition-all duration-500 ${
                  i <= step
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-40 transform translate-y-2"
                }`}
              >
                <div
                  className={`
                  h-32 rounded-xl border ${i <= step ? s.border : "border-zinc-800"} 
                  bg-zinc-900/50 backdrop-blur-sm p-6 flex flex-col items-center justify-center gap-4
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                  ${i === step ? "ring-2 ring-white/10 shadow-lg shadow-blue-500/10" : ""}
                `}
                >
                  <div
                    className={`p-3 rounded-lg ${i <= step ? s.bg : "bg-zinc-800"} transition-colors`}
                  >
                    <s.icon
                      className={`w-6 h-6 ${i <= step ? s.color : "text-zinc-500"}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${i <= step ? "text-white" : "text-zinc-500"}`}
                  >
                    {s.label}
                  </span>
                </div>

                {/* Popover */}
                <div
                  className={`
                  absolute -top-16 left-1/2 -translate-x-1/2 w-48 
                  bg-zinc-950 border border-zinc-800 rounded-lg p-3
                  transform transition-all duration-500 pointer-events-none
                  ${i === step ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                `}
                >
                  <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                    </div>
                  </div>
                  <p className="font-mono text-[10px] text-zinc-400">
                    <span className="text-green-400">$</span> {s.code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
