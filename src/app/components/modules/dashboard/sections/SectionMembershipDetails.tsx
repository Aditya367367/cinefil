import React, { useEffect, useState } from "react";
import { User, Edit2, Check, X, FileText } from "lucide-react";
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
              className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition p-1"
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

const EditableMobileField = ({ 
  label, 
  value, 
  onSave 
}: { 
  label: string, 
  value: string, 
  onSave: (val: string) => Promise<void> 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newMobile, setNewMobile] = useState(value || "");
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    setNewMobile(value || "");
  }, [value]);

  const handleSendOtp = async () => {
    if (!newMobile) return;
    setIsSendingOtp(true);
    setErrorMsg("");
    try {
      const res = await memberService.sendMobileOTP(newMobile);
      if (res.success) {
        setOtpVisible(true);
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
    if (!otp || otp.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit OTP.");
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
  };

  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
      
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMobile}
              onChange={(e) => {
                let val = e.target.value.replace(/[^\d\s+]/g, "");
                val = val.replace(/(?!^\+)\+/g, "");
                setNewMobile(val);
              }}
              placeholder="+91 XXXXX XXXXX"
              className="flex-1 rounded-md border border-blue-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSendingOtp || isVerifying || otpVisible}
            />
            {!otpVisible ? (
              <button 
                onClick={handleSendOtp} 
                disabled={isSendingOtp || !newMobile}
                className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600 transition"
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
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="flex-1 rounded-md border border-blue-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isVerifying}
              />
              <button 
                onClick={handleVerifyAndSave} 
                disabled={isVerifying || otp.length !== 6}
                className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition"
              >
                {isVerifying ? "Verifying..." : "Verify & Save"}
              </button>
            </div>
          )}

          {errorMsg && (
            <span className="text-xs text-red-500 font-semibold">{errorMsg}</span>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <span className="text-sm font-medium text-gray-900 break-all">{value || <span className="text-gray-400 italic">Not provided</span>}</span>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition p-1"
            title="Edit field"
          >
            <Edit2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

const DocumentLink = ({ label, url }: { label: string, url: string | null | undefined }) => {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
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
    </div>
  );
};

export function SectionMembershipDetails() {
  const { user, isMember } = useDashboard();
  const { refreshProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!isMember) return;
      setIsLoading(true);
      try {
        const appsRes = await memberService.getApplications();
        if (appsRes.success && appsRes.applications) {
          // Find the approved application
          const approvedApp = appsRes.applications.find((app: any) => app.status === 'approved');
          if (approvedApp) {
            // Fetch full details
            const detailRes = await memberService.getApplicationDetail(approvedApp.id);
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
      
      const res = await fetch(`${API_ROOT}/membership-applications/${application.id}/`, {
        method: "PATCH",
        credentials: "include",
        body: formData
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update field");
      }
      
      const updatedApp = await res.json();
      setApplication(updatedApp.application);
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

  if (!isMember) return null;

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Loading membership details...</div>;
  }

  if (!application) {
    return <div className="flex h-64 items-center justify-center text-gray-500">No approved membership application found.</div>;
  }

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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2">Account Information</h4>
          <div className="space-y-4">
            <EditableField 
              label="Username" 
              value={user?.username} 
              onSave={handleUsernameSave} 
            />
            <EditableField label="Applicant Email" value={application.applicant_email} readOnly />
            <EditableField 
              label="Applicant Name" 
              value={application.applicant_name} 
              onSave={(val) => handleFieldSave('applicant_name', val)} 
            />
            <EditableMobileField 
              label="Mobile Number" 
              value={application.mobile_number} 
              onSave={(val) => handleFieldSave('mobile_number', val)} 
            />
          </div>
        </div>

        {/* Company Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2">Company / Entity Details</h4>
          <div className="space-y-4">
            <EditableField 
              label="CIN / LLPIN" 
              value={application.cin_llpin} 
              onSave={(val) => handleFieldSave('cin_llpin', val)} 
            />
            <EditableField 
              label="GST Number" 
              value={application.gst_number} 
              onSave={(val) => handleFieldSave('gst_number', val)} 
            />
            <EditableField 
              label="PAN Number" 
              value={application.pan_number} 
              onSave={(val) => handleFieldSave('pan_number', val)} 
            />
            <EditableField 
              label="Date of Incorporation" 
              value={application.dob_incorporation} 
              type="date"
              isDate
              onSave={(val) => handleFieldSave('dob_incorporation', val)} 
            />
          </div>
        </div>

        {/* Address Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2">Contact & Address</h4>
          <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
            <EditableField 
              label="Registered Address" 
              value={application.registered_address} 
              onSave={(val) => handleFieldSave('registered_address', val)} 
            />
            <EditableField 
              label="Correspondence Address" 
              value={application.correspondence_address} 
              onSave={(val) => handleFieldSave('correspondence_address', val)} 
            />
            <EditableField 
              label="City" 
              value={application.city} 
              onSave={(val) => handleFieldSave('city', val)} 
            />
            <EditableField 
              label="State" 
              value={application.state} 
              onSave={(val) => handleFieldSave('state', val)} 
            />
            <EditableField 
              label="Country" 
              value={application.country} 
              onSave={(val) => handleFieldSave('country', val)} 
            />
            <EditableField 
              label="Pin Code" 
              value={application.pin_code} 
              onSave={(val) => handleFieldSave('pin_code', val)} 
            />
            <EditableField 
              label="Website" 
              value={application.website} 
              type="url"
              onSave={(val) => handleFieldSave('website', val)} 
            />
            <EditableField 
              label="Telephone Number" 
              value={application.telephone_number} 
              onSave={(val) => handleFieldSave('telephone_number', val)} 
            />
          </div>
        </div>

        {/* Representative Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2">Representative Details</h4>
          <div className="space-y-4">
            <EditableField 
              label="Representative Name" 
              value={application.rep_name} 
              onSave={(val) => handleFieldSave('rep_name', val)} 
            />
            <EditableField 
              label="Designation" 
              value={application.rep_designation} 
              onSave={(val) => handleFieldSave('rep_designation', val)} 
            />
            <EditableField 
              label="Mobile Number" 
              value={application.rep_mobile} 
              onSave={(val) => handleFieldSave('rep_mobile', val)} 
            />
            <EditableField 
              label="Email Address" 
              value={application.rep_email} 
              type="email"
              onSave={(val) => handleFieldSave('rep_email', val)} 
            />
            <EditableField 
              label="Aadhar Number" 
              value={application.rep_aadhar} 
              onSave={(val) => handleFieldSave('rep_aadhar', val)} 
            />
            <EditableField 
              label="PAN Number" 
              value={application.rep_pan} 
              onSave={(val) => handleFieldSave('rep_pan', val)} 
            />
          </div>
        </div>

        {/* Bank Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2">Bank Details</h4>
          <div className="space-y-4">
            <EditableField 
              label="Account Holder Name" 
              value={application.account_holder_name} 
              onSave={(val) => handleFieldSave('account_holder_name', val)} 
            />
            <EditableField 
              label="Bank Name" 
              value={application.bank_name} 
              onSave={(val) => handleFieldSave('bank_name', val)} 
            />
            <EditableField 
              label="Branch Name" 
              value={application.branch_name} 
              onSave={(val) => handleFieldSave('branch_name', val)} 
            />
            <EditableField 
              label="Account Number" 
              value={application.account_number} 
              onSave={(val) => handleFieldSave('account_number', val)} 
            />
            <EditableField 
              label="IFSC Code" 
              value={application.ifsc_code} 
              onSave={(val) => handleFieldSave('ifsc_code', val)} 
            />
            <EditableField 
              label="UPI ID" 
              value={application.upi_id} 
              onSave={(val) => handleFieldSave('upi_id', val)} 
            />
          </div>
        </div>

        {/* KYC Documents (Read Only) */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
          <h4 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2">KYC Documents</h4>
          <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <DocumentLink label="PAN Card" url={application.pan_card} />
            <DocumentLink label="Aadhar Card" url={application.aadhar_card} />
            <DocumentLink label="Address Proof" url={application.address_proof} />
            <DocumentLink label="Identity Proof" url={application.identity_proof} />
            <DocumentLink label="GST Certificate" url={application.gst_certificate} />
            <DocumentLink label="Certificate of Incorporation" url={application.certificate_of_incorporation} />
            <DocumentLink label="Canceled Check" url={application.canceled_check} />
            <DocumentLink label="Board Resolution" url={application.board_resolution} />
            <DocumentLink label="Representative Authority Letter" url={application.rep_authority_letter} />
          </div>
        </div>
      </div>
    </div>
  );
}
