import { useState, useRef } from "react";
import { PageLayout } from "../layout/PageLayout";
import {
  Mail,
  Twitter,
  ArrowRight,
  Sparkles,
  Send,
  Loader2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

export const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "I have a question",
    message: "",
  });

  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase (Database Record)
      if (supabase) {
        const { error: dbError } = await supabase
          .from("contact_messages")
          .insert([
            {
              name: formData.name,
              email: formData.email,
              subject: formData.subject,
              message: formData.message,
              created_at: new Date().toISOString(),
            },
          ]);
        if (dbError) console.error("Database save error:", dbError);
      }

      // 2. Send Email via Custom Backend
      // This uses our local Express server which handles the email sending via Gmail SMTP
      // with a sophisticated HTML template.
      const response = await fetch("http://localhost:5001/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "I have a question",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        "Failed to send message. Please try again or email me directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <PageLayout>
      <div className="min-h-screen py-24 px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24">
            {/* Left Column: Context & Info */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-white/10 text-xs font-medium text-zinc-400 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Accepting new inquiries
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                  Talk to the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Maker
                  </span>
                </h1>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  KanFlow is a solo pursuit. When you reach out, you're speaking
                  directly to me, Uthman. No support tickets, no automated
                  replies. Just dev-to-dev.
                </p>
              </div>

              <div className="space-y-6">
                <a
                  href="mailto:uthmanajanaku@outlook.com"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all cursor-pointer shadow-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">Email</h3>
                    <p className="text-zinc-500 text-xs">
                      uthmanajanaku@outlook.com
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </a>

                <a
                  href="https://twitter.com/uthybuilds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all cursor-pointer shadow-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Twitter className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">
                      X (Twitter)
                    </h3>
                    <p className="text-zinc-500 text-xs">@uthybuilds</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-zinc-200">
                    Response Time
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  I usually reply within 24 hours. If it's a weekend, I might be
                  touching grass (or debugging), so give me until Monday.
                </p>
              </div>
            </div>

            {/* Right Column: Premium Form */}
            <div className="lg:col-span-3">
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group/form">
                {/* Form Header */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white">
                    Send a Message
                  </h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                </div>

                <form className="space-y-6" ref={form} onSubmit={handleSubmit}>
                  {/* Hidden Input for Subject (Topic) */}
                  <input
                    type="hidden"
                    name="subject"
                    value={formData.subject}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-400 ml-1">
                        NAME
                      </label>
                      <div
                        className={`relative rounded-xl bg-zinc-950/50 border transition-all duration-300 ${focusedField === "name" ? "border-blue-500/50 ring-2 ring-blue-500/10" : "border-white/5 hover:border-white/10"}`}
                      >
                        <input
                          type="text"
                          id="name"
                          name="from_name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-zinc-700 text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-400 ml-1">
                        EMAIL
                      </label>
                      <div
                        className={`relative rounded-xl bg-zinc-950/50 border transition-all duration-300 ${focusedField === "email" ? "border-blue-500/50 ring-2 ring-blue-500/10" : "border-white/5 hover:border-white/10"}`}
                      >
                        <input
                          type="email"
                          id="email"
                          name="from_email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-zinc-700 text-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 ml-1">
                      TOPIC
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["Question", "Bug", "Feature", "Other"].map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, subject: topic })
                          }
                          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                            formData.subject.includes(topic)
                              ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                              : "bg-zinc-950/30 border-white/5 text-zinc-500 hover:bg-zinc-900 hover:border-white/10"
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 ml-1">
                      MESSAGE
                    </label>
                    <div
                      className={`relative rounded-xl bg-zinc-950/50 border transition-all duration-300 ${focusedField === "message" ? "border-blue-500/50 ring-2 ring-blue-500/10" : "border-white/5 hover:border-white/10"}`}
                    >
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-zinc-700 text-sm resize-none"
                        placeholder="Tell me about your project..."
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group relative rounded-xl bg-blue-600 text-white px-4 py-3.5 text-sm font-bold hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Decorative Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
