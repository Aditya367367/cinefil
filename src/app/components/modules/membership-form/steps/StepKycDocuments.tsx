import React from "react";
import { ChevronRight, ChevronLeft, Upload, Check } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";

export function StepKycDocuments() {
  const {
    panCard, setPanCard,
    boardResolution, setBoardResolution,
    passportPhoto, setPassportPhoto,
    passportPhoto2, setPassportPhoto2,
    existingPanCardUrl, existingBoardResolutionUrl,
    existingPassportPhotoUrl, existingPassportPhoto2Url,
    applicantTypes,
    documentErrors, setDocumentErrors,
    validateDocument,
    nextStep, prevStep,
  } = useMembershipForm();

  const makeUploadHandler = (key: string, setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) { setDocumentErrors(prev => ({ ...prev, [key]: error })); setter(null); }
      else { setDocumentErrors(prev => ({ ...prev, [key]: '' })); setter(file); }
    }
  };

  const isIndividual = applicantTypes.includes("individual");

  const uploads = [
    { id: "pan-card", label: "PAN Card", required: true, file: panCard, existingUrl: existingPanCardUrl, handler: makeUploadHandler("panCard", setPanCard) },
    { id: "board-res", label: "Authority Letter or Board Resolution", hint: "Mandatory for entities", required: !isIndividual, file: boardResolution, existingUrl: existingBoardResolutionUrl, handler: makeUploadHandler("boardResolution", setBoardResolution) },
    { id: "passport-photo-1", label: "Passport-Size Photograph 1", required: true, file: passportPhoto, existingUrl: existingPassportPhotoUrl, handler: makeUploadHandler("passportPhoto", setPassportPhoto) },
    { id: "passport-photo-2", label: "Passport-Size Photograph 2", required: true, file: passportPhoto2, existingUrl: existingPassportPhoto2Url, handler: makeUploadHandler("passportPhoto2", setPassportPhoto2) },
  ];

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title flex items-center gap-2">
          KYC Documents
          <abbr title="Upload PAN Card, Board Resolution/Authority Letter (if entity), and two passport-size photographs." style={{ cursor: "help", textDecoration: "none" }}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
          </abbr>
        </h3>
        <p className="mf-step__subtitle">Upload your required KYC documents and photographs.</p>
      </div>

      <div className="mf-grid">
        {uploads.map((u) => (
          <div key={u.id}>
            <label className="mf-label">
              {u.label}
              {u.required && <span className="mf-label__req">*</span>}
              {u.hint && <span className="mf-label__hint">({u.hint})</span>}
            </label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={u.handler} className="mf-hidden-input" id={u.id} />
            <label htmlFor={u.id} className={`mf-upload ${u.file || u.existingUrl ? "mf-upload--has-file" : ""}`}>
              {u.file ? (
                <><Check size={18} style={{ color: "#059669" }} /><span className="mf-upload__filename">{u.file.name}</span></>
              ) : u.existingUrl ? (
                <>
                  <Check size={18} style={{ color: "#059669" }} />
                  <span className="mf-upload__filename">Existing Document Uploaded</span>
                  <a href={`http://localhost:8000${u.existingUrl.startsWith('/') ? '' : '/'}${u.existingUrl.replace('http://localhost:8000', '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                    View
                  </a>
                </>
              ) : (
                <><Upload size={20} className="mf-upload__icon" /><span className="mf-upload__text">Upload {u.label.toLowerCase()}</span><span className="mf-upload__hint">PDF or JPG, max 4MB</span></>
              )}
            </label>
            {(documentErrors as any)[u.id.replace(/-/g, '')] && <p className="mf-error">{(documentErrors as any)[u.id.replace(/-/g, '')]}</p>}
          </div>
        ))}
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
