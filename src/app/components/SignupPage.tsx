import { useState } from "react";
import { ArrowRight, Lock, Mail, UserPlus } from "lucide-react";
import type { Page } from "./Navbar";
import { SectionHeader } from "./SectionHeader";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";

interface SignupPageProps {
  onNavigate: (page: Page) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      showSnackbar("Passwords do not match.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signup({
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
      });

      if (res.success) {
        showSnackbar("Account created successfully!", "success");
        onNavigate("home");
      } else {
        // Handle field-specific validation errors from backend
        if (res.errors) {
          const firstError = Object.values(res.errors)[0] as string[];
          showSnackbar(Array.isArray(firstError) ? firstError[0] : "Registration failed.", "error");
        } else {
          showSnackbar(res.error || "Registration failed.", "error");
        }
      }
    } catch (e) {
      showSnackbar("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] py-16" style={{ fontFamily: "var(--font-body)", background: "radial-gradient(circle at top left, rgba(236, 72, 153, 0.14), transparent 20%), radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.13), transparent 24%), #08131f" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-white">
            <SectionHeader
              title="Create your account"
              subtitle="Sign up to start your CINEFIL membership application and stay connected." 
              centered={false}
            />
            <div className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <div className="rounded-2xl bg-white/10 p-3">
                  <UserPlus size={20} />
                </div>
                <p>Sign up now to apply for CINEFIL membership and access member-only resources after login.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Start membership</p>
                  <p className="mt-3 text-sm text-slate-100 leading-relaxed">
                    Create your account and then complete the Membership Form to apply for membership.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Secure Access</p>
                  <p className="mt-3 text-sm text-slate-100 leading-relaxed">
                    Simple and direct login credentials secured using token-based architecture.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
              <div className="mb-5 rounded-3xl bg-slate-950/90 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Sign-up instructions</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">
                  Fill in your details below. After signing up, visit the Membership Form page to apply.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm text-slate-200">
                  Full name
                  <div className="mt-2 flex items-center gap-2 rounded-3xl bg-slate-950/80 px-4 py-3 border border-white/10">
                    <ArrowRight size={18} className="text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-transparent text-slate-50 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </label>
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
                      placeholder="Create a password"
                      className="w-full bg-transparent text-slate-50 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </label>
                <label className="block text-sm text-slate-200">
                  Confirm password
                  <div className="mt-2 flex items-center gap-2 rounded-3xl bg-slate-950/80 px-4 py-3 border border-white/10">
                    <Lock size={18} className="text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full bg-transparent text-slate-50 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-3xl bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-400 disabled:opacity-50"
                >
                  <UserPlus size={18} />
                  {isSubmitting ? "Signing up..." : "Sign up"}
                </button>
              </form>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">or</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <button
                onClick={() => onNavigate("login")}
                className="mt-4 inline-flex items-center justify-center gap-3 w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Already have an account? Login
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#321f49] via-[#091222] to-[#02070c] p-8 text-white shadow-2xl">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.3),_transparent_28%)]" />
            <div className="relative space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-pink-200">
                  New member</div>
                <h2 className="text-3xl font-bold tracking-tight">Join CINEFIL today</h2>
                <p className="max-w-xl text-slate-300 leading-relaxed">
                  Sign up and then head to the Membership Form page to submit your application and become a member.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Easy Signup</p>
                  <p className="mt-3 text-base text-slate-100">Quick sign up process with email verification.</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Membership next</p>
                  <p className="mt-3 text-base text-slate-100">After sign-up, go directly to the Membership Form to apply.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/70 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Account access</p>
                  <p className="mt-3 text-slate-200">Save your application status and member details after login.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Need support?</p>
                  <p className="mt-3 text-slate-200">Reach out for help if you get stuck during signup.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
