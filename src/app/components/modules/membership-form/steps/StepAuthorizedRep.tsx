import React from "react";
import { ChevronRight, ChevronLeft, Upload, Check } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";

const formatMobileNumber = (val: string) => {
  let formatted = val.replace(/[^\d\s+]/g, "");
  formatted = formatted.replace(/(?!^\+)\+/g, "");
  return formatted;
};

const formatPanNumber = (val: string) => {
  return val.replace(/[^A-Za-z0-9]/g, "").toUpperCase().substring(0, 10);
};

const formatAadhaarNumber = (val: string) => {
  let digits = val.replace(/\D/g, "");
  let formatted = digits.match(/.{1,4}/g)?.join(" ") || "";
  return formatted.substring(0, 14);
};

export function StepAuthorizedRep() {
  const {
    repName, setRepName,
    repDesignation, setRepDesignation,
    repMobile, setRepMobile,
    repEmail, setRepEmail,
    repAadhar, setRepAadhar,
    repPan, setRepPan,
    repAuthorityLetter, setRepAuthorityLetter,
    existingRepAuthorityLetterUrl,
    documentErrors, setDocumentErrors,
    nextStep, prevStep,
  } = useMembershipForm();

  const handleAuthorityLetterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setDocumentErrors(prev => ({ ...prev, authorityLetter: 'File must be a PDF' }));
        setRepAuthorityLetter(null);
      } else if (file.size > 4 * 1024 * 1024) {
        setDocumentErrors(prev => ({ ...prev, authorityLetter: 'File must be within 4MB' }));
        setRepAuthorityLetter(null);
      } else {
        setDocumentErrors(prev => ({ ...prev, authorityLetter: '' }));
        setRepAuthorityLetter(file);
      }
    }
  };

  return (
    <div className="mf-step">
      <div className="mf-step__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 className="mf-step__title flex items-center gap-2">
            Authorized Representative
            <abbr title="Provide the name, designation, contact info, PAN/Aadhar, and authority letter for the representative authorized to act on behalf of the entity." style={{ cursor: "help", textDecoration: "none" }}>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
            </abbr>
          </h3>
          <p className="mf-step__subtitle">Details of the person authorized to act on behalf of the applicant.</p>
        </div>
        <button type="button" onClick={nextStep} className="mf-btn mf-btn--outline mf-btn--small" style={{ flexShrink: 0 }}>
          Skip this step
        </button>
      </div>

      <div className="mf-grid">
        <div>
          <label className="mf-label">Name</label>
          <input value={repName} onChange={(e) => setRepName(e.target.value)} className="mf-input" placeholder="Representative Name" />
        </div>
        <div>
          <label className="mf-label">Designation</label>
          <input value={repDesignation} onChange={(e) => setRepDesignation(e.target.value)} className="mf-input" placeholder="Designation" />
        </div>
        <div>
          <label className="mf-label">Mobile Number</label>
          <input value={repMobile} onChange={(e) => setRepMobile(formatMobileNumber(e.target.value))} className="mf-input" placeholder="+91 XXXXX XXXXX" />
        </div>
        <div>
          <label className="mf-label">Email Address</label>
          <input type="email" value={repEmail} onChange={(e) => setRepEmail(e.target.value)} className="mf-input" placeholder="Email Address" />
        </div>
        <div>
          <label className="mf-label">Aadhar Number <span className="mf-label__hint">(optional)</span></label>
          <input value={repAadhar} onChange={(e) => setRepAadhar(formatAadhaarNumber(e.target.value))} className="mf-input" placeholder="XXXX XXXX XXXX" />
        </div>
        <div>
          <label className="mf-label">PAN Number</label>
          <input value={repPan} onChange={(e) => setRepPan(formatPanNumber(e.target.value))} className="mf-input" placeholder="PAN Number" />
        </div>

        {/* File upload */}
        <div className="mf-field--span">
          <label className="mf-label">Authority Letter / Board Resolution <span className="mf-label__hint">(PDF, max 4MB)</span></label>
          <input type="file" accept=".pdf" onChange={handleAuthorityLetterUpload} className="mf-hidden-input" id="authority-letter" />
          <label htmlFor="authority-letter" className={`mf-upload ${repAuthorityLetter || existingRepAuthorityLetterUrl ? "mf-upload--has-file" : ""}`}>
            {repAuthorityLetter ? (
              <>
                <Check size={18} style={{ color: "#059669" }} />
                <span className="mf-upload__filename">{repAuthorityLetter.name}</span>
              </>
            ) : existingRepAuthorityLetterUrl ? (
              <>
                <Check size={18} style={{ color: "#059669" }} />
                <span className="mf-upload__filename">Existing Document Uploaded</span>
                <a href={`http://localhost:8000${existingRepAuthorityLetterUrl.startsWith('/') ? '' : '/'}${existingRepAuthorityLetterUrl.replace('http://localhost:8000', '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                  View
                </a>
              </>
            ) : (
              <>
                <Upload size={20} className="mf-upload__icon" />
                <span className="mf-upload__text">Click to upload authority document</span>
                <span className="mf-upload__hint">PDF only, max 4MB</span>
              </>
            )}
          </label>
          {documentErrors.authorityLetter && <p className="mf-error">{documentErrors.authorityLetter}</p>}
        </div>
      </div>

      <div className="mf-actions">
        <button type="button" onClick={prevStep} className="mf-btn mf-btn--prev">
          <ChevronLeft size={16} /> Back
        </button>
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
