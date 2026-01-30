import { cn } from "../../lib/utils";

export const Loading = ({ className }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full min-h-[200px]",
        className,
      )}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-12 h-12">
          <img
            src="/favicon.svg"
            alt="KanFlow"
            className="w-full h-full animate-pulse drop-shadow-2xl"
          />
          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full -z-10 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
