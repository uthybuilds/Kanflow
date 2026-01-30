import { Search, Bell, Plus, Menu } from "lucide-react";

export const Header = ({
  onNewIssue,
  onSearch,
  searchQuery,
  onToggleSidebar,
}) => {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-4 transition-colors duration-300">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-4 w-full max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-zinc-900/50 border border-transparent focus:bg-zinc-900 border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={onNewIssue}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Issue</span>
        </button>
      </div>
    </header>
  );
};
