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

export function StepApplicantDetails() {
  const { showSnackbar } = useSnackbar();
  const {
    applicantName, setApplicantName,
    companyName, setCompanyName,
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
  const [panTakenError, setPanTakenError] = useState("");
  const [isCheckingPan, setIsCheckingPan] = useState(false);

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
        const errorMsg = getErrorString(res.error) || "Failed to send OTP.";
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
    if (!emailOtp || emailOtp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP.");
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
        setOtpError(getErrorString(res.error) || "Invalid OTP.");
      }
    } catch (err: any) {
      console.error("Error verifying email OTP:", err);
      setOtpError(getErrorString(err.response?.data?.error) || "Verification failed.");
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
        const errorMsg = getErrorString(res.error) || "Failed to send OTP.";
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
    if (!mobileOtp || mobileOtp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP.");
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
        setOtpError(getErrorString(res.error) || "Invalid OTP.");
      }
    } catch (err: any) {
      console.error("Error verifying mobile OTP:", err);
      setOtpError(getErrorString(err.response?.data?.error) || "Verification failed.");
    } finally {
      setVerifyingMobileOtp(false);
    }
  };

  const [errors, setErrors] = useState({
    applicantName: "",
    panNumberField: "",
    registeredAddress: "",
    city: "",
    stateField: "",
    country: "",
    pinCode: "",
  });

  const STATES = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ];

  React.useEffect(() => {
    if (!country) {
      setCountry("India");
    }
  }, [country, setCountry]);

  // Debounced check for PAN availability
  React.useEffect(() => {
    const formatted = panNumberField.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formatted)) {
      setPanTakenError("");
      return;
    }
    setIsCheckingPan(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await memberService.checkAvailability(undefined, undefined, formatted);
        if (res.success && res.pan_taken) {
          setPanTakenError("This PAN is already taken. Use a new PAN.");
        } else {
          setPanTakenError("");
        }
      } catch (err) {
        setPanTakenError("");
      } finally {
        setIsCheckingPan(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [panNumberField]);

  const validateField = (name: string, value: string) => {
    let errMsg = "";
    if (value.trim() === "") {
      errMsg = "This field is required.";
    } else {
      switch (name) {
        case "applicantName":
          if (value.trim().length < 2) {
            errMsg = "Name must be at least 2 characters.";
          }
          break;
        case "panNumberField":
          if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
            errMsg = "Invalid PAN format. Example: ABCDE1234F";
          }
          break;
        case "registeredAddress":
          if (!/^[A-Za-z0-9\s#,\-\/\.]{5,255}$/.test(value)) {
            errMsg = "Please provide a complete address.";
          }
          break;
        case "city":
          if (!/^[A-Za-z\s-]{2,100}$/.test(value)) {
            errMsg = "City name must contain only letters.";
          }
          break;
        case "stateField":
          if (value.trim() === "") {
            errMsg = "Please select a valid state.";
          }
          break;
        case "country":
          if (value.trim() === "") {
            errMsg = "Please select a valid country.";
          }
          break;
        case "pinCode":
          if (!/^[1-9][0-9]{5}$/.test(value)) {
            errMsg = "Pin Code must be a valid 6-digit number.";
          }
          break;
        default:
          break;
      }
    }
    setErrors(prev => ({ ...prev, [name]: errMsg }));
    return errMsg === "";
  };

  const handleContinue = () => {
    if (!isEmailVerified || !isMobileVerified) {
      showSnackbar("Please verify both email and mobile OTP before proceeding.", "error");
      return;
    }

    const isNameValid = validateField("applicantName", applicantName);
    const isPanValid = validateField("panNumberField", panNumberField);
    const isAddressValid = validateField("registeredAddress", registeredAddress);
    const isCityValid = validateField("city", city);
    const isStateValid = validateField("stateField", stateField);
    const isCountryValid = validateField("country", country);
    const isPinValid = validateField("pinCode", pinCode);

    if (panTakenError) {
      showSnackbar(panTakenError, "error");
      return;
    }

    if (isCheckingPan) {
      showSnackbar("Checking PAN availability...", "info");
      return;
    }

    if (isNameValid && isPanValid && isAddressValid && isCityValid && isStateValid && isCountryValid && isPinValid) {
      nextStep();
    } else {
      showSnackbar("Please correct the errors in your details before continuing.", "error");
    }
  };

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title flex items-center gap-2">
          Personal Information
          <abbr title="Enter your company name, registration number, PAN/GST number, registered/correspondence addresses, and contact details." style={{ cursor: "help", textDecoration: "none" }}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
          </abbr>
        </h3>
        <p className="mf-step__subtitle">Tell us about yourself and your company setup.</p>
      </div>

      <div className="mf-info-box" style={{ marginBottom: "16px", background: "rgba(59, 130, 246, 0.1)", borderLeft: "4px solid #3b82f6", padding: "12px", borderRadius: "4px", fontSize: "13px", lineHeight: "1.5", color: "#1e3a8a" }}>
        <strong>PAN Restriction Notice:</strong> One PAN - One Application - One Member. A distinct PAN shall constitute a distinct applicant for all purposes; each PAN of a Producer or Other Owner shall file one application covering all cinematograph films produced or owned by it, irrespective of the Banner(s).
      </div>

      {otpError && (
        <div className="mf-info-box mf-info-box--warning bg-[var(--cinefil-navy)] text-white" style={{ marginBottom: "16px", fontSize: "13px" }}>
          {otpError}
        </div>
      )}

      <div className="mf-grid">
        {/* Name */}
        <div className="mf-form-group">
          <label className="mf-label">Name of the Applicant <span className="mf-label__req">*</span></label>
          <input 
            value={applicantName} 
            onChange={(e) => {
              setApplicantName(e.target.value);
              validateField("applicantName", e.target.value);
            }} 
            onBlur={(e) => validateField("applicantName", e.target.value)}
            className={`mf-input ${errors.applicantName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="Full name or individual name" 
          />
          {errors.applicantName && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.applicantName}</p>
          )}
        </div>

        {/* Company Name */}
        <div className="mf-form-group">
          <label className="mf-label">Name of the Company / Firm / Banner <span className="mf-label__hint">(Optional)</span></label>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mf-input" placeholder="Company, firm or banner name" />
        </div>

        {/* Email with OTP */}
        <div className="mf-form-group">
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
              <input type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))} className="mf-input" placeholder="Enter 4-digit OTP" maxLength={4} style={{ flex: 1 }} />
              <button type="button" onClick={handleConfirmEmailOtp} disabled={verifyingEmailOtp} className="mf-btn mf-btn--confirm">
                {verifyingEmailOtp ? <Loader2 size={14} className="mf-spin" /> : "Confirm"}
              </button>
            </div>
          )}
        </div>

        {/* Mobile with OTP */}
        <div className="mf-form-group">
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
              <input type="text" value={mobileOtp} onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ''))} className="mf-input" placeholder="Enter 4-digit OTP" maxLength={4} style={{ flex: 1 }} />
              <button type="button" onClick={handleConfirmMobileOtp} disabled={verifyingMobileOtp} className="mf-btn mf-btn--confirm">
                {verifyingMobileOtp ? <Loader2 size={14} className="mf-spin" /> : "Confirm"}
              </button>
            </div>
          )}
        </div>

        {/* PAN */}
        <div className="mf-form-group">
          <label className="mf-label">PAN Number <span className="mf-label__req">*</span></label>
          <input 
            value={panNumberField} 
            onChange={(e) => {
              const formatted = formatPanNumber(e.target.value);
              setPanNumberField(formatted);
              validateField("panNumberField", formatted);
            }} 
            onBlur={(e) => validateField("panNumberField", e.target.value)}
            className={`mf-input ${errors.panNumberField || panTakenError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="PAN Number" 
          />
          {errors.panNumberField && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.panNumberField}</p>
          )}
          {panTakenError && (
            <p className="text-red-500 text-xs mt-1 font-medium">{panTakenError}</p>
          )}
        </div>

        {/* Addresses */}
        <div className="mf-field--span mf-form-group">
          <label className="mf-label">Address <span className="mf-label__req">*</span></label>
          <textarea 
            value={registeredAddress} 
            onChange={(e) => {
              setRegisteredAddress(e.target.value);
              validateField("registeredAddress", e.target.value);
            }} 
            onBlur={(e) => validateField("registeredAddress", e.target.value)}
            rows={2} 
            className={`mf-textarea ${errors.registeredAddress ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="Complete address" 
          />
          {errors.registeredAddress && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.registeredAddress}</p>
          )}
        </div>

        {/* Location */}
        <div className="mf-form-group">
          <label className="mf-label">City <span className="mf-label__req">*</span></label>
          <input 
            value={city} 
            onChange={(e) => {
              setCity(e.target.value);
              validateField("city", e.target.value);
            }} 
            onBlur={(e) => validateField("city", e.target.value)}
            className={`mf-input ${errors.city ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="City" 
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>
          )}
        </div>

        <div className="mf-form-group">
          <label className="mf-label">State <span className="mf-label__req">*</span></label>
          <select 
            value={stateField} 
            onChange={(e) => {
              setStateField(e.target.value);
              validateField("stateField", e.target.value);
            }} 
            onBlur={(e) => validateField("stateField", e.target.value)}
            className={`mf-input ${errors.stateField ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          >
            <option value="">Select State</option>
            {STATES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          {errors.stateField && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.stateField}</p>
          )}
        </div>

        <div className="mf-form-group">
          <label className="mf-label">Country <span className="mf-label__req">*</span></label>
          <select 
            value={country} 
            onChange={(e) => {
              setCountry(e.target.value);
              validateField("country", e.target.value);
            }} 
            onBlur={(e) => validateField("country", e.target.value)}
            className={`mf-input ${errors.country ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          >
            <option value="India">India</option>
            <option value="Other">Other</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.country}</p>
          )}
        </div>

        <div className="mf-form-group">
          <label className="mf-label">Pin Code <span className="mf-label__req">*</span></label>
          <input 
            value={pinCode} 
            onChange={(e) => {
              setPinCode(e.target.value);
              validateField("pinCode", e.target.value);
            }} 
            onBlur={(e) => validateField("pinCode", e.target.value)}
            className={`mf-input ${errors.pinCode ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="Pin Code" 
          />
          {errors.pinCode && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.pinCode}</p>
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
          <button type="button" onClick={handleContinue} className="mf-btn mf-btn--next">
            Continue <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
