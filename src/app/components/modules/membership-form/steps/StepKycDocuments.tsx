import React from "react";
import { ChevronRight, ChevronLeft, Upload, Check } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";

export function StepKycDocuments() {
  const {
    panCard, setPanCard,
    certificateOfIncorporation, setCertificateOfIncorporation,
    identityProof, setIdentityProof,
    addressProof, setAddressProof,
    boardResolution, setBoardResolution,
    existingPanCardUrl, existingCertificateOfIncorporationUrl,
    existingIdentityProofUrl, existingAddressProofUrl, existingBoardResolutionUrl,
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

  const uploads = [
    { id: "pan-card", label: "PAN Card", required: true, file: panCard, existingUrl: existingPanCardUrl, handler: makeUploadHandler("panCard", setPanCard) },
    { id: "cert-inc", label: "Certificate of Incorporation", required: true, file: certificateOfIncorporation, existingUrl: existingCertificateOfIncorporationUrl, handler: makeUploadHandler("certificateOfIncorporation", setCertificateOfIncorporation) },
    { id: "identity-proof", label: "Identity Proof", hint: "Aadhar / Passport / DL", required: true, file: identityProof, existingUrl: existingIdentityProofUrl, handler: makeUploadHandler("identityProof", setIdentityProof) },
    { id: "address-proof", label: "Address Proof", required: true, file: addressProof, existingUrl: existingAddressProofUrl, handler: makeUploadHandler("addressProof", setAddressProof) },
    { id: "board-res", label: "Board Resolution", hint: "if company", required: false, file: boardResolution, existingUrl: existingBoardResolutionUrl, handler: makeUploadHandler("boardResolution", setBoardResolution) },
  ];

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title">KYC Documents</h3>
        <p className="mf-step__subtitle">Upload your required KYC documents in PDF or JPG format.</p>
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
