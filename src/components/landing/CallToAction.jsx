import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-32 bg-zinc-950 relative overflow-hidden transition-colors duration-300">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="mx-auto max-w-4xl text-center px-6 relative z-10">
        <h2 className="text-4xl font-bold text-white sm:text-6xl mb-8 tracking-tight">
          Build your next big thing.
        </h2>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Start for free, then grow with your team. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth?view=signup"
            className="h-12 px-8 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 flex items-center gap-2 transition-all w-full sm:w-auto justify-center cursor-pointer"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button className="h-12 px-8 rounded-full border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-900 hover:text-white transition-all w-full sm:w-auto cursor-pointer">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};
