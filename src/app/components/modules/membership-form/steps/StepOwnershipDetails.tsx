import React from "react";
import { ChevronRight, ChevronLeft, Upload, Check } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";
import { getBackendFileUrl } from "../../../../../utils/fileUrl";


const NATURE_OPTIONS = ["Assignment", "Acquisition", "Purchase", "Merger", "Succession", "Court Order", "Other"];

export function StepOwnershipDetails() {
  const {
    isOriginalProducer, setIsOriginalProducer,
    relationWithProducer, setRelationWithProducer,
    productionHouseName, setProductionHouseName,
    totalFilmsOwned, setTotalFilmsOwned,
    producerOwnershipDeclaration, setProducerOwnershipDeclaration,
    natureOfOwnership, setNatureOfOwnership,
    assignmentAgreement, setAssignmentAgreement,
    otherOwnershipDeclaration, setOtherOwnershipDeclaration,
    existingProducerOwnershipDeclarationUrl, existingAssignmentAgreementUrl, existingOtherOwnershipDeclarationUrl,
    documentErrors, setDocumentErrors,
    validateDocument,
    isAuthenticated,
    selectedMembershipType,
    membershipCategories,
    nextStep, prevStep,
  } = useMembershipForm();

  const makeUpload = (key: string, setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) { setDocumentErrors(prev => ({ ...prev, [key]: error })); setter(null); }
      else { setDocumentErrors(prev => ({ ...prev, [key]: '' })); setter(file); }
    }
  };

  const isProducer = isAuthenticated
    ? selectedMembershipType?.membership_name?.includes("Producer")
    : membershipCategories.includes("producer_member");

  const isOtherMember = isAuthenticated
    ? !selectedMembershipType?.membership_name?.includes("Producer")
    : membershipCategories.includes("other_member");

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title">Ownership Details</h3>
        <p className="mf-step__subtitle">Provide your copyright ownership details based on your membership category.</p>
      </div>

      {/* Producer Section */}
      {isProducer && (
        <div>
          <span className="mf-section-label">Copyright Ownership Details</span>

          <div className="mf-grid">
            <div className="mf-field--span">
              <label className="mf-label">Are you the original producer? <span className="mf-label__req">*</span></label>
              <div className="mf-radio-group mf-radio-group--2col" style={{ marginTop: "8px" }}>
                {["Yes", "No"].map((val) => (
                  <div
                    key={val}
                    className={`mf-radio-card ${isOriginalProducer === val ? "mf-radio-card--selected" : ""}`}
                    onClick={() => setIsOriginalProducer(val)}
                  >
                    <div className="mf-radio-card__indicator" />
                    <span className="mf-radio-card__label">{val}</span>
                  </div>
                ))}
              </div>
              {isOriginalProducer === "No" && (
                <div style={{ marginTop: "12px" }}>
                  <label className="mf-label">Relation with the Producer</label>
                  <input value={relationWithProducer} onChange={(e) => setRelationWithProducer(e.target.value)} className="mf-input" placeholder="e.g. Assignee, Legal Heir" />
                </div>
              )}
            </div>

            <div>
              <label className="mf-label">Production House Name <span className="mf-label__req">*</span></label>
              <input value={productionHouseName} onChange={(e) => setProductionHouseName(e.target.value)} className="mf-input" placeholder="Production house name" />
            </div>
            <div>
              <label className="mf-label">Total Films Owned <span className="mf-label__req">*</span></label>
              <input type="number" value={totalFilmsOwned} onChange={(e) => setTotalFilmsOwned(e.target.value)} className="mf-input" placeholder="e.g. 5" min="0" />
            </div>

            <div className="mf-field--span">
              <label className="mf-label">Producer Ownership Declaration <span className="mf-label__req">*</span> <span className="mf-label__hint">(PDF/JPG)</span></label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={makeUpload("producerOwnershipDeclaration", setProducerOwnershipDeclaration)} className="mf-hidden-input" id="producer-decl" />
              <label htmlFor="producer-decl" className={`mf-upload ${producerOwnershipDeclaration || existingProducerOwnershipDeclarationUrl ? "mf-upload--has-file" : ""}`}>
                {producerOwnershipDeclaration ? (
                  <><Check size={18} style={{ color: "#059669" }} /><span className="mf-upload__filename">{producerOwnershipDeclaration.name}</span></>
                ) : existingProducerOwnershipDeclarationUrl ? (
                  <>
                    <Check size={18} style={{ color: "#059669" }} />
                    <span className="mf-upload__filename">Existing Document Uploaded</span>
                    <a href={getBackendFileUrl(existingProducerOwnershipDeclarationUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                      View
                    </a>
                  </>
                ) : (
                  <><Upload size={20} className="mf-upload__icon" /><span className="mf-upload__text">Upload ownership declaration</span><span className="mf-upload__hint">PDF or JPG, max 4MB</span></>
                )}
              </label>
              {documentErrors.producerOwnershipDeclaration && <p className="mf-error">{documentErrors.producerOwnershipDeclaration}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Negative Rights Holder Section */}
      {isOtherMember && (
        <div style={{ marginTop: isProducer ? "28px" : 0 }}>
          <span className="mf-section-label">Negative Rights Holder Details</span>

          <div className="mf-grid">
            <div className="mf-field--span">
              <label className="mf-label">Nature of Ownership <span className="mf-label__req">*</span></label>
              <div className="mf-radio-group mf-radio-group--4col" style={{ marginTop: "8px" }}>
                {NATURE_OPTIONS.map((nature) => (
                  <div
                    key={nature}
                    className={`mf-radio-card ${natureOfOwnership.includes(nature) ? "mf-radio-card--selected" : ""}`}
                    onClick={() => setNatureOfOwnership(natureOfOwnership.includes(nature) ? [] : [nature])}
                  >
                    <div className="mf-radio-card__indicator" />
                    <span className="mf-radio-card__label">{nature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="mf-label">Assignment Agreement <span className="mf-label__req">*</span> <span className="mf-label__hint">(PDF)</span></label>
              <input type="file" accept=".pdf" onChange={makeUpload("assignmentAgreement", setAssignmentAgreement)} className="mf-hidden-input" id="assign-agree" />
              <label htmlFor="assign-agree" className={`mf-upload ${assignmentAgreement || existingAssignmentAgreementUrl ? "mf-upload--has-file" : ""}`}>
                {assignmentAgreement ? (
                  <><Check size={18} style={{ color: "#059669" }} /><span className="mf-upload__filename">{assignmentAgreement.name}</span></>
                ) : existingAssignmentAgreementUrl ? (
                  <>
                    <Check size={18} style={{ color: "#059669" }} />
                    <span className="mf-upload__filename">Existing Document Uploaded</span>
                    <a href={getBackendFileUrl(existingAssignmentAgreementUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                      View
                    </a>
                  </>
                ) : (
                  <><Upload size={20} className="mf-upload__icon" /><span className="mf-upload__text">Upload assignment agreement</span></>
                )}
              </label>
              {documentErrors.assignmentAgreement && <p className="mf-error">{documentErrors.assignmentAgreement}</p>}
            </div>

            <div>
              <label className="mf-label">Ownership Declaration <span className="mf-label__req">*</span> <span className="mf-label__hint">(PDF)</span></label>
              <input type="file" accept=".pdf" onChange={makeUpload("otherOwnershipDeclaration", setOtherOwnershipDeclaration)} className="mf-hidden-input" id="other-decl" />
              <label htmlFor="other-decl" className={`mf-upload ${otherOwnershipDeclaration || existingOtherOwnershipDeclarationUrl ? "mf-upload--has-file" : ""}`}>
                {otherOwnershipDeclaration ? (
                  <><Check size={18} style={{ color: "#059669" }} /><span className="mf-upload__filename">{otherOwnershipDeclaration.name}</span></>
                ) : existingOtherOwnershipDeclarationUrl ? (
                  <>
                    <Check size={18} style={{ color: "#059669" }} />
                    <span className="mf-upload__filename">Existing Document Uploaded</span>
                    <a href={getBackendFileUrl(existingOtherOwnershipDeclarationUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                      View
                    </a>
                  </>
                ) : (
                  <><Upload size={20} className="mf-upload__icon" /><span className="mf-upload__text">Upload ownership declaration</span></>
                )}
              </label>
              {documentErrors.otherOwnershipDeclaration && <p className="mf-error">{documentErrors.otherOwnershipDeclaration}</p>}
            </div>
          </div>
        </div>
      )}

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
