import React from "react";
import { ChevronRight } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";

const CATEGORIES = [
  { id: "producer_member", label: "PRODUCER" },
  { id: "other_member", label: "OTHER OWNER (Video Publisher / Negative Rights Holder)" },
];

const APPLICANT_TYPES = [
  { id: "individual", label: "Individual" },
  { id: "proprietorship_firm", label: "Proprietorship Firm" },
  { id: "partnership_firm", label: "Partnership Firm" },
  { id: "llp", label: "LLP" },
  { id: "private_limited_company", label: "Private Limited Company" },
  { id: "public_limited_company", label: "Public Limited Company" },
  { id: "trust", label: "Trust" },
  { id: "other", label: "Other" },
];

export function StepMembershipCategory() {
  const {
    membershipCategories,
    setMembershipCategories,
    applicantTypes,
    setApplicantTypes,
    otherApplicantType,
    setOtherApplicantType,
    nextStep,
  } = useMembershipForm();

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title flex items-center gap-2">
          Membership Details
          <abbr title="Select your membership category (Producer or Other Member) and applicant type (Individual, Firm, LLP, Company, etc.)." style={{ cursor: "help", textDecoration: "none" }}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
          </abbr>
        </h3>
        <p className="mf-step__subtitle">Select your membership category and applicant type to get started.</p>
      </div>

      {/* Membership Category */}
      <div>
        <span className="mf-label">Membership Category <span className="mf-label__req">*</span></span>
        <div className="mf-radio-group">
          {CATEGORIES.map((cat) => {
            const selected = membershipCategories.includes(cat.id);
            return (
              <div
                key={cat.id}
                className={`mf-radio-card ${selected ? "mf-radio-card--selected" : ""}`}
                onClick={() => setMembershipCategories(selected ? [] : [cat.id])}
              >
                <div className="mf-radio-card__indicator" />
                <span className="mf-radio-card__label">{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="mf-divider" />

      {/* Applicant Type */}
      <div>
        <span className="mf-label">Applicant Type <span className="mf-label__req">*</span></span>
        <div className="mf-radio-group mf-radio-group--2col">
          {APPLICANT_TYPES.map((type) => {
            const selected = applicantTypes.includes(type.id);
            return (
              <div
                key={type.id}
                className={`mf-radio-card ${selected ? "mf-radio-card--selected" : ""}`}
                onClick={() => setApplicantTypes(selected ? [] : [type.id])}
              >
                <div className="mf-radio-card__indicator" />
                <span className="mf-radio-card__label">{type.label}</span>
              </div>
            );
          })}
        </div>
        
        {applicantTypes.includes("other") && (
          <div className="mf-form-group" style={{ marginTop: "1rem" }}>
            <label className="mf-label">
              Please Specify <span className="mf-label__req">*</span>
            </label>
            <input
              type="text"
              value={otherApplicantType}
              onChange={(e) => setOtherApplicantType(e.target.value)}
              className="mf-input"
              placeholder="Enter your applicant type..."
            />
          </div>
        )}
      </div>

      <div className="mf-actions" style={{ justifyContent: "flex-end" }}>
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
