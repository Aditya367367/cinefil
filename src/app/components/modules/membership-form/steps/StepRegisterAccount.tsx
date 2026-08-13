import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Check, Loader2, Mail, Phone, Lock, User as UserIcon } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { useAuth } from "../../../../../context/AuthContext";
import { memberService } from "../../../../../services/memberService";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

const getErrorString = (err: any): string => {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    if (err.message) return String(err.message);
    if (err.error) return getErrorString(err.error);
    const keys = Object.keys(err);
    if (keys.length > 0) {
      const firstVal = err[keys[0]];
      if (Array.isArray(firstVal)) return String(firstVal[0]);
      if (typeof firstVal === "object") return getErrorString(firstVal);
      return String(firstVal);
    }
  }
  return String(err);
};

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

function OtpInput({ value, onChange, length = 4, disabled = false }: OtpInputProps) {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (disabled) return;
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    
    const newValue = value.split("");
    newValue[idx] = val[val.length - 1];
    const updated = newValue.join("");
    onChange(updated);

    if (idx < length - 1 && inputsRef.current[idx + 1]) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (disabled) return;
    if (e.key === "Backspace") {
      if (!value[idx] && idx > 0 && inputsRef.current[idx - 1]) {
        inputsRef.current[idx - 1].focus();
        const newValue = value.split("");
        newValue[idx - 1] = "";
        onChange(newValue.join(""));
      } else {
        const newValue = value.split("");
        newValue[idx] = "";
        onChange(newValue.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted.length === length) {
      onChange(pasted);
      inputsRef.current[length - 1]?.focus();
    }
  };

  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  return (
    <div className="flex gap-2 justify-center my-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          ref={(el) => { if (el) inputsRef.current[idx] = el; }}
          value={digits[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-10 h-10 border border-slate-200 rounded-lg text-center font-bold text-base text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition disabled:opacity-50"
        />
      ))}
    </div>
  );
}


export function StepRegisterAccount() {
  const { showSnackbar } = useSnackbar();
  const { signup } = useAuth();
  const {
    applicantName, setApplicantName,
    applicantEmail, setApplicantEmail,
    mobileNumber, setMobileNumber,
    isEmailVerified, setIsEmailVerified,
    isMobileVerified, setIsMobileVerified,
    isAuthenticated,
    nextStep,
    skipStep,
  } = useMembershipForm();

  // Registration inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);
  const [isRegistered, setIsRegistered] = useState(isAuthenticated);

  // OTP Verification state
  const [emailOtpVisible, setEmailOtpVisible] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtpVisible, setMobileOtpVisible] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [sendingMobileOtp, setSendingMobileOtp] = useState(false);
  const [verifyingMobileOtp, setVerifyingMobileOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [signupError, setSignupError] = useState("");
  
  // Availability status
  const [emailTakenError, setEmailTakenError] = useState("");
  const [mobileTakenError, setMobileTakenError] = useState("");

  // OTP Expiration Timers (in seconds)
  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileTimer, setMobileTimer] = useState(0);

  // Email Timer countdown
  useEffect(() => {
    if (emailTimer <= 0) return;
    const interval = setInterval(() => {
      setEmailTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [emailTimer]);

  // Mobile Timer countdown
  useEffect(() => {
    if (mobileTimer <= 0) return;
    const interval = setInterval(() => {
      setMobileTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [mobileTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


  // Debounced check for email availability
  React.useEffect(() => {
    if (!applicantEmail || !applicantEmail.includes("@")) {
      setEmailTakenError("");
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await memberService.checkAvailability(applicantEmail, undefined);
        if (res.success && res.email_taken) {
          setEmailTakenError("This email address is already registered. Please login to continue.");
        } else {
          setEmailTakenError("");
        }
      } catch (err) {
        setEmailTakenError("");
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [applicantEmail]);

  // Debounced check for mobile availability
  React.useEffect(() => {
    const clean = mobileNumber.replace(/\D/g, "");
    if (clean.length < 10) {
      setMobileTakenError("");
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await memberService.checkAvailability(undefined, mobileNumber);
        if (res.success && res.mobile_taken) {
          setMobileTakenError("This mobile number is already registered. Please login to continue.");
        } else {
          setMobileTakenError("");
        }
      } catch (err) {
        setMobileTakenError("");
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [mobileNumber]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    if (!applicantName.trim()) {
      showSnackbar("Please enter your full name.", "error");
      return;
    }
    if (!applicantEmail.trim()) {
      showSnackbar("Please enter your email address.", "error");
      return;
    }
    if (emailTakenError) {
      showSnackbar(emailTakenError, "error");
      return;
    }
    if (!isEmailVerified) {
      showSnackbar("Please verify your email address.", "error");
      return;
    }
    if (!mobileNumber.trim()) {
      showSnackbar("Please enter your mobile number.", "error");
      return;
    }
    if (mobileTakenError) {
      showSnackbar(mobileTakenError, "error");
      return;
    }
    if (!isMobileVerified) {
      showSnackbar("Please verify your mobile number.", "error");
      return;
    }
    if (!password) {
      showSnackbar("Password is required.", "error");
      return;
    }
    if (password !== confirmPassword) {
      const matchErr = "Passwords do not match.";
      setSignupError(matchErr);
      showSnackbar(matchErr, "error");
      return;
    }

    setIsSubmittingSignup(true);
    try {
      const res = await signup({
        email: applicantEmail,
        password,
        confirm_password: confirmPassword,
        full_name: applicantName,
        mobile: mobileNumber
      });

      if (res.success) {
        setIsRegistered(true);
        showSnackbar("Account created and verified successfully!", "success");
      } else {
        let errorMsg = getErrorString(res.error) || "Failed to create account.";
        if (res.errors) {
          if (res.errors.email) {
            errorMsg = "This email address is already registered. Please login to continue.";
          } else if (res.errors.password) {
            errorMsg = Array.isArray(res.errors.password) 
              ? res.errors.password.join(" ") 
              : String(res.errors.password);
          } else if (typeof res.errors === "object") {
            const firstKey = Object.keys(res.errors)[0];
            const firstErr = res.errors[firstKey];
            errorMsg = Array.isArray(firstErr) ? firstErr[0] : String(firstErr);
          }
        }
        setSignupError(errorMsg);
        showSnackbar(errorMsg, "error");
      }
    } catch (err: any) {
      setSignupError("An unexpected error occurred during signup.");
      showSnackbar("An unexpected error occurred during signup.", "error");
    } finally {
      setIsSubmittingSignup(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!applicantEmail || emailTakenError) return;
    setSendingEmailOtp(true);
    setOtpError("");
    try {
      const res = await memberService.sendEmailOTP(applicantEmail);
      if (res.success) {
        setEmailOtpVisible(true);
        setEmailTimer(600); // 10 minutes countdown
        showSnackbar("OTP sent to your email address.", "success");
      } else {
        const errorMsg = getErrorString(res.error) || "Failed to send email OTP.";
        setOtpError(errorMsg);
        showSnackbar(errorMsg, "error");
      }
    } catch (err) {
      showSnackbar("Failed to send email OTP.", "error");
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (emailTimer <= 0) {
      setOtpError("Email OTP has expired. Please resend a new OTP.");
      return;
    }
    if (!emailOtp || emailOtp.length !== 4) {
      setOtpError("Please enter a valid 4-digit email OTP.");
      return;
    }
    setVerifyingEmailOtp(true);
    setOtpError("");
    try {
      const res = await memberService.verifyEmailOTP(applicantEmail, emailOtp);
      if (res.success) {
        setIsEmailVerified(true);
        setEmailOtpVisible(false);
        setEmailOtp("");
        showSnackbar("Email verified successfully!", "success");
      } else {
        const errorMsg = getErrorString(res.error) || "Invalid email OTP.";
        setOtpError(errorMsg);
        showSnackbar(errorMsg, "error");
      }
    } catch (err) {
      showSnackbar("Failed to verify email OTP.", "error");
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  const handleSendMobileOtp = async () => {
    const clean = mobileNumber.replace(/\D/g, "");
    if (clean.length !== 10) {
      showSnackbar("Please enter a valid 10-digit mobile number.", "error");
      return;
    }
    if (mobileTakenError) return;
    setSendingMobileOtp(true);
    setOtpError("");
    try {
      const res = await memberService.sendMobileOTP(mobileNumber);
      if (res.success) {
        setMobileOtpVisible(true);
        setMobileTimer(600); // 10 minutes countdown
        showSnackbar("OTP sent to your mobile number.", "success");
      } else {
        const errorMsg = getErrorString(res.error) || "Failed to send mobile OTP.";
        setOtpError(errorMsg);
        showSnackbar(errorMsg, "error");
      }
    } catch (err) {
      showSnackbar("Failed to send mobile OTP.", "error");
    } finally {
      setSendingMobileOtp(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (mobileTimer <= 0) {
      setOtpError("Mobile OTP has expired. Please resend a new OTP.");
      return;
    }
    if (!mobileOtp || mobileOtp.length !== 4) {
      setOtpError("Please enter a valid 4-digit mobile OTP.");
      return;
    }
    setVerifyingMobileOtp(true);
    setOtpError("");
    try {
      const res = await memberService.verifyMobileOTP(mobileNumber, mobileOtp);
      if (res.success) {
        setIsMobileVerified(true);
        setMobileOtpVisible(false);
        setMobileOtp("");
        showSnackbar("Mobile number verified successfully!", "success");
      } else {
        const errorMsg = getErrorString(res.error) || "Invalid mobile OTP.";
        setOtpError(errorMsg);
        showSnackbar(errorMsg, "error");
      }
    } catch (err) {
      showSnackbar("Failed to verify mobile OTP.", "error");
    } finally {
      setVerifyingMobileOtp(false);
    }
  };


  const allVerified = isRegistered && isEmailVerified && isMobileVerified;

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title flex items-center gap-2">
          Create Account & Verification
          <abbr title="Create a unique account with your name, email, phone, and password. You will receive an OTP on your email and phone to verify your details." style={{ cursor: "help", textDecoration: "none" }}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
          </abbr>
        </h3>
        <p className="mf-step__subtitle">Register an account and verify your contact details to begin the membership process.</p>
      </div>

      {!isRegistered ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="mf-form-group">
              <label className="mf-label">Full Name <span className="mf-label__req">*</span></label>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                <UserIcon size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm outline-none text-slate-700"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="mf-form-group">
              <label className="mf-label">Email Address <span className="mf-label__req">*</span></label>
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => {
                      setApplicantEmail(e.target.value);
                      setIsEmailVerified(false);
                      setEmailOtpVisible(false);
                    }}
                    disabled={isEmailVerified}
                    className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm outline-none text-slate-700 disabled:opacity-70"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={sendingEmailOtp || !applicantEmail || !applicantEmail.includes("@") || !!emailTakenError}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 disabled:opacity-50"
                  >
                    {sendingEmailOtp ? <Loader2 size={12} className="animate-spin" /> : null}
                    Verify
                  </button>
                )}
                {isEmailVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3.5 py-2.5 rounded-lg shrink-0">
                    <Check size={12} strokeWidth={3} /> Verified
                  </span>
                )}
              </div>
              {emailTakenError && (
                <p className="mt-1 text-xs text-red-500 font-semibold">{emailTakenError}</p>
              )}
              {emailOtpVisible && !isEmailVerified && (
                <div className="mt-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500">Enter Verification Code</p>
                    <OtpInput
                      value={emailOtp}
                      onChange={setEmailOtp}
                      disabled={emailTimer <= 0}
                    />
                    <div className="flex justify-between items-center mt-3 px-1">
                      {emailTimer > 0 ? (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          Expires in {formatTime(emailTimer)}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                          OTP Expired
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        disabled={sendingEmailOtp || emailTimer > 0}
                        className="text-xs font-bold text-[var(--cinefil-navy)] hover:text-amber-600 disabled:text-slate-400 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    disabled={verifyingEmailOtp || emailTimer <= 0 || emailOtp.length !== 4}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyingEmailOtp ? <Loader2 size={12} className="animate-spin" /> : null}
                    Verify Email
                  </button>
                </div>
              )}
            </div>

            <div className="mf-form-group">
              <label className="mf-label">Mobile Number <span className="mf-label__req">*</span></label>
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setMobileNumber(val);
                      setIsMobileVerified(false);
                      setMobileOtpVisible(false);
                    }}
                    disabled={isMobileVerified}
                    className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm outline-none text-slate-700 disabled:opacity-70"
                    placeholder="9876543210"
                    required
                  />
                </div>
                {!isMobileVerified && (
                  <button
                    type="button"
                    onClick={handleSendMobileOtp}
                    disabled={sendingMobileOtp || !mobileNumber || mobileNumber.length !== 10 || !!mobileTakenError}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 disabled:opacity-50"
                  >
                    {sendingMobileOtp ? <Loader2 size={12} className="animate-spin" /> : null}
                    Verify
                  </button>
                )}
                {isMobileVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3.5 py-2.5 rounded-lg shrink-0">
                    <Check size={12} strokeWidth={3} /> Verified
                  </span>
                )}
              </div>
              {mobileTakenError && (
                <p className="mt-1 text-xs text-red-500 font-semibold">{mobileTakenError}</p>
              )}
              {mobileOtpVisible && !isMobileVerified && (
                <div className="mt-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500">Enter Verification Code</p>
                    <OtpInput
                      value={mobileOtp}
                      onChange={setMobileOtp}
                      disabled={mobileTimer <= 0}
                    />
                    <div className="flex justify-between items-center mt-3 px-1">
                      {mobileTimer > 0 ? (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          Expires in {formatTime(mobileTimer)}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                          OTP Expired
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleSendMobileOtp}
                        disabled={sendingMobileOtp || mobileTimer > 0}
                        className="text-xs font-bold text-[var(--cinefil-navy)] hover:text-amber-600 disabled:text-slate-400 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyMobileOtp}
                    disabled={verifyingMobileOtp || mobileTimer <= 0 || mobileOtp.length !== 4}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyingMobileOtp ? <Loader2 size={12} className="animate-spin" /> : null}
                    Verify Mobile
                  </button>
                </div>
              )}
            </div>


            <div className="mf-form-group">
              <label className="mf-label">Password <span className="mf-label__req">*</span></label>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSignupError("");
                  }}
                  className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm outline-none text-slate-700"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="mt-2 p-3 bg-amber-50/50 border border-amber-200/50 rounded-lg text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-700">Password requirements:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>At least 8 characters long</li>
                  <li>Not commonly used (e.g., "password123")</li>
                  <li>Not entirely numeric digits</li>
                  <li>Not too similar to your email, name, or username</li>
                </ul>
              </div>
            </div>

            <div className="mf-form-group">
              <label className="mf-label">Confirm Password <span className="mf-label__req">*</span></label>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 focus-within:border-[var(--cinefil-navy)] focus-within:bg-white transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setSignupError("");
                  }}
                  className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm outline-none text-slate-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          {otpError && (
            <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 font-semibold rounded-lg">
              {otpError}
            </div>
          )}

          {signupError && (
            <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 font-semibold rounded-lg">
              {signupError}
            </div>
          )}

          <div className="mt-6 flex justify-between items-center gap-3">
            {/* DEV: Skip entire registration step */}
            <button
              type="button"
              onClick={() => {
                setIsEmailVerified(true);
                setIsMobileVerified(true);
                setIsRegistered(true);
                skipStep();
              }}
              title="[DEV] Skip registration — no account created"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '999px',
                border: '1px dashed #f59e0b',
                background: 'rgba(245,158,11,0.08)',
                color: '#f59e0b',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.18)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.08)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
                <line x1="19" y1="3" x2="19" y2="21"/>
              </svg>
              DEV: Skip
            </button>

            <button
              type="button"
              onClick={handleSignup}
              disabled={isSubmittingSignup || !isEmailVerified || !isMobileVerified}
              className="mf-btn mf-btn--next w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingSignup ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Creating Account...
                </>
              ) : (
                "Register Account"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 border border-green-500 bg-green-50 text-green-800 rounded-xl space-y-2 shadow-sm">
            <h4 className="font-extrabold text-sm uppercase flex items-center gap-1">
              <Check size={16} className="text-green-600" strokeWidth={3} /> Registration & Verification Successful!
            </h4>
            <p className="text-xs font-medium">Your account has been fully setup and verified. Please click the <strong>Next</strong> button below to select your membership category and fill in the application details.</p>
          </div>

          <div className="mf-actions" style={{ justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={nextStep}
              className="mf-btn mf-btn--next"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
