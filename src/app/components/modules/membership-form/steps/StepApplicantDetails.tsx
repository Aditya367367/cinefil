import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { memberService } from "../../../../../services/memberService";
import { SkipTestingButton } from "../components/SkipTestingButton";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

const formatMobileNumber = (val: string) => {
  let formatted = val.replace(/[^\d\s+]/g, "");
  formatted = formatted.replace(/(?!^\+)\+/g, "");
  return formatted;
};

const formatPanNumber = (val: string) => {
  return val.replace(/[^A-Za-z0-9]/g, "").toUpperCase().substring(0, 10);
};

const formatGstNumber = (val: string) => {
  return val.replace(/[^A-Za-z0-9]/g, "").toUpperCase().substring(0, 15);
};

export function StepApplicantDetails() {
  const { showSnackbar } = useSnackbar();
  const {
    applicantName, setApplicantName,
    applicantEmail, setApplicantEmail,
    cinLlp, setCinLlp,
    gstNumber, setGstNumber,
    panNumberField, setPanNumberField,
    dobIncorporation, setDobIncorporation,
    registeredAddress, setRegisteredAddress,
    correspondenceAddress, setCorrespondenceAddress,
    city, setCity,
    stateField, setStateField,
    country, setCountry,
    pinCode, setPinCode,
    website, setWebsite,
    telephoneNumber, setTelephoneNumber,
    mobileNumber, setMobileNumber,
    isEmailVerified, setIsEmailVerified,
    isMobileVerified, setIsMobileVerified,
    isAuthenticated,
    nextStep, prevStep,
    loadDraftApplication
  } = useMembershipForm();

  const [emailOtpVisible, setEmailOtpVisible] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtpVisible, setMobileOtpVisible] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [sendingMobileOtp, setSendingMobileOtp] = useState(false);
  const [verifyingMobileOtp, setVerifyingMobileOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  const handleVerifyEmail = async () => {
    if (!applicantEmail) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicantEmail)) {
      setOtpError("Please enter a valid email address.");
      return;
    }
    setSendingEmailOtp(true);
    setOtpError("");
    try {
      const res = await memberService.sendEmailOTP(applicantEmail);
      if (res.success) {
        setEmailOtpVisible(true);
        setOtpError("");
      } else {
        const errorMsg = res.error || "Failed to send OTP.";
        setOtpError(errorMsg);
        showSnackbar(errorMsg, "error");
        setEmailOtpVisible(false);
      }
    } catch (err: any) {
      console.error("Error sending email OTP:", err);
      // Fallback for unexpected errors
      showSnackbar("An unexpected error occurred.", "error");
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleConfirmEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
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
        if (res.draft_application) {
            loadDraftApplication(res.draft_application);
            showSnackbar("Draft application resumed successfully!", "success");
        }
      } else {
        setOtpError(res.error || "Invalid OTP.");
      }
    } catch (err: any) {
      console.error("Error verifying email OTP:", err);
      setOtpError(err.response?.data?.error || "Verification failed.");
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  const handleVerifyMobile = async () => {
    if (!mobileNumber) return;
    setSendingMobileOtp(true);
    setOtpError("");
    try {
      const res = await memberService.sendMobileOTP(mobileNumber);
      if (res.success) {
        setMobileOtpVisible(true);
        setOtpError("");
      } else {
        const errorMsg = res.error || "Failed to send OTP.";
        setOtpError(errorMsg);
        showSnackbar(errorMsg, "error");
        setMobileOtpVisible(false);
      }
    } catch (err: any) {
      console.error("Error sending mobile OTP:", err);
      // Fallback for unexpected errors
      showSnackbar("An unexpected error occurred.", "error");
    } finally {
      setSendingMobileOtp(false);
    }
  };

  const handleConfirmMobileOtp = async () => {
    if (!mobileOtp || mobileOtp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
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
        if (res.draft_application) {
            loadDraftApplication(res.draft_application);
            showSnackbar("Draft application resumed successfully!", "success");
        }
      } else {
        setOtpError(res.error || "Invalid OTP.");
      }
    } catch (err: any) {
      console.error("Error verifying mobile OTP:", err);
      setOtpError(err.response?.data?.error || "Verification failed.");
    } finally {
      setVerifyingMobileOtp(false);
    }
  };

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title">Personal Information</h3>
        <p className="mf-step__subtitle">Tell us about yourself and your company setup.</p>
      </div>

      {otpError && (
        <div className="mf-info-box mf-info-box--warning bg-[var(--cinefil-navy)] text-white" style={{ marginBottom: "16px", fontSize: "13px" }}>
          {otpError}
        </div>
      )}

      <div className="mf-grid">
        {/* Name */}
        <div>
          <label className="mf-label">Name of the Applicant / Entity <span className="mf-label__req">*</span></label>
          <input value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="mf-input" placeholder="Full name or company name" />
        </div>

        {/* Email with OTP */}
        <div>
          <label className="mf-label">Email Address <span className="mf-label__req">*</span></label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="email"
              value={applicantEmail}
              onChange={(e) => { setApplicantEmail(e.target.value); setIsEmailVerified(false); setEmailOtpVisible(false); }}
              disabled={isEmailVerified}
              className={`mf-input ${isEmailVerified ? "mf-input--verified" : ""}`}
              placeholder="email@example.com"
              style={{ flex: 1 }}
            />
            {!isEmailVerified && (
              <button type="button" onClick={handleVerifyEmail} disabled={sendingEmailOtp} className="mf-btn mf-btn--verify">
                {sendingEmailOtp ? <Loader2 size={14} className="mf-spin" /> : "Verify"}
              </button>
            )}
            {isEmailVerified && (
              <span className="mf-badge--verified"><Check size={12} /> Verified</span>
            )}
          </div>
          {emailOtpVisible && !isEmailVerified && (
            <div className="mf-otp-row">
              <input type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))} className="mf-input" placeholder="Enter 6-digit OTP" maxLength={6} style={{ flex: 1 }} />
              <button type="button" onClick={handleConfirmEmailOtp} disabled={verifyingEmailOtp} className="mf-btn mf-btn--confirm">
                {verifyingEmailOtp ? <Loader2 size={14} className="mf-spin" /> : "Confirm"}
              </button>
            </div>
          )}
        </div>

        {/* CIN */}
        <div>
          <label className="mf-label">CIN / LLPIN <span className="mf-label__hint">(if applicable)</span></label>
          <input value={cinLlp} onChange={(e) => setCinLlp(e.target.value)} className="mf-input" placeholder="CIN / LLPIN" />
        </div>

        {/* GST */}
        <div>
          <label className="mf-label">GST Number</label>
          <input value={gstNumber} onChange={(e) => setGstNumber(formatGstNumber(e.target.value))} className="mf-input" placeholder="GST Number" />
        </div>

        {/* PAN */}
        <div>
          <label className="mf-label">PAN Number</label>
          <input value={panNumberField} onChange={(e) => setPanNumberField(formatPanNumber(e.target.value))} className="mf-input" placeholder="PAN Number" />
        </div>

        {/* DOB */}
        <div>
          <label className="mf-label">Date of Incorporation / Birth</label>
          <input type="date" value={dobIncorporation} onChange={(e) => setDobIncorporation(e.target.value)} className="mf-input" />
        </div>

        {/* Addresses */}
        <div className="mf-field--span">
          <label className="mf-label">Registered Office Address</label>
          <textarea value={registeredAddress} onChange={(e) => setRegisteredAddress(e.target.value)} rows={2} className="mf-textarea" placeholder="Complete registered address" />
        </div>

        <div className="mf-field--span">
          <label className="mf-label">Correspondence Address</label>
          <textarea value={correspondenceAddress} onChange={(e) => setCorrespondenceAddress(e.target.value)} rows={2} className="mf-textarea" placeholder="Correspondence address (if different)" />
        </div>

        {/* Location */}
        <div>
          <label className="mf-label">City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="mf-input" placeholder="City" />
        </div>
        <div>
          <label className="mf-label">State</label>
          <input value={stateField} onChange={(e) => setStateField(e.target.value)} className="mf-input" placeholder="State" />
        </div>
        <div>
          <label className="mf-label">Country</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} className="mf-input" placeholder="Country" />
        </div>
        <div>
          <label className="mf-label">Pin Code</label>
          <input value={pinCode} onChange={(e) => setPinCode(e.target.value)} className="mf-input" placeholder="Pin Code" />
        </div>

        {/* Contact */}
        <div>
          <label className="mf-label">Website <span className="mf-label__hint">(optional)</span></label>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className="mf-input" placeholder="https://example.com" />
        </div>
        <div>
          <label className="mf-label">Telephone <span className="mf-label__hint">(optional)</span></label>
          <input value={telephoneNumber} onChange={(e) => setTelephoneNumber(e.target.value)} className="mf-input" placeholder="Telephone Number" />
        </div>

        {/* Mobile with OTP */}
        <div>
          <label className="mf-label">Mobile Number <span className="mf-label__req">*</span></label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={mobileNumber}
              onChange={(e) => { setMobileNumber(formatMobileNumber(e.target.value)); setIsMobileVerified(false); setMobileOtpVisible(false); }}
              disabled={isMobileVerified}
              className={`mf-input ${isMobileVerified ? "mf-input--verified" : ""}`}
              placeholder="+91 XXXXX XXXXX"
              style={{ flex: 1 }}
            />
            {!isMobileVerified && (
              <button type="button" onClick={handleVerifyMobile} disabled={sendingMobileOtp} className="mf-btn mf-btn--verify">
                {sendingMobileOtp ? <Loader2 size={14} className="mf-spin" /> : "Verify"}
              </button>
            )}
            {isMobileVerified && (
              <span className="mf-badge--verified"><Check size={12} /> Verified</span>
            )}
          </div>
          {mobileOtpVisible && !isMobileVerified && (
            <div className="mf-otp-row">
              <input type="text" value={mobileOtp} onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ''))} className="mf-input" placeholder="Enter 6-digit OTP" maxLength={6} style={{ flex: 1 }} />
              <button type="button" onClick={handleConfirmMobileOtp} disabled={verifyingMobileOtp} className="mf-btn mf-btn--confirm">
                {verifyingMobileOtp ? <Loader2 size={14} className="mf-spin" /> : "Confirm"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mf-actions">
        {!isAuthenticated ? (
          <button type="button" onClick={prevStep} className="mf-btn mf-btn--prev">
            <ChevronLeft size={16} /> Back
          </button>
        ) : <div />}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <SkipTestingButton />
          <button type="button" onClick={nextStep} className="mf-btn mf-btn--next">
            Continue <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
