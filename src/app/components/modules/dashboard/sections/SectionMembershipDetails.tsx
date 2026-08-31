import React, { useEffect, useState } from "react";
import { User, Edit2, Check, X, FileText, Crown, AlertTriangle, Clock, Film, Sparkles, CheckCircle2 } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import { memberService } from "../../../../../services/memberService";
import { API_ROOT } from "../../../../../services/api";
import { useAuth } from "../../../../../context/AuthContext";
import { authService } from "../../../../../services/authService";

const EditableField = ({
  label,
  value,
  onSave,
  type = "text",
  readOnly = false,
  isDate = false
}: {
  label: string,
  value: any,
  onSave?: (val: any) => Promise<void>,
  type?: string,
  readOnly?: boolean,
  isDate?: boolean
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValue(value || "");
  }, [value]);

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (e) {
      // Error handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  const displayValue = isDate && value ? new Date(value).toLocaleDateString() : value;

  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 rounded-md border border-blue-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSaving}
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-emerald-500 p-1.5 text-white hover:bg-emerald-600 transition"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => { setIsEditing(false); setEditValue(value || ""); }}
            disabled={isSaving}
            className="rounded-md bg-gray-200 p-1.5 text-gray-700 hover:bg-gray-300 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <span className="text-sm font-medium text-gray-900 break-all">{displayValue || <span className="text-gray-400 italic">Not provided</span>}</span>
          {!readOnly && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 sm:text-gray-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-blue-700 transition p-1.5 rounded-lg bg-blue-50 sm:bg-transparent border border-blue-200/60 sm:border-0 shrink-0"
              title="Edit field"
            >
              <Edit2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

function OtpInput({ value, onChange, length = 4, disabled = false }: OtpInputProps) {
  const inputsRef = React.useRef<HTMLInputElement[]>([]);

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
          className="w-10 h-10 border border-gray-200 rounded-lg text-center font-bold text-base text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition disabled:opacity-50"
        />
      ))}
    </div>
  );
}

const EditableMobileField = ({
  label,
  value,
  onSave,
  readOnly = false
}: {
  label: string,
  value: string,
  onSave: (val: string) => Promise<void>,
  readOnly?: boolean
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newMobile, setNewMobile] = useState(value || "");
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(0);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    setNewMobile(value || "");
  }, [value]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendOtp = async () => {
    if (!newMobile || newMobile.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSendingOtp(true);
    setErrorMsg("");
    try {
      const res = await memberService.sendMobileOTP(newMobile);
      if (res.success) {
        setOtpVisible(true);
        setTimer(600); // 10 minutes expiry
        showSnackbar("OTP sent to your new mobile number.", "success");
      } else {
        setErrorMsg(res.error || "Failed to send OTP.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndSave = async () => {
    if (timer <= 0) {
      setErrorMsg("OTP has expired. Please send a new OTP.");
      return;
    }
    if (!otp || otp.length !== 4) {
      setErrorMsg("Please enter a valid 4-digit OTP.");
      return;
    }
    setIsVerifying(true);
    setErrorMsg("");
    try {
      const res = await memberService.verifyMobileOTP(newMobile, otp);
      if (res.success) {
        await onSave(newMobile);
        setIsEditing(false);
        setOtpVisible(false);
        setOtp("");
      } else {
        setErrorMsg(res.error || "Invalid OTP.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setOtpVisible(false);
    setOtp("");
    setNewMobile(value || "");
    setErrorMsg("");
    setTimer(0);
  };

  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>

      {isEditing ? (
        <div className="space-y-3 mt-1">
          <div className="flex items-center gap-2">
            <input
              type="tel"
              value={newMobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setNewMobile(val);
              }}
              placeholder="Enter 10-digit mobile number"
              className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isSendingOtp || isVerifying || otpVisible}
            />
            {!otpVisible ? (
              <button
                onClick={handleSendOtp}
                disabled={isSendingOtp || !newMobile || newMobile.length !== 10}
                className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-600 transition disabled:opacity-50"
              >
                {isSendingOtp ? "Sending..." : "Send OTP"}
              </button>
            ) : null}
            <button
              onClick={handleCancel}
              disabled={isSendingOtp || isVerifying}
              className="rounded-md bg-gray-200 p-1.5 text-gray-700 hover:bg-gray-300 transition"
            >
              <X size={16} />
            </button>
          </div>

          {otpVisible && (
            <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 space-y-2">
              <p className="text-xs font-semibold text-slate-500 text-center">Enter Verification Code</p>
              <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={timer <= 0}
              />
              <div className="flex justify-between items-center px-1">
                {timer > 0 ? (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    Expires in {formatTime(timer)}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    OTP Expired
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || timer > 0}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:text-slate-400 disabled:opacity-50 transition"
                >
                  Resend OTP
                </button>
              </div>
              <button
                onClick={handleVerifyAndSave}
                disabled={isVerifying || timer <= 0 || otp.length !== 4}
                className="w-full rounded-md bg-emerald-500 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify & Save"}
              </button>
            </div>
          )}

          {errorMsg && (
            <span className="text-xs text-red-500 font-semibold block">{errorMsg}</span>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <span className="text-sm font-medium text-gray-900 break-all">{value || <span className="text-gray-400 italic">Not provided</span>}</span>
          {!readOnly && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 sm:text-gray-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-blue-700 transition p-1.5 rounded-lg bg-blue-50 sm:bg-transparent border border-blue-200/60 sm:border-0 shrink-0"
              title="Edit field"
            >
              <Edit2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const DocumentLink = ({
  label,
  url,
  fieldKey,
  onUpload,
  readOnly = false
}: {
  label: string,
  url: string | null | undefined,
  fieldKey?: string,
  onUpload?: (field: string, file: File) => Promise<void>,
  readOnly?: boolean
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputId = `upload-${fieldKey}`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload || !fieldKey) return;
    setIsUploading(true);
    try {
      await onUpload(fieldKey, file);
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
      <div className="flex items-center gap-3">
        {url ? (
          <a
            href={url.startsWith('http') ? url : `${API_ROOT.replace('/api/v1', '')}${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            <FileText size={16} /> View Document
          </a>
        ) : (
          <span className="text-sm font-medium text-gray-400 italic">Not uploaded</span>
        )}

        {!readOnly && fieldKey && onUpload && (
          <div className="ml-auto">
            <input
              type="file"
              id={fileInputId}
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor={fileInputId}
              className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700 transition border border-gray-200"
            >
              {isUploading ? "Uploading..." : (url ? "Change" : "Upload")}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export function SectionMembershipDetails() {
  const {
    user,
    isMember,
    filmsList,
    changeSection,
    handleEditFilm,
    setIsViewOnly,
    isFilmComplete,
    fetchData
  } = useDashboard();
  const { refreshProfile } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestingPrime, setIsRequestingPrime] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!isMember) return;
      setIsLoading(true);
      try {
        const appsRes = await memberService.getApplications();
        if (appsRes.success && appsRes.applications) {
          // Find any active or approved application
          const activeApp = appsRes.applications.find((app: any) =>
            ['approved', 'associate_member', 'kyc_under_review', 'ownership_verification', 'legal_scrutiny', 'ceo_review', 'membership_committee_review'].includes(app.status)
          ) || appsRes.applications[0];

          if (activeApp) {
            // Fetch full details
            const detailRes = await memberService.getApplicationDetail(activeApp.id);
            if (detailRes.success) {
              setApplication(detailRes.application);
            }
          }
        }
      } catch (e) {
        console.error("Error fetching membership details", e);
        showSnackbar("Failed to load membership details", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [isMember]);

  const handleFieldSave = async (field: string, value: any) => {
    if (!application) return;
    try {
      const formData = new FormData();
      formData.append(field, value);

      const updatedApp = await memberService.updateApplication(application.id, formData);
      setApplication(updatedApp.application || updatedApp);
      showSnackbar("Updated successfully", "success");
    } catch (e: any) {
      showSnackbar(e.message || "Failed to update field", "error");
      throw e;
    }
  };

  const handleUsernameSave = async (value: string) => {
    try {
      const formData = new FormData();
      formData.append('username', value);
      const res = await authService.updateProfile(formData);
      if (res.success) {
        showSnackbar("Username updated successfully", "success");
        await refreshProfile();
      } else {
        const errors = res.errors;
        let errMsg = res.error || "Failed to update username";
        if (errors && errors.username) {
          errMsg = Array.isArray(errors.username) ? errors.username[0] : errors.username;
        }
        showSnackbar(errMsg, "error");
        throw new Error(errMsg);
      }
    } catch (e: any) {
      const errMsg = e.response?.data?.errors?.username?.[0] || e.response?.data?.error || e.message || "Failed to update username";
      showSnackbar(errMsg, "error");
      throw e;
    }
  };

  const handleDocumentUpload = async (field: string, file: File) => {
    if (!application) return;
    try {
      const formData = new FormData();
      formData.append(field, file);

      const updatedApp = await memberService.updateApplication(application.id, formData);
      setApplication(updatedApp.application || updatedApp);
      showSnackbar("Document uploaded successfully", "success");
    } catch (e: any) {
      showSnackbar(e.message || "Failed to upload document", "error");
      throw e;
    }
  };

  const handleRequestPrime = async () => {
    const incompleteFilm = filmsList.find(f => !isFilmComplete(f));
    if (incompleteFilm) {
      showSnackbar("Please complete all film details (including Censor Certificate & Censor Certificate Number) for your film first before upgrading to Prime.", "error");
      changeSection("films");
      setIsViewOnly(false);
      await handleEditFilm(incompleteFilm);
      return;
    }

    setIsRequestingPrime(true);
    try {
      const data = await memberService.upgradeToPrime();
      showSnackbar("Prime Membership upgrade request submitted successfully!", "success");
      await fetchData();

      // Reload application details
      const appsRes = await memberService.getApplications();
      if (appsRes.success && appsRes.applications) {
        const activeApp = appsRes.applications.find((app: any) =>
          ['approved', 'associate_member', 'kyc_under_review', 'ownership_verification', 'legal_scrutiny', 'ceo_review', 'membership_committee_review'].includes(app.status)
        ) || appsRes.applications[0];
        if (activeApp) {
          const detailRes = await memberService.getApplicationDetail(activeApp.id);
          if (detailRes.success) {
            setApplication(detailRes.application);
          }
        }
      }
    } catch (e: any) {
      showSnackbar(e.message || "Failed to request Prime Membership", "error");
    } finally {
      setIsRequestingPrime(false);
    }
  };

  if (!isMember) return null;

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Loading membership details...</div>;
  }

  if (!application) {
    return <div className="flex h-64 items-center justify-center text-gray-500">No approved membership application found.</div>;
  }

  const isIndividual = application?.applicant_types?.includes("individual");

  const requiredPrimeFields = [
    { key: "applicant_name", label: "Applicant Name" },
    { key: "mobile_number", label: "Mobile Number" },
    { key: "pan_number", label: "PAN Number" },
    { key: "registered_address", label: "Registered Address" },
    { key: "account_holder_name", label: "Account Holder Name" },
    { key: "bank_name", label: "Bank Name" },
    { key: "branch_name", label: "Branch Name" },
    { key: "account_number", label: "Account Number" },
    { key: "ifsc_code", label: "IFSC Code" }
  ];

  const requiredPrimeDocs = [
    { key: "pan_card", label: "PAN Card" },
    { key: "passport_photo", label: "Passport-Size Photograph" },
    ...(!isIndividual ? [
      { key: "board_resolution", label: "Authority Letter or Board Resolution" }
    ] : [])
  ];

  const incompleteFields = application
    ? requiredPrimeFields.filter(fld => !application[fld.key])
    : [];

  const incompleteDocs = application
    ? requiredPrimeDocs.filter(doc => !application[doc.key])
    : [];

  const incompleteFilms = filmsList.filter(f => !isFilmComplete(f));

  const isUnderReview = ['kyc_under_review', 'ownership_verification', 'legal_scrutiny', 'ceo_review', 'membership_committee_review'].includes(application?.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <User size={20} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Membership Profile
          </p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">Manage Your Details</h3>
        </div>
      </div>

      {/* Prime Membership Upgrade Status Panel */}
      {user?.is_member_prime || user?.is_prime || application?.status === 'approved' ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Crown size={22} className="text-emerald-700" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                Prime Member <span className="bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full">Active</span>
              </h4>
              <p className="mt-1 text-xs text-emerald-800 leading-relaxed font-medium">
                You are a verified Prime Member of CINEFIL India. You are entitled to quarterly distribution of royalties and administrative rights under the Copyright Rules, 2013.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-2xs space-y-4">
          <div>
            <h4 className="text-sm font-bold text-amber-900 flex items-center justify-between">
              <span>Prime Membership Guidelines & Verification Status</span>
              {isUnderReview && (
                <span className="bg-blue-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock size={12} className="text-white" /> In Progress
                </span>
              )}
            </h4>
            <div className="mt-2 text-xs text-amber-800 space-y-2 leading-relaxed">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                <span>Admission as a Prime Member is subject to CINEFIL internal review and compliance regulations:</span>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Admission as a Prime Member shall be an internal administrative process of CINEFIL, contingent upon the furnishing of the prescribed supporting documents — including, without limitation, Censor Certificates, Probates, Letters of Administration or other instruments evidencing devolution of title upon legal heirs — as and when required by CINEFIL, and shall at all times remain subject to statutory compliance under the Copyright Act, 1957 read with the Copyright Rules, 2013, as amended from time to time, and such other applicable laws, as the case may be; defects, if any, shall be auto-flagged for internal scrutiny by CINEFIL.</li>
                <li>Entitlement to the quarterly distribution of royalties, as provided under the Copyright Rules, 2013, shall accrue only upon admission as a Prime Member and upon due completion of the statutory compliance and verification process prescribed thereunder.</li>
                <li>A distinct PAN shall constitute a distinct applicant for all purposes; each PAN of a Producer or Other Owner shall file one application covering all cinematograph films produced or owned by it, irrespective of the Banner(s).</li>
              </ul>
            </div>
          </div>

          {isUnderReview ? (
            <div className="mt-2 text-xs bg-blue-100/80 border border-blue-200 text-blue-900 p-3 rounded-lg flex items-center gap-2">
              <Clock size={18} className="text-blue-600 shrink-0" />
              <p className="font-bold">
                Your Prime Membership request has been submitted and is currently in progress through officer review stages.
              </p>
            </div>
          ) : incompleteFilms.length > 0 ? (
            <div className="mt-2 text-xs text-amber-800 space-y-2">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                <span>To become a Prime Member, all registered films must be complete. The following films are currently incomplete:</span>
              </p>
              <ul className="list-disc pl-5 font-semibold space-y-2">
                {incompleteFilms.map(film => (
                  <li key={film.id} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5">
                      <Film size={14} className="text-blue-600 shrink-0" />
                      <span>{film.title || "Untitled Film"} (ID: #{film.id})</span>
                    </span>
                    <button
                      onClick={async () => {
                        changeSection("films");
                        setIsViewOnly(false);
                        await handleEditFilm(film);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline uppercase"
                    >
                      Complete Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (incompleteFields.length > 0 || incompleteDocs.length > 0) ? (
            <div className="mt-2 text-xs text-amber-800 space-y-2">
              <p className="font-semibold text-red-700 flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-red-600 shrink-0" />
                <span>To become a Prime Member, all required fields and KYC documents must be complete. Please fill/upload the following:</span>
              </p>

              {incompleteFields.length > 0 && (
                <div className="mt-2">
                  <p className="font-bold underline">Missing Fields (please edit/fill them in the sections below):</p>
                  <ul className="list-disc pl-5 font-semibold space-y-1 mt-1">
                    {incompleteFields.map(fld => <li key={fld.key}>{fld.label}</li>)}
                  </ul>
                </div>
              )}

              {incompleteDocs.length > 0 && (
                <div className="mt-2">
                  <p className="font-bold underline">Missing Documents (please upload them in the KYC Documents section below):</p>
                  <ul className="list-disc pl-5 font-semibold space-y-1 mt-1">
                    {incompleteDocs.map(doc => <li key={doc.key}>{doc.label}</li>)}
                  </ul>
                </div>
              )}

              <p className="text-[11px] text-amber-700 italic mt-2">Please complete these fields and documents, then you can proceed to Prime Membership.</p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <Sparkles size={16} className="text-emerald-600 shrink-0" />
                <span>All required fields, documents, and film details have been completed! You can now request Prime Membership upgrade.</span>
              </p>
              <button
                onClick={handleRequestPrime}
                disabled={isRequestingPrime}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition"
              >
                {isRequestingPrime ? "Submitting Request..." : "Request Prime Upgrade / Become Prime Member"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2 flex items-center justify-between">
            <span>Account Information</span>
            {isUnderReview && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Locked during review</span>
            )}
          </h4>
          <div className="space-y-4">
            <EditableField
              label="Username"
              value={user?.username}
              onSave={handleUsernameSave}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField label="Applicant Email" value={application.applicant_email} readOnly />
            <EditableField
              label="Applicant Name"
              value={application.applicant_name}
              onSave={(val) => handleFieldSave('applicant_name', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableMobileField
              label="Mobile Number"
              value={application.mobile_number}
              onSave={(val) => handleFieldSave('mobile_number', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField
              label="PAN Number"
              value={application.pan_number}
              onSave={(val) => handleFieldSave('pan_number', val)}
              readOnly={true}
            />
            {application.company_name && (
              <EditableField
                label="Company / Banner Name"
                value={application.company_name}
                onSave={(val) => handleFieldSave('company_name', val)}
                readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
              />
            )}
          </div>
        </div>

        {/* Bank Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2 flex items-center justify-between">
            <span>Bank Details</span>
            {isUnderReview && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Locked during review</span>
            )}
          </h4>
          <div className="space-y-4">
            <EditableField
              label="Account Holder Name"
              value={application.account_holder_name}
              onSave={(val) => handleFieldSave('account_holder_name', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField
              label="Bank Name"
              value={application.bank_name}
              onSave={(val) => handleFieldSave('bank_name', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField
              label="Branch Name"
              value={application.branch_name}
              onSave={(val) => handleFieldSave('branch_name', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField
              label="Account Number"
              value={application.account_number}
              onSave={(val) => handleFieldSave('account_number', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField
              label="IFSC Code"
              value={application.ifsc_code}
              onSave={(val) => handleFieldSave('ifsc_code', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
          </div>
        </div>

        {/* Address Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2 flex items-center justify-between">
            <span>Contact & Address</span>
            {isUnderReview && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Locked during review</span>
            )}
          </h4>
          <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
            <EditableField
              label="Registered Address"
              value={application.registered_address}
              onSave={(val) => handleFieldSave('registered_address', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField
              label="City"
              value={application.city}
              onSave={(val) => handleFieldSave('city', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField
              label="State"
              value={application.state}
              onSave={(val) => handleFieldSave('state', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField
              label="Country"
              value={application.country}
              onSave={(val) => handleFieldSave('country', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
            <EditableField
              label="Pin Code"
              value={application.pin_code}
              onSave={(val) => handleFieldSave('pin_code', val)}
              readOnly={user?.is_member_prime || user?.is_prime || isUnderReview}
            />
          </div>
        </div>

        {/* KYC Documents */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2">KYC & Title Documents</h4>
          <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <DocumentLink label="PAN Card" url={application.pan_card} fieldKey="pan_card" onUpload={handleDocumentUpload} readOnly={user?.is_member_prime || user?.is_prime || isUnderReview} />
            <DocumentLink label="Aadhaar Card" url={application.aadhar_card} fieldKey="aadhar_card" onUpload={handleDocumentUpload} readOnly={user?.is_member_prime || user?.is_prime || isUnderReview} />
            <DocumentLink label="Passport-Size Photograph" url={application.passport_photo} fieldKey="passport_photo" onUpload={handleDocumentUpload} readOnly={user?.is_member_prime || user?.is_prime || isUnderReview} />
            <DocumentLink label="Probate (Optional)" url={application.probate} fieldKey="probate" onUpload={handleDocumentUpload} readOnly={user?.is_member_prime || user?.is_prime || isUnderReview} />
            <DocumentLink label="Letter of Administration (Optional)" url={application.letter_of_administration} fieldKey="letter_of_administration" onUpload={handleDocumentUpload} readOnly={user?.is_member_prime || user?.is_prime || isUnderReview} />
            <DocumentLink label="Devolution of Title (Optional)" url={application.devolution_of_title} fieldKey="devolution_of_title" onUpload={handleDocumentUpload} readOnly={user?.is_member_prime || user?.is_prime || isUnderReview} />

            {!isIndividual && (
              <DocumentLink label="Authority Letter or Board Resolution" url={application.board_resolution} fieldKey="board_resolution" onUpload={handleDocumentUpload} readOnly={user?.is_member_prime || user?.is_prime || isUnderReview} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
