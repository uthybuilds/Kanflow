const testimonials = [
  {
    quote:
      "KanFlow has completely transformed how we build software. It's fast, beautiful, and gets out of the way.",
    author: "Alex Chen",
    role: "CTO at TechStart",
    avatar: "AC",
  },
  {
    quote:
      "The keyboard shortcuts are a game changer. I can manage my entire backlog without touching the mouse.",
    author: "Sarah Jones",
    role: "Product Manager",
    avatar: "SJ",
  },
  {
    quote:
      "Finally, a project management tool that developers actually love using. It feels like an IDE.",
    author: "Mike Ross",
    role: "Senior Engineer",
    avatar: "MR",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-16 md:py-32 bg-zinc-950 border-t border-white/5 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-16">
          Loved by builders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl bg-zinc-900/30 p-6 md:p-8 border border-white/5 hover:border-white/10 transition-colors"
            >
              <p className="text-lg text-zinc-300 mb-8 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 border border-white/10">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-medium text-white">{t.author}</div>
                  <div className="text-sm text-zinc-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
