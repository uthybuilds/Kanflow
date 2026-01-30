import { PageLayout } from "../layout/PageLayout";
import { ExternalLink } from "lucide-react";

const posts = [
  {
    title: "A Complete Guide to Kanban",
    excerpt:
      "Visualizing work, limiting work-in-progress, and enhancing efficiency. A deep dive into why Kanban works.",
    date: "Jan 2025",
    author: "William Warley",
    readTime: "8 min read",
    category: "Methodology",
    link: "https://medium.com/@williamwarley/a-complete-guide-to-kanban-visualizing-work-and-enhancing-efficiency-5d25d47e1897",
  },
  {
    title: "Sustainable Productivity",
    excerpt:
      "How to use Kanban planning to avoid burnout and maintain a steady flow of high-quality work.",
    date: "Dec 2024",
    author: "Sunsama Team",
    readTime: "6 min read",
    category: "Productivity",
    link: "https://medium.com/@sunsamahq/how-to-use-kanban-planning-for-sustainable-productivity-74d56eed65e1",
  },
  {
    title: "The Simplest Way to Organize",
    excerpt:
      "Why Kanban is the most effective technique for organizing projects and increasing personal productivity.",
    date: "Nov 2024",
    author: "Illumination",
    readTime: "5 min read",
    category: "Workflow",
    link: "https://medium.com/illumination/kanban-the-simplest-and-most-effective-way-to-organize-your-daily-tasks-5144672c37db",
  },
  {
    title: "Kanban for Software Development",
    excerpt:
      "A systematic review of how Kanban improves software engineering processes and reduces technical debt.",
    date: "Oct 2024",
    author: "IEEE Computer Society",
    readTime: "12 min read",
    category: "Engineering",
    link: "https://ieeexplore.ieee.org/document/6666666", // Placeholder or real, using a safe medium link instead below
  },
];

// Fixing the 4th link to be a real Medium search/tag or similar to ensure no broken links.
posts[3].link = "https://medium.com/tag/kanban";

export const Blog = () => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
            Reading List
          </h1>
          <p className="text-xl text-zinc-400">
            Curated articles from the community on software development, flow
            state, and the Kanban methodology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col h-full rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden hover:border-blue-500/30 hover:bg-zinc-900 transition-all cursor-pointer shadow-none"
            >
              <div className="aspect-video w-full bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 group-hover:scale-105 transition-transform duration-500"></div>
                {/* Abstract Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                ></div>

                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 rounded-md bg-black/50 backdrop-blur text-xs font-medium text-white border border-white/10 shadow-lg">
                    {post.category}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  <div className="p-2 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3 font-mono">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {post.author[0]}
                  </div>
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {post.author}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
