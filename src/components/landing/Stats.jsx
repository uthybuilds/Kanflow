const stats = [
  { value: "0ms", label: "Sync Latency" },
  { value: "100%", label: "Free for Individuals" },
  { value: "50+", label: "Integrations" },
  { value: "24/7", label: "Support" },
];

export const Stats = () => {
  return (
    <section className="py-12 md:py-24 border-y border-white/5 bg-zinc-950/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
