import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

export const Sidebar = ({
  currentView,
  setCurrentView,
  onLogout,
  userInitials,
  userEmail,
  userAvatar,
  onOpenSettings,
  isOpen,
  onClose,
}) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "board", label: "Board", icon: CheckSquare }, // Swapped icon for variety
    { id: "list", label: "My Tasks", icon: CheckSquare },
    { id: "timeline", label: "Timeline", icon: CalendarDays },
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-[100dvh] fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-lg ring-1 ring-white/10 bg-gradient-to-tr from-zinc-800 to-zinc-900">
              <img src="/favicon.svg" alt="KanFlow" className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-100">
              KanFlow
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Workspace
            </p>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                currentView === item.id
                  ? "bg-blue-600/10 text-blue-500"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  currentView === item.id
                    ? "text-blue-500"
                    : "text-zinc-500 group-hover:text-zinc-300",
                )}
              />
              {item.label}
            </button>
          ))}

          <div className="px-3 mt-8 mb-2">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Account
            </p>
          </div>
          <button
            onClick={() => {
              onOpenSettings();
              onClose?.();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
          >
            <Settings className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300" />
            Settings
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-zinc-700 to-zinc-600 ring-1 ring-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-200 shadow-inner overflow-hidden">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {userEmail}
              </p>
              <button
                onClick={onLogout}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
