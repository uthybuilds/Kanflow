import { PageLayout } from "../layout/PageLayout";

const updates = [
  {
    version: "v1.2.0",
    date: "January 24, 2025",
    title: "Cycles & Roadmap",
    desc: "Introducing Cycles to help you plan your work better. Plus, a new Roadmap view to see the big picture.",
    changes: [
      "Added Cycles (sprints) with automated rollover",
      "New Roadmap timeline view",
      "Improved issue filtering",
      "Fixed bug with dark mode persistence",
    ],
  },
  {
    version: "v1.1.5",
    date: "January 10, 2025",
    title: "Performance Improvements",
    desc: "We've rewritten the rendering engine to be 2x faster on large boards.",
    changes: [
      "Virtual scrolling for board columns",
      "Faster initial load time",
      "Optimized WebSocket connections",
    ],
  },
  {
    version: "v1.1.0",
    date: "December 15, 2024",
    title: "GitHub Integration",
    desc: "Two-way sync with GitHub issues and pull requests.",
    changes: [
      "Link PRs to issues",
      "Auto-close issues when PR is merged",
      "Sync labels and assignees",
    ],
  },
];

export const Changelog = () => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-24">
        <div className="mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
            Changelog
          </h1>
          <p className="text-xl text-zinc-400">
            New updates and improvements to KanFlow.
          </p>
        </div>

        <div className="space-y-16 relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 hidden md:block md:left-4"></div>

          {updates.map((update, i) => (
            <div key={i} className="relative md:pl-16">
              <div className="hidden md:block absolute left-2.5 top-2 w-3 h-3 rounded-full bg-zinc-900 border-2 border-blue-500 z-10"></div>

              <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {update.version}
                </h2>
                <span className="text-sm text-zinc-500 font-mono bg-zinc-900 border border-white/5 px-2 py-1 rounded">
                  {update.date}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-zinc-200 mb-3">
                {update.title}
              </h3>
              <p className="text-zinc-400 mb-6 leading-relaxed max-w-2xl">
                {update.desc}
              </p>

              <ul className="space-y-2">
                {update.changes.map((change, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-sm text-zinc-400"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0"></span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
