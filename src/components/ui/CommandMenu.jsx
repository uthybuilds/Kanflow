import { useEffect } from "react";
import { Command } from "cmdk";
import { Search, Plus, List, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CommandMenu = ({ open, setOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
    >
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
      />

      <div className="relative z-50 w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-white/5 px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-zinc-400" />
          <Command.Input
            autoFocus
            placeholder="Type a command or search..."
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 text-white disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
              <span className="text-xs">Esc</span>
            </kbd>
          </div>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
          <Command.Empty className="py-6 text-center text-sm text-zinc-500">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Navigation"
            className="text-xs font-medium text-zinc-500 mb-2 px-2"
          >
            <Command.Item
              onSelect={() => runCommand(() => navigate("/dashboard"))}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-200 aria-selected:bg-blue-600 aria-selected:text-white cursor-pointer transition-colors"
            >
              <List className="h-4 w-4" />
              <span>Go to Board</span>
              <span className="ml-auto text-xs opacity-50">G then B</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => navigate("/dashboard"))} // Assuming issues are in dashboard for now
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-200 aria-selected:bg-blue-600 aria-selected:text-white cursor-pointer transition-colors"
            >
              <List className="h-4 w-4" />
              <span>My Issues</span>
              <span className="ml-auto text-xs opacity-50">G then I</span>
            </Command.Item>
          </Command.Group>

          <Command.Group
            heading="Actions"
            className="text-xs font-medium text-zinc-500 mb-2 px-2"
          >
            <Command.Item
              onSelect={() =>
                runCommand(() => navigate("/dashboard?create=true"))
              }
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-200 aria-selected:bg-blue-600 aria-selected:text-white cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create new issue</span>
              <span className="ml-auto text-xs opacity-50">C</span>
            </Command.Item>
          </Command.Group>

          <Command.Group
            heading="Account"
            className="text-xs font-medium text-zinc-500 px-2"
          >
            <Command.Item
              onSelect={() => runCommand(() => navigate("/profile"))}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-200 aria-selected:bg-blue-600 aria-selected:text-white cursor-pointer transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Profile Settings</span>
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="border-t border-white/5 bg-zinc-900/50 p-2 text-[10px] text-zinc-500 flex items-center justify-between px-4">
          <div className="flex gap-2">
            <span>Use arrow keys to navigate</span>
            <span>Enter to select</span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
};
