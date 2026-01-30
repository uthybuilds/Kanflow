import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Check current session and listen for auth changes
    const checkSession = async () => {
      // Check for errors in URL (hash or query params)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorDescription =
        hashParams.get("error_description") ||
        searchParams.get("error_description");

      if (errorDescription) {
        if (mounted) {
          setError(errorDescription.replace(/\+/g, " "));
          setVerifying(false);
        }
        return;
      }

      // Check active session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        if (mounted) {
          setError(sessionError.message);
          setVerifying(false);
        }
      } else if (session) {
        if (mounted) setVerifying(false);
      } else {
        // No session and no error - might be a direct visit or delayed session
        // Stop verifying after a short timeout to prevent infinite loading
        setTimeout(() => {
          if (mounted) {
            setVerifying(false);
            // Optional: Redirect to auth if you want to force login
            // navigate("/auth");
          }
        }, 3000);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || session) {
        if (mounted) setVerifying(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#09090b] text-zinc-100 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full opacity-50"></div>
      </div>

      <div className="z-10 w-full max-w-[380px] animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-900 shadow-xl ring-1 ring-white/10">
            <img src="/favicon.svg" alt="KanFlow" className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {verifying ? "Verifying email..." : "Email verified"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {verifying
              ? "Please wait while we verify your email address"
              : "Your email has been successfully verified"}
          </p>
        </div>

        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-6 text-center animate-in fade-in zoom-in-95 duration-300">
          {verifying ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-sm text-zinc-500">Just a moment...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <span className="text-xl font-bold">!</span>
              </div>
              <p className="text-sm text-red-400 mb-6">{error}</p>
              <button
                onClick={() => navigate("/auth")}
                className="w-full rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-all cursor-pointer"
              >
                Back to Sign in
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 animate-in zoom-in duration-300">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-sm text-zinc-300 mb-8 leading-relaxed">
                Thank you for verifying your email. You can now access your
                workspace and start managing your projects.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                Continue
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
