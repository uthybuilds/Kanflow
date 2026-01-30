import { Keyboard, Zap, Layers, GitMerge } from "lucide-react";

const features = [
  {
    title: "Built for speed",
    description:
      "Synchronized in real-time across all your users. No spinners or waiting.",
    icon: Zap,
    colSpan: "md:col-span-2",
  },
  {
    title: "Keyboard first",
    description: "Fly through your tasks with powerful keyboard shortcuts.",
    icon: Keyboard,
    colSpan: "md:col-span-1",
  },
  {
    title: "Proven workflows",
    description: "Simple workflows that just work out of the box.",
    icon: GitMerge,
    colSpan: "md:col-span-1",
  },
  {
    title: "Designed for focus",
    description: "A clutter-free interface that helps you stay in the flow.",
    icon: Layers,
    colSpan: "md:col-span-2",
  },
];

export const Features = () => {
  return (
    <section
      id="features"
      className="py-24 bg-zinc-950 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Unlike any tool you’ve used before
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Designed to the last pixel and engineered with unforgiving
            precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/20 p-6 md:p-8 hover:bg-zinc-900/40 transition-colors ${feature.colSpan}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-300 ring-1 ring-white/10 group-hover:text-white transition-colors">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
