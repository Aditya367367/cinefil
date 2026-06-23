import { useState } from "react";
import { LogIn, Lock, Mail, ShieldCheck } from "lucide-react";
import type { Page } from "./Navbar";
import { SectionHeader } from "./SectionHeader";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        showSnackbar("Login successful!", "success");
        onNavigate("member-dashboard");
      } else {
        showSnackbar(res.error || "Invalid email or password.", "error");
      }
    } catch (e) {
      showSnackbar("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] py-16" style={{ fontFamily: "var(--font-body)", background: "radial-gradient(circle at top left, rgba(252, 211, 77, 0.13), transparent 22%), radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.12), transparent 26%), #0c1f38" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-white">
            <SectionHeader
              title="Welcome Back"
              subtitle="Login to manage your CINEFIL membership application and access your account."
              centered={false}
            />
            <div className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <div className="rounded-2xl bg-white/10 p-3">
                  <ShieldCheck size={20} />
                </div>
                <p>Secure login with encrypted credentials. After login, you can apply for membership via the Membership Form page.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Why login?</p>
                  <p className="mt-3 text-sm text-slate-100 leading-relaxed">
                    Manage your profile, access financial reports, and submit membership applications after sign in.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">After login</p>
                  <p className="mt-3 text-sm text-slate-100 leading-relaxed">
                    Visit the Membership Form page to apply for CINEFIL membership once you are signed in.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
              <div className="mb-5 rounded-3xl bg-slate-950/90 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Login instructions</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">
                  Enter your email and password, or sign in. Then click the membership form link to apply for membership.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm text-slate-200">
                  Email address
                  <div className="mt-2 flex items-center gap-2 rounded-3xl bg-slate-950/80 px-4 py-3 border border-white/10">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-slate-50 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </label>
                <label className="block text-sm text-slate-200">
                  Password
                  <div className="mt-2 flex items-center gap-2 rounded-3xl bg-slate-950/80 px-4 py-3 border border-white/10">
                    <Lock size={18} className="text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-slate-50 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
                >
                  <LogIn size={18} />
                  {isSubmitting ? "Logging in..." : "Login now"}
                </button>
              </form>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">or</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <button
                onClick={() => onNavigate("signup")}
                className="mt-4 inline-flex items-center justify-center gap-3 w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Create an account
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1d365e] via-[#0c1f38] to-[#071223] p-8 text-white shadow-2xl">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.35),_transparent_35%)]" />
            <div className="relative space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">
                  Secure access</div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome back to CINEFIL</h2>
                <p className="max-w-xl text-slate-300 leading-relaxed">
                  Sign in to keep your membership application moving, view account notices, and access member resources.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Fast access</p>
                  <p className="mt-3 text-base text-slate-100">Simple and secure email credentials.</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">After login</p>
                  <p className="mt-3 text-base text-slate-100">Go to Membership Form to apply for CINEFIL membership after you sign in.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/70 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Need help?</p>
                  <p className="mt-3 text-slate-200">Contact support if you cannot access your existing account.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Apply after login</p>
                  <p className="mt-3 text-slate-200">Once logged in, navigate to Membership Form from the menu and submit your details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
