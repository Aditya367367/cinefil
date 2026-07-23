import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

export function StepBankDetails() {
  const {
    accountHolderName, setAccountHolderName,
    bankName, setBankName,
    branchName, setBranchName,
    accountNumber, setAccountNumber,
    ifscCode, setIfscCode,
    nextStep, prevStep,
  } = useMembershipForm();

  const { showSnackbar } = useSnackbar();

  const [errors, setErrors] = useState({
    accountHolderName: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    ifscCode: ""
  });

  const validateField = (name: string, value: string) => {
    let errMsg = "";
    if (value.trim() === "") {
      errMsg = "This field is required.";
    } else {
      switch (name) {
        case "accountHolderName":
          if (!/^[A-Za-z\s'-]{2,100}$/.test(value)) {
            errMsg = "Please enter a valid name (letters only).";
          }
          break;
        case "bankName":
          if (!/^[A-Za-z\s&-]{2,100}$/.test(value)) {
            errMsg = "Please enter a valid bank name.";
          }
          break;
        case "branchName":
          if (!/^[A-Za-z0-9\s,-]{2,100}$/.test(value)) {
            errMsg = "Please enter a valid branch name.";
          }
          break;
        case "accountNumber":
          if (!/^[0-9]{9,18}$/.test(value)) {
            errMsg = "Account number must be 9 to 18 digits.";
          }
          break;
        case "ifscCode":
          if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(value)) {
            errMsg = "Invalid IFSC format. Example: SBIN0001234";
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
    const isHolderValid = validateField("accountHolderName", accountHolderName);
    const isBankValid = validateField("bankName", bankName);
    const isBranchValid = validateField("branchName", branchName);
    const isNumValid = validateField("accountNumber", accountNumber);
    const isIfscValid = validateField("ifscCode", ifscCode);

    if (isHolderValid && isBankValid && isBranchValid && isNumValid && isIfscValid) {
      nextStep();
    } else {
      showSnackbar("Please correct the errors in the bank details before continuing.", "error");
    }
  };

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title flex items-center gap-2">
          Bank Details for Royalty Distribution
          <abbr title="Provide your bank account name, number, bank and branch name, and IFSC code." style={{ cursor: "help", textDecoration: "none" }}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
          </abbr>
        </h3>
        <p className="mf-step__subtitle">Provide bank account details where royalty payouts will be processed.</p>
      </div>

      <div className="mf-grid">
        <div className="mf-form-group">
          <label className="mf-label">Account Holder Name <span className="mf-label__req">*</span></label>
          <input 
            value={accountHolderName} 
            onChange={(e) => {
              setAccountHolderName(e.target.value);
              validateField("accountHolderName", e.target.value);
            }} 
            onBlur={(e) => validateField("accountHolderName", e.target.value)}
            className={`mf-input ${errors.accountHolderName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="Account Holder Name" 
          />
          {errors.accountHolderName && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.accountHolderName}</p>
          )}
        </div>

        <div className="mf-form-group">
          <label className="mf-label">Bank Name <span className="mf-label__req">*</span></label>
          <input 
            value={bankName} 
            onChange={(e) => {
              setBankName(e.target.value);
              validateField("bankName", e.target.value);
            }} 
            onBlur={(e) => validateField("bankName", e.target.value)}
            className={`mf-input ${errors.bankName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="Bank Name" 
          />
          {errors.bankName && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.bankName}</p>
          )}
        </div>

        <div className="mf-form-group">
          <label className="mf-label">Branch <span className="mf-label__req">*</span></label>
          <input 
            value={branchName} 
            onChange={(e) => {
              setBranchName(e.target.value);
              validateField("branchName", e.target.value);
            }} 
            onBlur={(e) => validateField("branchName", e.target.value)}
            className={`mf-input ${errors.branchName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="Branch Name" 
          />
          {errors.branchName && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.branchName}</p>
          )}
        </div>

        <div className="mf-form-group">
          <label className="mf-label">Account Number <span className="mf-label__req">*</span></label>
          <input 
            value={accountNumber} 
            onChange={(e) => {
              setAccountNumber(e.target.value);
              validateField("accountNumber", e.target.value);
            }} 
            onBlur={(e) => validateField("accountNumber", e.target.value)}
            className={`mf-input ${errors.accountNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="Account Number" 
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.accountNumber}</p>
          )}
        </div>

        <div className="mf-form-group">
          <label className="mf-label">IFSC Code <span className="mf-label__req">*</span></label>
          <input 
            value={ifscCode} 
            onChange={(e) => {
              const upperVal = e.target.value.toUpperCase();
              setIfscCode(upperVal);
              validateField("ifscCode", upperVal);
            }} 
            onBlur={(e) => validateField("ifscCode", e.target.value.toUpperCase())}
            className={`mf-input ${errors.ifscCode ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} 
            placeholder="IFSC Code" 
          />
          {errors.ifscCode && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.ifscCode}</p>
          )}
        </div>
      </div>

      <div className="mf-actions" style={{ marginTop: "32px" }}>
        <button type="button" onClick={prevStep} className="mf-btn mf-btn--prev">
          <ChevronLeft size={16} /> Back
        </button>
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
