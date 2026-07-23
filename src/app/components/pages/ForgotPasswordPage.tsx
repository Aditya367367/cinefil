import { useState } from "react";
import { Mail, Lock, Shield, ArrowLeft, Key } from "lucide-react";
import type { Page } from "./Navbar";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useTranslation } from "../../contexts/LanguageContext";
import { authService } from "../../../services/authService";
import bgImage from "../../../imports/bg image.png";
import LogoImage from "../../../imports/Cinefil-New-Logo-Small-Header-150x150.png";

interface ForgotPasswordPageProps {
  onNavigate: (page: Page) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showSnackbar("Please enter a valid email address.", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await authService.forgotPassword({ email });
      if (res && res.success !== false) {
        showSnackbar(res.message || "Reset OTP sent successfully to your email address.", "success");
        setStep(2);
      } else {
        showSnackbar(res.error || "Failed to send reset OTP. Please check your email.", "error");
      }
    } catch (err: any) {
      console.error("Forgot password backend call error:", err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || "User with this email address does not exist.";
      showSnackbar(errMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      showSnackbar("All fields are required.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showSnackbar("Passwords do not match.", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await authService.resetPassword({ email, otp, password: newPassword });
      if (res && res.success !== false) {
        showSnackbar("Password reset successful! Please log in with your new password.", "success");
        onNavigate("login");
      } else {
        showSnackbar(res.error || "Failed to reset password. Please check the OTP.", "error");
      }
    } catch (err: any) {
      console.error("Reset password backend call error:", err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || "Failed to reset password. Please check the OTP.";
      showSnackbar(errMsg, "error");
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
            onClick={() => {
              if (step === 2) {
                setStep(1);
              } else {
                onNavigate("login");
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{step === 2 ? t("Back to Step 1") : t("Back to Sign In")}</span>
          </button>
        </div>

        {/* Main Form Box */}
        <div className="w-full max-w-[26rem] space-y-8 animate-fade-in">
          <div className="text-center lg:text-left space-y-2">
            <h1 
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
            >
              {step === 1 ? t("Forgot Password") : t("Reset Password")}
            </h1>
            <div className="h-[3px] w-24 mx-auto lg:mx-0 bg-[var(--cinefil-gold)]" />
            <p className="text-xs font-semibold text-slate-400 mt-2">
              {step === 1 
                ? t("Enter your email address and we'll send you an OTP code to verify and reset your password.")
                : t("Enter the verification OTP code and your new password to restore account access.")
              }
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("Registered Email")}
                </label>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-4 py-3 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("Enter your email ...") || t("Email")}
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
                <Key size={16} />
                <span>{isSubmitting ? t("Sending OTP...") : t("Send Reset OTP")}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("Verification OTP")}
                </label>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-4 py-3 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                  <Shield size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder={t("Enter verification OTP ...") || t("OTP")}
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
                    placeholder={t("Enter your new password ...") || t("New Password")}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
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
                    placeholder={t("Confirm your new password ...") || t("Confirm Password")}
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
                <span>{isSubmitting ? t("Resetting...") : t("Reset Password")}</span>
              </button>
            </form>
          )}
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
