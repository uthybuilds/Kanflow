
const companies = [
  "Ramp",
  "Vercel",
  "Cash App",
  "Raycast",
  "OpenAI",
  "Mercury",
  "Retool",
  "Scale",
];

export const Clients = () => {
  return (
    <section className="py-20 border-t border-white/5 overflow-hidden bg-zinc-950 transition-colors duration-300">
      <div className="text-center mb-10">
        <p className="text-sm font-medium text-zinc-400">
          Trusted by product teams at
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10"></div>

        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {/* Double the list for infinite scroll */}
          {[...companies, ...companies, ...companies].map((company, i) => (
            <div
              key={i}
              className="flex items-center gap-2 group cursor-default"
            >
              <span className="text-xl font-bold text-zinc-600 group-hover:text-zinc-300 transition-colors">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
