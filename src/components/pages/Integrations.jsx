import { PageLayout } from "../layout/PageLayout";
import { Github, Slack, Figma, Globe, Server, Code2 } from "lucide-react";

const integrations = [
  {
    name: "GitHub",
    icon: Github,
    category: "Code",
    desc: "Link pull requests to issues automatically.",
  },
  {
    name: "GitLab",
    icon: Code2,
    category: "Code",
    desc: "Sync merge requests and CI/CD pipelines.",
  },
  {
    name: "Slack",
    icon: Slack,
    category: "Communication",
    desc: "Create and update issues directly from Slack.",
  },
  {
    name: "Discord",
    icon: Globe,
    category: "Communication",
    desc: "Receive notifications in your team server.",
  },
  {
    name: "Figma",
    icon: Figma,
    category: "Design",
    desc: "Embed design files directly in your issues.",
  },
  {
    name: "Sentry",
    icon: Server,
    category: "Monitoring",
    desc: "Create issues from error reports automatically.",
  },
];

export const Integrations = () => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
            Connect your tools
          </h1>
          <p className="text-xl text-zinc-400">
            KanFlow plays nice with the tools you already use. Sync data,
            automate workflows, and keep everything in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-zinc-900 transition-all cursor-pointer shadow-sm dark:shadow-none"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-zinc-800 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                  <item.icon className="w-6 h-6 text-zinc-300 group-hover:text-blue-500" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-zinc-500 border border-white/5">
                  {item.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
