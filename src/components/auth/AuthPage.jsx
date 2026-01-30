import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Loader2, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState(searchParams.get("view") || "login"); // 'login', 'signup', 'forgot_password', 'verify_code'
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showLogoLoader, setShowLogoLoader] = useState(false);

  const LogoLoader = () => (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-900 shadow-2xl ring-1 ring-white/10">
        <img
          src="/favicon.svg"
          alt="KanFlow"
          className="h-10 w-10 animate-pulse"
        />
      </div>
    </div>
  );

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (view === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Check if account is soft-deleted
        if (data?.user?.user_metadata?.deleted) {
          // Reactivate account
          const { error: updateError } = await supabase.auth.updateUser({
            data: { deleted: false },
          });

          if (updateError) {
            await supabase.auth.signOut();
            throw updateError;
          }

          toast.success("Welcome back! Your account has been reactivated.");
          // No need to throw error, just proceed
        }
      } else if (view === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/verify-email`,
          },
        });
        if (error) throw error;

        // Show loader before transition
        setShowLogoLoader(true);
        setTimeout(() => {
          setShowLogoLoader(false);
          setView("verify_code");
          setLoading(false);
        }, 2000);
      } else if (view === "verify_code") {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "signup",
        });
        if (error) throw error;

        toast.success("Email verified successfully! Please sign in.");
        setView("login");
      } else if (view === "forgot_password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) throw error;
        setSuccessMessage(
          "Password reset instructions have been sent to your email.",
        );
      }
    } catch (err) {
      // Handle "User already registered" error specifically
      if (
        err.message.toLowerCase().includes("already registered") ||
        err.message.toLowerCase().includes("already exists")
      ) {
        // Check if this is a soft-deleted account by trying to sign in
        try {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email,
              password,
            });

          if (!signInError && signInData?.user?.user_metadata?.deleted) {
            // It's a deleted account - restore it
            const { error: updateError } = await supabase.auth.updateUser({
              data: { deleted: false },
            });

            if (updateError) throw updateError;

            toast.success("Account recovered successfully! Welcome back.");
            // Force reload to dashboard to ensure clean state
            window.location.href = "/dashboard";
            return;
          } else if (!signInError) {
            // Valid account exists, just sign out and show error
            await supabase.auth.signOut();
          }
        } catch (restoreError) {
          console.error("Error checking deleted status:", restoreError);
        }

        setError("This email is already registered. Please sign in instead.");
      } else {
        setError(err.message);
      }
    } finally {
      if (view !== "signup") {
        setLoading(false);
      } else {
        // Keep loading true for signup transition to avoid flicker
        // It will be reset after the timeout in the signup block
      }

      // If we are verified, we stop loading
      if (view === "verify_code" && !error) {
        setLoading(false);
      } else if (error) {
        setLoading(false);
        setShowLogoLoader(false);
      }
    }
  };

  const getTitle = () => {
    switch (view) {
      case "login":
        return "Welcome back";
      case "signup":
        return "Create your account";
      case "verify_code":
        return "Check your email";
      case "forgot_password":
        return "Reset password";
      default:
        return "Welcome back";
    }
  };

  const getSubtitle = () => {
    switch (view) {
      case "login":
        return "Enter your credentials to access your workspace";
      case "signup":
        return "Start managing your projects with KanFlow";
      case "verify_code":
        return `We've sent a verification code to ${email}. Check your spam folder if you don't see it.`;
      case "forgot_password":
        return "Enter your email to receive reset instructions";
      default:
        return "";
    }
  };

  const getButtonText = () => {
    switch (view) {
      case "login":
        return "Sign in";
      case "signup":
        return "Create account";
      case "verify_code":
        return "Verify Code";
      case "forgot_password":
        return "Send instructions";
      default:
        return "Submit";
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#09090b] text-zinc-100 p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full opacity-30"></div>
      </div>

      {showLogoLoader ? (
        <div className="z-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
          <LogoLoader />
          <p className="mt-8 text-sm text-zinc-500 animate-pulse font-medium">
            Setting up your workspace...
          </p>
        </div>
      ) : (
        <div className="z-10 w-full max-w-[380px] animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-900 shadow-xl ring-1 ring-white/10">
              <img src="/favicon.svg" alt="KanFlow" className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {getTitle()}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">{getSubtitle()}</p>
          </div>

          {successMessage ? (
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm text-zinc-300 mb-6">{successMessage}</p>
              <button
                onClick={() => {
                  setSuccessMessage(null);
                  setView("login");
                }}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-all cursor-pointer"
              >
                Back to Sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                {view === "verify_code" ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      value={otp}
                      onChange={(e) => {
                        // Only allow numbers and limit to 8 digits
                        const value = e.target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 8);
                        setOtp(value);
                      }}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-zinc-100 placeholder:text-zinc-700 placeholder:tracking-normal placeholder:font-sans focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                      maxLength={8}
                      required
                      autoFocus
                    />
                    <p className="text-center text-xs text-zinc-500">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const { error } = await supabase.auth.resend({
                              type: "signup",
                              email: email,
                            });
                            if (error) throw error;
                            toast.success("Code resent successfully");
                          } catch (err) {
                            setError(err.message);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                      >
                        Resend
                      </button>
                    </p>
                  </div>
                ) : (
                  <>
                    {view === "signup" && (
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                        required
                      />
                    )}
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                    {view !== "forgot_password" && (
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all pr-10"
                          required
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
                    )}
                  </>
                )}
              </div>

              {view === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot_password");
                      setError(null);
                    }}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

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
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{getButtonText()}</span>
                  </>
                ) : (
                  <>
                    {getButtonText()}
                    <ArrowRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle Links */}
          {!successMessage && (
            <div className="mt-6 text-center text-sm text-zinc-500">
              {view === "login" && (
                <button
                  onClick={() => {
                    setView("signup");
                    setError(null);
                  }}
                  className="hover:text-zinc-300 transition-colors"
                >
                  Don't have an account? Sign up
                </button>
              )}
              {view === "signup" && (
                <button
                  onClick={() => {
                    setView("login");
                    setError(null);
                  }}
                  className="hover:text-zinc-300 transition-colors"
                >
                  Already have an account? Sign in
                </button>
              )}
              {view === "forgot_password" && (
                <button
                  onClick={() => {
                    setView("login");
                    setError(null);
                  }}
                  className="hover:text-zinc-300 transition-colors"
                >
                  Back to Sign in
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
