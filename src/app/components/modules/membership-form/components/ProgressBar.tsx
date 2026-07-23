import React from "react";
import { Check } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";

const STEP_LABELS: Record<string, string> = {
  register: "Register Account",
  category: "Membership Category",
  applicant: "Personal Information",
  representative: "Authorized Representative",
  bank: "Bank Details",
  kyc: "KYC Documents",
  ownership: "Ownership Details",
  film: "Repertoire Details",
  declaration: "Declaration of Rights",
  agreement: "Membership Agreement",
  review: "Review Application",
  fee: "Membership Fee",
};

export const ProgressBar = () => {
  const { step, totalSteps, activeSteps } = useMembershipForm();

  return (
    <div className="mf-sidebar">
      <h2 className="mf-progress-title">Membership Application</h2>
      
      <div className="mf-stepper">
        {activeSteps.map((stepKey, i) => {
          const stepNum = i + 1;
          const label = STEP_LABELS[stepKey] || stepKey;
          const isCompleted = stepNum < step;
          const isActive = stepNum === step;

          let itemClass = "mf-step-item";
          if (isActive) itemClass += " mf-step-item--active";
          if (isCompleted) itemClass += " mf-step-item--done";

          return (
            <div key={stepKey} className={itemClass}>
              <div className="mf-step-circle">
                {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
              </div>
              <div className="mf-step-content">
                <span className="mf-step-label">{label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
