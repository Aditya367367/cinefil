import { useState } from "react";
import { LogIn, Lock, Mail, Eye, EyeOff, Globe } from "lucide-react";
import type { Page } from "./Navbar";
import { useAuth } from "../../../context/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useTranslation } from "../../contexts/LanguageContext";
import bgImage from "../../../imports/bg image.png";
import LogoImage from "../../../imports/Cinefil-New-Logo-Small-Header-150x150.png";

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const { login, logout } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        const u = res.user;
        const isOfficer = !!(
          u?.is_membership_executive ||
          u?.is_rights_verification_officer ||
          u?.is_legal_officer ||
          u?.is_ceo_authorised_officer ||
          u?.is_membership_committee_member ||
          ['admin', 'membership_executive', 'rights_verification_officer', 'legal_officer', 'ceo', 'membership_committee'].includes(u?.role || '')
        );
        const isMember = !!(u?.is_member || u?.role === 'member' || u?.membership_status === 'approved' || u?.membership_status === 'associate_member');

        if (!isMember && !isOfficer) {
          showSnackbar("Login successful! Redirecting to continue your membership application.", "success");
          onNavigate("membership-form");
        } else {
          showSnackbar("Login successful!", "success");
          if (isOfficer) {
            onNavigate("officer-dashboard");
          } else {
            onNavigate("member-dashboard");
          }
        }
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white" style={{ fontFamily: "var(--font-body)" }}>

      {/* Left Column: Cinematic Illustration & Branding Overlay (5 cols) */}
      <div className="lg:col-span-5 relative overflow-hidden order-2 lg:order-1 h-80 lg:h-auto min-h-[350px] lg:min-h-screen">
        {/* Ambient lighting elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-amber-500/10 blur-3xl z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-blue-500/10 blur-3xl z-10" />

        {/* Clickable Big Logo overlay with modern glassmorphism card */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 bg-gradient-to-t from-slate-950 via-[#0a1e35]/90 to-[#0f2540]/80 backdrop-blur-[3px]">
          <button
            onClick={() => onNavigate("home")}
            className="flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-white/10 rounded-[4px] shadow-[0_24px_60px_rgba(0,0,0,0.5)] hover:scale-[1.01] transition-all duration-200 border border-white/10 group cursor-pointer max-w-xs text-center space-y-4"
          >
            <img
              src={LogoImage}
              alt="Cinefil Logo"
              className="w-24 h-24 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="space-y-1">
              <p className="text-[11px] text-slate-300 font-bold leading-normal">
                Professional Network of Cinema Owners & Film Producers
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-[10px] font-bold uppercase tracking-wider text-amber-300 rounded-[3px] border border-amber-500/30 group-hover:bg-amber-500/30 transition">
              Go to Home page
            </span>
          </button>
        </div>

        <img
          src={bgImage}
          alt="Cinefil Sign In illustration"
          className="w-full h-full object-cover relative z-0 animate-fade-in"
        />
      </div>

      {/* Right Column: Sign In Form (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-16 md:px-16 lg:px-24 bg-white relative order-1 lg:order-2 min-h-screen">

        {/* Main Form Box */}
        <div className="w-full max-w-[26rem] space-y-8">
          <div className="text-center lg:text-left space-y-2.5">
            <h1
              className="text-3xl md:text-4xl font-black tracking-tight text-[#0f2540]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("Welcome Back")}
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              Sign in to manage your repertoire, royalties, and membership console.
            </p>
            <div className="h-0.5 w-12 mx-auto lg:mx-0 bg-amber-500 rounded-[2px]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                {t("Email Address")}
              </label>
              <div className="flex items-center gap-2 rounded-[4px] bg-slate-50 border border-slate-200 px-4 py-3.5 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/20 focus-within:bg-white transition-all duration-200">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("Enter your email ...") || t("Email")}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                {t("Password")}
              </label>
              <div className="flex items-center gap-2 rounded-[4px] bg-slate-50 border border-slate-200 px-4 py-3.5 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/20 focus-within:bg-white transition-all duration-200">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("Enter your password ...") || t("Password")}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none transition shrink-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate("forgot-password")}
                className="text-xs font-bold text-slate-500 hover:text-amber-600 transition cursor-pointer"
              >
                {t("Forgot Password?")}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 text-sm font-bold text-white transition-all shadow-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 rounded-[4px] cursor-pointer"
              style={{ background: "linear-gradient(135deg, #0f2540 0%, #183858 100%)" }}
            >
              <LogIn size={16} />
              <span>{isSubmitting ? t("Submitting...") : t("Sign In")}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
          </div>

          {/* Join Link */}
          <div className="text-center text-xs font-semibold text-slate-500">
            <span>{t("Don't have an account?")} </span>
            <button
              onClick={() => onNavigate("membership-form")}
              className="font-bold text-[#0f2540] hover:text-amber-600 hover:underline transition cursor-pointer"
            >
              {t("Membership Application")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}