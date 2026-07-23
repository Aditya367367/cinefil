import { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import type { Page } from "./Navbar";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useTranslation } from "../../contexts/LanguageContext";
import { authService } from "../../../services/authService";
import bgImage from "../../../imports/bg image.png";
import LogoImage from "../../../imports/Cinefil-New-Logo-Small-Header-150x150.png";

interface ChangePasswordPageProps {
  onNavigate: (page: Page) => void;
}

export function ChangePasswordPage({ onNavigate }: ChangePasswordPageProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showSnackbar("All fields are required.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showSnackbar("Passwords do not match.", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await authService.changePassword({
        old_password: currentPassword,
        current_password: currentPassword, // support multiple backend naming formats
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      });

      if (res && res.success !== false) {
        showSnackbar("Password updated successfully!", "success");
        onNavigate("profile");
      } else {
        showSnackbar(res.error || "Failed to update password. Please check your current password.", "error");
      }
    } catch (err: any) {
      console.error("Change password error:", err);
      // Detailed error fallback or success message
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "An error occurred while changing your password.";
      showSnackbar(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2 bg-white" style={{ fontFamily: "var(--font-body)" }}>
      
      {/* Right Column: Form Box */}
      <div className="flex flex-col justify-center items-center px-6 py-12 md:px-16 lg:px-24 bg-white relative order-1 lg:order-2">
        
        {/* Back Link */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
          <button
            onClick={() => onNavigate("profile")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t("Back to Profile")}</span>
          </button>
        </div>

        {/* Main Form Box */}
        <div className="w-full max-w-[26rem] space-y-8 animate-fade-in">
          <div className="text-center lg:text-left space-y-2">
            <h1 
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
            >
              {t("Change Password")}
            </h1>
            <div className="h-[3px] w-24 mx-auto lg:mx-0 bg-[var(--cinefil-gold)]" />
            <p className="text-xs font-semibold text-slate-400 mt-2">
              {t("Please enter your current password followed by your new password to update account security.")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("Current Password")}
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-4 py-3 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t("Enter current password ...") || t("Current Password")}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("New Password")}
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-4 py-3 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("Enter new password ...") || t("New Password")}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("Confirm New Password")}
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-4 py-3 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("Confirm new password ...") || t("Confirm Password")}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 text-sm font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 rounded-lg"
              style={{ backgroundColor: "var(--cinefil-navy)" }}
            >
              <Lock size={16} />
              <span>{isSubmitting ? t("Updating...") : t("Update Password")}</span>
            </button>
          </form>
        </div>

      </div>

      {/* Left Column: Vector Illustration */}
      <div className="block relative overflow-hidden order-2 lg:order-1 h-64 lg:h-auto min-h-[400px]">
        <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-indigo-50/60 z-0" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[25rem] h-[25rem] rounded-full bg-amber-50/40 z-0" />
        
        {/* Clickable Big Logo overlay linking to Home */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 bg-slate-900/30 backdrop-blur-[2px]">
          <button
            onClick={() => onNavigate("home")}
            className="flex flex-col items-center justify-center p-8 bg-white/95 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300 border border-white/20 group cursor-pointer"
          >
            <img
              src={LogoImage}
              alt="Cinefil Logo"
              className="w-32 h-32 object-contain transition-transform duration-300 group-hover:rotate-3"
            />
            <span className="mt-3 text-xs font-bold uppercase tracking-widest text-[var(--cinefil-navy)] group-hover:text-[var(--cinefil-gold)] transition-colors">
              Go to Home
            </span>
          </button>
        </div>

        <img
          src={bgImage}
          alt="Cinefil Sign In illustration"
          className="w-full h-full object-cover relative z-10 animate-fade-in"
        />
      </div>
    </div>
  );
}
