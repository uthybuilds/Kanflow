import { Github, Slack, Figma, Terminal, Mail, Calendar } from "lucide-react";

const tools = [
  { icon: Github, name: "GitHub", desc: "Link pull requests" },
  { icon: Mail, name: "Gmail", desc: "Turn emails into tasks" },
  { icon: Slack, name: "Slack", desc: "Chat to task sync" },
  { icon: Terminal, name: "Terminal", desc: "CLI for power users" },
  { icon: Calendar, name: "Calendar", desc: "Sync your schedule" },
  { icon: Figma, name: "Figma", desc: "Embed designs" },
];

export const Integrations = () => {
  return (
    <section className="py-32 border-t border-white/5 bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              Works with your <br />
              <span className="text-zinc-500">favorite tools.</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-8">
              KanFlow integrates with the tools you already use. Keep everything
              in sync without lifting a finger.
            </p>
            <button className="text-sm font-medium text-zinc-100 border-b border-zinc-700 pb-1 hover:border-zinc-100 transition-colors">
              View all 50+ integrations
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 transition-colors p-6 flex flex-col items-center justify-center text-center group cursor-default"
              >
                <tool.icon className="w-8 h-8 text-zinc-400 mb-4 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-zinc-300">
                  {tool.name}
                </span>
                <span className="text-xs text-zinc-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {tool.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
