import React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";

export function StepAgreement() {
  const {
    agreementAccepted, setAgreementAccepted,
    digitalSignature, setDigitalSignature,
    signaturePlace, setSignaturePlace,
    signatureDate, setSignatureDate,
    nextStep, prevStep,
  } = useMembershipForm();

  const canProceed = agreementAccepted && digitalSignature.trim() && signaturePlace.trim() && signatureDate;

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title">Membership Agreement</h3>
        <p className="mf-step__subtitle">Please read the membership agreement and provide your digital signature.</p>
      </div>

      {/* Agreement content */}
      <div className="mf-agreement-scroll">
        <p style={{ fontWeight: 700, marginBottom: "10px" }}>TERMS AND CONDITIONS OF CINEFIL MEMBERSHIP</p>
        <p style={{ marginBottom: "10px" }}>
          This Membership Agreement ("Agreement") is entered into by and between the applicant ("Member") and CINEFIL Producers Performance Limited ("CINEFIL").
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>1. Grant of Rights:</strong> The Member hereby grants to CINEFIL the exclusive right to administer, license, collect, and distribute royalties for the public performance, broadcast, and communication to the public of the cinematograph films owned by the Member.
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>2. Member Representations:</strong> The Member represents and warrants that they are the lawful owner or assignee of the necessary rights to the repertoire submitted, and that such grant does not infringe upon the rights of any third party.
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>3. Revenue Distribution:</strong> CINEFIL shall collect fees and royalties from licensees and distribute them to the Member in accordance with its distribution scheme, after deducting administrative and other necessary expenses as authorized by its Board of Directors and the Articles of Association.
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>4. Term and Termination:</strong> This Agreement shall remain in full force and effect until terminated by either party with a written notice of at least 60 days, subject to the conditions laid out in the Articles of Association.
        </p>
        <p>
          <strong>5. Compliance:</strong> The Member agrees to promptly update CINEFIL regarding any changes to their repertoire, ownership details, or contact information, and to abide by the rules and decisions of CINEFIL.
        </p>
      </div>

      {/* Acceptance */}
      <div
        className={`mf-check-card ${agreementAccepted ? "mf-check-card--checked" : ""}`}
        onClick={() => setAgreementAccepted(!agreementAccepted)}
        style={{ marginTop: "20px" }}
      >
        <div className="mf-check-card__box">
          {agreementAccepted && <Check size={12} color="#fff" strokeWidth={3} />}
        </div>
        <span className="mf-check-card__text" style={{ fontWeight: 600 }}>
          I have read and accepted the membership agreement.
        </span>
      </div>

      <hr className="mf-divider" />

      {/* Signature fields */}
      <span className="mf-section-label">Digital Signature</span>
      <div className="mf-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="mf-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div>
            <label className="mf-label">Full Name <span className="mf-label__req">*</span></label>
            <input value={digitalSignature} onChange={(e) => setDigitalSignature(e.target.value)} className="mf-input" placeholder="Your full legal name" />
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>Typing your name acts as your digital signature.</p>
          </div>
          <div>
            <label className="mf-label">Place <span className="mf-label__req">*</span></label>
            <input value={signaturePlace} onChange={(e) => setSignaturePlace(e.target.value)} className="mf-input" placeholder="e.g. Mumbai" />
          </div>
          <div>
            <label className="mf-label">Date <span className="mf-label__req">*</span></label>
            <input type="date" value={signatureDate} onChange={(e) => setSignatureDate(e.target.value)} className="mf-input" />
          </div>
        </div>
      </div>

      <div className="mf-actions">
        <button type="button" onClick={prevStep} className="mf-btn mf-btn--prev">
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <SkipTestingButton />
          <button type="button" onClick={nextStep} disabled={!canProceed} className="mf-btn mf-btn--next">
            Continue <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
