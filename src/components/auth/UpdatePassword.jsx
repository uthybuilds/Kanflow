import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-zinc-950">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full" />
      </div>

      <div className="z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-900 shadow-xl ring-1 ring-white/10">
              <img src="/favicon.svg" alt="KanFlow" className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your new password below
            </p>
          </div>

          {success ? (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500 ring-1 ring-green-500/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">
                Password Updated
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Your password has been successfully updated.
              </p>
              <div className="inline-flex items-center text-xs text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                Redirecting to dashboard...
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 px-4 py-3 text-xs text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
