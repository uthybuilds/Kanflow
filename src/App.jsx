import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { Loading } from "./components/ui/Loading";
import { LandingPage } from "./components/landing/LandingPage";
import { AuthPage } from "./components/auth/AuthPage";
import { VerifyEmail } from "./components/auth/VerifyEmail";
import { UpdatePassword } from "./components/auth/UpdatePassword";
import { ResetPassword } from "./components/auth/ResetPassword";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Toaster, toast } from "sonner";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

// Page Imports
import { Features } from "./components/pages/Features";
import { Method } from "./components/pages/Method";
import { About } from "./components/pages/About";
import { Contact } from "./components/pages/Contact";
import { Legal } from "./components/pages/Legal";

// Rich Content Pages
import { Integrations } from "./components/pages/Integrations";
import { Changelog } from "./components/pages/Changelog";
import { Blog } from "./components/pages/Blog";
import { CommandMenu } from "./components/ui/CommandMenu";
import { SessionProvider } from "./context/SessionContext";

function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.deleted) {
        supabase.auth.signOut();
        setSession(null);
        navigate("/");
      } else {
        setSession(session);
      }
      setIsLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.user_metadata?.deleted) {
        supabase.auth.signOut();
        setSession(null);
        navigate("/");
        return;
      }

      setSession(session);
      setIsLoading(false);

      if (event === "TOKEN_REFRESH_REVOKED") {
        toast.error("Session expired. Please login again.");
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
        <Loading />
      </div>
    );
  }

  return (
    <SessionProvider session={session}>
      <Toaster position="bottom-right" theme="dark" />
      <CommandMenu open={isCommandMenuOpen} setOpen={setIsCommandMenuOpen} />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={
              !session ? <AuthPage /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Public Content Pages */}
          <Route path="/features" element={<Features />} />
          <Route path="/method" element={<Method />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Rich Content Pages */}
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/blog" element={<Blog />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="/security" element={<Legal type="security" />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute session={session}>
                <Dashboard session={session} />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </SessionProvider>
  );
}

export default App;
