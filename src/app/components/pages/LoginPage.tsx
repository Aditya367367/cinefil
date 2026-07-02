import { useState } from "react";
import { LogIn, Lock, Mail, Eye, EyeOff, Globe } from "lucide-react";
import type { Page } from "./Navbar";
import { useAuth } from "../../../context/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useTranslation } from "../../contexts/LanguageContext";
import bgImage from "../../../imports/bg image.png";

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
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        showSnackbar("Login successful!", "success");
        const u = res.user;
        if (
          u?.is_membership_executive ||
          u?.is_rights_verification_officer ||
          u?.is_legal_officer ||
          u?.is_ceo_authorised_officer ||
          u?.is_membership_committee_member ||
          ['admin', 'membership_executive', 'rights_verification_officer', 'legal_officer', 'ceo', 'membership_committee'].includes(u?.role || '')
        ) {
          onNavigate("officer-dashboard");
        } else if (u?.is_member || u?.role === 'member' || u?.membership_status === 'approved') {
          onNavigate("member-dashboard");
        } else {
          onNavigate("membership-form");
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
    <div className="min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2 bg-white" style={{ fontFamily: "var(--font-body)" }}>
      
      {/* Right Column: Sign In Form */}
      <div className="flex flex-col justify-center items-center px-6 py-12 md:px-16 lg:px-24 bg-white relative order-1 lg:order-2">
        
        {/* Top Right Decorative Language Selector */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
          {/* <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--cinefil-navy)] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-all shadow-xs"
          >
            <Globe size={14} />
            <span>{language === "EN" ? "EN" : "HI"}</span>
            <span className="text-[9px]">▼</span>
          </button> */}
          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-white border border-slate-100 shadow-lg py-1 text-xs z-30 rounded-lg">
              <button
                onClick={() => { setLanguage("EN"); setShowLangDropdown(false); }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                English (EN)
              </button>
              <button
                onClick={() => { setLanguage("HI"); setShowLangDropdown(false); }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                Hindi (HI)
              </button>
            </div>
          )}
        </div>

        {/* Main Form Box */}
        <div className="w-full max-w-[26rem] space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h1 
              className="text-4xl font-extrabold tracking-tight"
              style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
            >
              {t("Sign In")}
            </h1>
            <div className="h-[3px] w-24 mx-auto lg:mx-0 bg-[var(--cinefil-gold)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("Email")}
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-4 py-3 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("Enter your email ...") || t("Email")}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("Password")}
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-4 py-3 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("Enter your password ...") || t("Password")}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none transition shrink-0"
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
                className="text-xs font-bold hover:underline transition-colors"
                style={{ color: "var(--cinefil-navy)" }}
              >
                {t("Forgot Password !")}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 text-sm font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 rounded-lg"
              style={{ backgroundColor: "var(--cinefil-navy)" }}
            >
              <LogIn size={16} />
              <span>{isSubmitting ? t("Submitting...") : t("Sign In")}</span>
            </button>
          </form>

          {/* Spacer / Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            {/* <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">{t("or continue with")}</span>
            </div> */}
          </div>

          {/* Social Sign In Button */}
         

          {/* Join Link */}
          <div className="text-center text-xs font-semibold text-slate-500">
            <span>{t("Don't have an account?")} </span>
            <button
              onClick={() => onNavigate("membership-form")}
              className="font-bold hover:underline transition-colors"
              style={{ color: "var(--cinefil-navy)" }}
            >
              {t("Membership Form")}
            </button>
          </div>
        </div>

      </div>

      {/* Left Column: Vector Illustration */}
      <div className="block relative overflow-hidden order-2 lg:order-1 h-64 lg:h-auto">
        {/* Subtle geometric background shapes for a polished look */}
        <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-indigo-50/60 z-0" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[25rem] h-[25rem] rounded-full bg-amber-50/40 z-0" />
        
        <img
          src={bgImage}
          alt="Cinefil Sign In illustration"
          className="w-full h-full object-cover relative z-10 animate-fade-in"
        />
      </div>
    </div>
  );
}