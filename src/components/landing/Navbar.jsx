import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";

export const Navbar = () => {
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-zinc-800 to-zinc-900 shadow-inner ring-1 ring-white/10 transition-transform group-hover:scale-95">
              <img src="/favicon.svg" alt="KanFlow" className="h-5 w-5" />
            </div>
            <span className="font-semibold text-zinc-100 tracking-tight">
              KanFlow
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              to="/features"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Features
            </Link>
            <Link
              to="/method"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Method
            </Link>
            <Link
              to="/changelog"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Changelog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <Link
              to="/dashboard"
              className="group hidden sm:flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-all cursor-pointer"
            >
              Dashboard
              <ArrowRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Log in
              </Link>
              <Link
                to="/auth?view=signup"
                className="group hidden sm:flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-all cursor-pointer"
              >
                Sign up
                <ArrowRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              to="/features"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/method"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Method
            </Link>
            <Link
              to="/changelog"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Changelog
            </Link>
            <div className="border-t border-zinc-800 my-2 pt-2">
              {session ? (
                <Link
                  to="/dashboard"
                  className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/auth?view=signup"
                    className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
