import { useState, useRef, useEffect } from "react";
import {
  X,
  User,
  Shield,
  Puzzle,
  Lock,
  AlertTriangle,
  Check,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { taskService } from "../../services/taskService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { IntegrationsPanel } from "./IntegrationsPanel";

export const SettingsModal = ({
  isOpen,
  onClose,
  session,
  onTasksUpdated,
  initialTab = "profile",
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(
    session?.user?.user_metadata?.full_name || "",
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    session?.user?.user_metadata?.avatar_url || "",
  );

  // Email & Re-auth states
  const [newEmail, setNewEmail] = useState(session?.user?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isReauthOpen, setIsReauthOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [pendingAction, setPendingAction] = useState(null); // 'delete_account' | 'update_email'

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keep active tab in sync when modal opens via deep-link
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  useEffect(() => {
    if (session?.user?.email) {
      setNewEmail(session.user.email);
    }
  }, [session]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let avatarUrl = session?.user?.user_metadata?.avatar_url;

      // Upload avatar if a new file was selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }

      // Update user profile with full name and (potentially new) avatar URL
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
        },
      });

      if (error) throw error;
      toast.success("Profile updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a local preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setAvatarFile(file);
  };

  const handleDeleteAllTasks = async () => {
    if (
      confirm(
        "Are you sure you want to delete ALL your tasks? This cannot be undone.",
      )
    ) {
      setIsLoading(true);
      try {
        await taskService.deleteAllTasks();

        toast.success("All tasks deleted successfully");
        if (onTasksUpdated) onTasksUpdated();
        else window.location.reload();
      } catch (error) {
        toast.error("Error deleting tasks: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Re-authentication Logic
  const initiateDeleteAccount = () => {
    setPendingAction("delete_account");
    setIsReauthOpen(true);
  };

  const initiateUpdateEmail = () => {
    if (newEmail === session?.user?.email) {
      setIsEditingEmail(false);
      return;
    }
    setPendingAction("update_email");
    setIsReauthOpen(true);
  };

  const handleReauthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Re-authenticate
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: reauthPassword,
      });

      if (authError) throw new Error("Incorrect password. Please try again.");

      // 2. Perform Pending Action
      if (pendingAction === "delete_account") {
        // Mark as deleted in metadata
        await supabase.auth.updateUser({ data: { deleted: true } });
        await supabase.auth.signOut();
        toast.success("Account deleted successfully");
        window.location.href = "/";
      } else if (pendingAction === "update_email") {
        const { error: updateError } = await supabase.auth.updateUser({
          email: newEmail,
        });
        if (updateError) throw updateError;
        toast.success("Confirmation email sent to " + newEmail);
        setIsEditingEmail(false);
        setIsReauthOpen(false);
        setReauthPassword("");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "integrations", label: "Integrations", icon: Puzzle },
    { id: "account", label: "Account", icon: Shield },
  ];

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-full sm:max-w-6xl xl:max-w-7xl h-full sm:h-[800px] flex overflow-hidden rounded-[40px] border border-zinc-800/60 bg-zinc-950 shadow-2xl transition-all animate-in zoom-in-95 duration-300 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 p-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 p-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Re-auth Modal Overlay */}
        {isReauthOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all duration-300">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800/80 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-24 bg-red-500/5 blur-[60px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex items-center gap-4 mb-6 text-zinc-100">
                <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">
                  Re-authentication Required
                </h3>
              </div>

              <p className="relative z-10 text-sm text-zinc-400 mb-8 leading-relaxed">
                {pendingAction === "delete_account"
                  ? "For your security, please enter your password to confirm account deletion."
                  : "Please enter your password to confirm email change."}
              </p>

              <form
                onSubmit={handleReauthSubmit}
                className="relative z-10 space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 pl-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={reauthPassword}
                    onChange={(e) => setReauthPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/50 text-base text-zinc-100 focus:border-red-500/50 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-zinc-700"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReauthOpen(false);
                      setReauthPassword("");
                      setPendingAction(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!reauthPassword || isLoading}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-all shadow-lg shadow-red-900/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? "Verifying..." : "Confirm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-72 border-r border-zinc-800/60 bg-zinc-900/20 backdrop-blur-sm p-6 relative z-10">
          <h2 className="text-xl font-semibold text-zinc-100 mb-8 px-2 tracking-tight">
            Settings
          </h2>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                  activeTab === tab.id
                    ? "bg-zinc-800 text-white shadow-lg shadow-black/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 transition-colors ${
                    activeTab === tab.id
                      ? "text-zinc-950"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950/30 relative z-10">
          {/* Mobile Tabs */}
          <div className="sm:hidden border-b border-zinc-800/60 px-4 py-3 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-zinc-800 text-white shadow-md"
                      : "bg-zinc-900/50 text-zinc-400 border border-zinc-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-6 sm:px-10 py-6 sm:py-8 sticky top-0 z-10">
            <h3 className="text-2xl font-bold text-zinc-100 tracking-tight">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-2.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all hover:rotate-90 duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 sm:px-10 pb-10 custom-scrollbar">
            {activeTab === "profile" && (
              <div className="max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h4 className="text-lg font-medium text-zinc-100 mb-2">
                    Public Profile
                  </h4>
                  <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                    Manage how you appear to other users across the workspace.
                  </p>

                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="flex items-center gap-8">
                      <div className="relative group">
                        <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-[32px] bg-gradient-to-tr from-zinc-800 to-zinc-700 ring-4 ring-zinc-900 flex items-center justify-center text-3xl font-medium text-zinc-200 overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : fullName ? (
                            Array.from(fullName)[0].toUpperCase()
                          ) : (
                            session?.user?.email?.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleAvatarClick}
                          className="absolute bottom-0 right-0 p-2.5 rounded-xl bg-zinc-800 text-white shadow-lg hover:bg-zinc-700 hover:scale-110 transition-all duration-300"
                        >
                          <User className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*"
                      />

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-zinc-200">
                          Profile Photo
                        </h5>
                        <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">
                          Click the icon to upload a new photo. Recommended
                          size: 400x400px.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 pl-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 text-base sm:text-sm text-zinc-100 focus:border-zinc-600 focus:bg-zinc-900/80 focus:outline-none focus:ring-4 focus:ring-zinc-800/20 transition-all placeholder:text-zinc-700"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="pt-8 border-t border-zinc-800/50">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-2xl bg-zinc-800 text-sm font-bold text-white hover:bg-zinc-700 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-black/20"
                      >
                        {isLoading ? "Saving Changes..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <IntegrationsPanel
                  session={session}
                  onTasksUpdated={onTasksUpdated}
                />
              </div>
            )}

            {activeTab === "account" && (
              <div className="max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h4 className="text-lg font-medium text-zinc-100 mb-2">
                    Account Settings
                  </h4>
                  <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                    Manage your account credentials and security preferences.
                  </p>

                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 pl-1">
                          Email Address
                        </label>
                        {!isEditingEmail ? (
                          <button
                            type="button"
                            onClick={() => setIsEditingEmail(true)}
                            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Change Email
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingEmail(false);
                              setNewEmail(session?.user?.email);
                            }}
                            className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          disabled={!isEditingEmail}
                          className={`flex-1 h-12 px-4 rounded-2xl border text-sm transition-all ${
                            isEditingEmail
                              ? "border-zinc-700 bg-zinc-900/50 text-zinc-100 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                              : "border-zinc-800/50 bg-zinc-900/20 text-zinc-500 cursor-not-allowed"
                          }`}
                        />
                        {isEditingEmail && (
                          <button
                            onClick={initiateUpdateEmail}
                            disabled={
                              !newEmail ||
                              newEmail === session?.user?.email ||
                              isLoading
                            }
                            className="px-6 rounded-2xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                          >
                            Update
                          </button>
                        )}
                      </div>
                      {!isEditingEmail && (
                        <p className="text-xs text-zinc-500 pl-1">
                          Changing your email will require re-authentication for
                          security.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 pl-1">
                        Password
                      </label>
                      <button
                        onClick={() => navigate("/reset-password")}
                        className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 text-sm font-medium text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 transition-all group"
                      >
                        <span>Reset Password</span>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200 transition-colors">
                          <Lock className="w-4 h-4" />
                        </div>
                      </button>
                    </div>

                    <div className="pt-8 border-t border-zinc-800/50">
                      <h5 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Danger Zone
                      </h5>
                      <div className="space-y-4">
                        <button
                          onClick={handleDeleteAllTasks}
                          className="w-full text-left px-5 py-4 rounded-[24px] border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <span className="block text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">
                              Delete All Tasks
                            </span>
                            <span className="block text-xs text-red-500/40 mt-0.5 group-hover:text-red-400/60 transition-colors">
                              Permanently remove all tasks from your board
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-colors">
                            <X className="w-4 h-4" />
                          </div>
                        </button>

                        <button
                          onClick={initiateDeleteAccount}
                          className="w-full text-left px-5 py-4 rounded-[24px] border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <span className="block text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">
                              Delete Account
                            </span>
                            <span className="block text-xs text-red-500/40 mt-0.5 group-hover:text-red-400/60 transition-colors">
                              Permanently delete your account and all data
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/30 transition-colors">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
