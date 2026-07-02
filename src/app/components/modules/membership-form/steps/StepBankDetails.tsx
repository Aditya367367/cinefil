import React from "react";
import { ChevronRight, ChevronLeft, Upload, Check } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";
import { getBackendFileUrl } from "../../../../../utils/fileUrl";


export function StepBankDetails() {
  const {
    accountHolderName, setAccountHolderName,
    bankName, setBankName,
    branchName, setBranchName,
    accountNumber, setAccountNumber,
    ifscCode, setIfscCode,
    swiftCode, setSwiftCode,
    upiId, setUpiId,
    canceledCheck, setCanceledCheck,
    gstCertificate, setGstCertificate,
    existingCanceledCheckUrl, existingGstCertificateUrl,
    documentErrors, setDocumentErrors,
    validateDocument,
    nextStep, prevStep,
  } = useMembershipForm();

  const handleCanceledCheckUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) { setDocumentErrors(prev => ({ ...prev, canceledCheck: error })); setCanceledCheck(null); }
      else { setDocumentErrors(prev => ({ ...prev, canceledCheck: '' })); setCanceledCheck(file); }
    }
  };

  const handleGstCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) { setDocumentErrors(prev => ({ ...prev, gstCertificate: error })); setGstCertificate(null); }
      else { setDocumentErrors(prev => ({ ...prev, gstCertificate: '' })); setGstCertificate(file); }
    }
  };

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title">Bank Details for Royalty Distribution</h3>
        <p className="mf-step__subtitle">Provide bank account details where royalty payouts will be processed.</p>
      </div>

      <div className="mf-grid">
        <div>
          <label className="mf-label">Account Holder Name</label>
          <input value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} className="mf-input" placeholder="Account Holder Name" />
        </div>
        <div>
          <label className="mf-label">Bank Name</label>
          <input value={bankName} onChange={(e) => setBankName(e.target.value)} className="mf-input" placeholder="Bank Name" />
        </div>
        <div>
          <label className="mf-label">Branch</label>
          <input value={branchName} onChange={(e) => setBranchName(e.target.value)} className="mf-input" placeholder="Branch Name" />
        </div>
        <div>
          <label className="mf-label">Account Number</label>
          <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mf-input" placeholder="Account Number" />
        </div>
        <div>
          <label className="mf-label">IFSC Code</label>
          <input value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} className="mf-input" placeholder="IFSC Code" />
        </div>
        <div>
          <label className="mf-label">SWIFT Code <span className="mf-label__hint">(if applicable)</span></label>
          <input value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} className="mf-input" placeholder="SWIFT Code" />
        </div>
        <div>
          <label className="mf-label">UPI ID <span className="mf-label__hint">(optional)</span></label>
          <input value={upiId} onChange={(e) => setUpiId(e.target.value)} className="mf-input" placeholder="name@upi" />
        </div>
      </div>

      <hr className="mf-divider" />

      {/* File uploads */}
      <div className="mf-grid">
        <div>
          <label className="mf-label">Cancelled Cheque <span className="mf-label__hint">(PDF/JPG, max 4MB)</span></label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleCanceledCheckUpload} className="mf-hidden-input" id="canceled-check" />
          <label htmlFor="canceled-check" className={`mf-upload ${canceledCheck || existingCanceledCheckUrl ? "mf-upload--has-file" : ""}`}>
            {canceledCheck ? (
              <><Check size={18} style={{ color: "#059669" }} /><span className="mf-upload__filename">{canceledCheck.name}</span></>
            ) : existingCanceledCheckUrl ? (
              <>
                <Check size={18} style={{ color: "#059669" }} />
                <span className="mf-upload__filename">Existing Document Uploaded</span>
                <a href={`http://localhost:8000${existingCanceledCheckUrl.startsWith('/') ? '' : '/'}${existingCanceledCheckUrl.replace('http://localhost:8000', '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                  View
                </a>
              </>
            ) : (
              <><Upload size={20} className="mf-upload__icon" /><span className="mf-upload__text">Upload cancelled cheque</span><span className="mf-upload__hint">PDF or JPG, max 4MB</span></>
            )}
          </label>
          {documentErrors.canceledCheck && <p className="mf-error">{documentErrors.canceledCheck}</p>}
        </div>
        <div>
          <label className="mf-label">GST Certificate <span className="mf-label__hint">(optional)</span></label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleGstCertificateUpload} className="mf-hidden-input" id="gst-certificate" />
          <label htmlFor="gst-certificate" className={`mf-upload ${gstCertificate || existingGstCertificateUrl ? "mf-upload--has-file" : ""}`}>
            {gstCertificate ? (
              <><Check size={18} style={{ color: "#059669" }} /><span className="mf-upload__filename">{gstCertificate.name}</span></>
            ) : existingGstCertificateUrl ? (
              <>
                <Check size={18} style={{ color: "#059669" }} />
                <span className="mf-upload__filename">Existing Document Uploaded</span>
                <a href={`http://localhost:8000${existingGstCertificateUrl.startsWith('/') ? '' : '/'}${existingGstCertificateUrl.replace('http://localhost:8000', '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                  View
                </a>
              </>
            ) : (
              <><Upload size={20} className="mf-upload__icon" /><span className="mf-upload__text">Upload GST certificate</span><span className="mf-upload__hint">PDF or JPG, max 4MB</span></>
            )}
          </label>
          {documentErrors.gstCertificate && <p className="mf-error">{documentErrors.gstCertificate}</p>}
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
