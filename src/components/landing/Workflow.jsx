import { GitPullRequest, GitMerge, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: GitPullRequest,
    title: "Plan",
    description: "Capture issues, plan cycles, and prioritize work.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: GitMerge,
    title: "Build",
    description: "Version control integration that updates automatically.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: CheckCircle2,
    title: "Ship",
    description: "Automated workflows to close loops and ship faster.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export const Workflow = () => {
  return (
    <section className="py-32 bg-zinc-950 relative overflow-hidden transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            KanFlow method <br />
            <span className="text-zinc-400">
              The standard for modern software development.
            </span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Streamline issues, sprints, and product roadmaps. It’s the best way
            to manage software projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <div
                className={`w-12 h-12 rounded-xl ${step.bg} ${step.color} flex items-center justify-center mb-6 ring-4 ring-zinc-950 relative z-10 transition-transform duration-300 group-hover:scale-110`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">
                {step.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
