import React from "react";
import { Check } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";

export const ProgressBar = () => {
  const { step, totalSteps, isAuthenticated, isProducer } = useMembershipForm();

  const labels: string[] = [];
  if (!isAuthenticated) {
    labels.push("Membership Category");
  }
  labels.push("Personal Information");
  if (!isProducer) {
    labels.push("Authorized Representative");
  }
  labels.push("Bank Details");
  labels.push("KYC Documents");
  labels.push("Ownership Details");
  labels.push("Film Details");
  labels.push("Declaration of Rights");
  labels.push("Membership Agreement");
  labels.push("Review Application");
  labels.push("Membership Fee");

  return (
    <div className="mf-sidebar">
      <h2 className="mf-progress-title">Membership Application</h2>
      
      <div className="mf-stepper">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const label = labels[i] || `Step ${stepNum}`;
          const isCompleted = stepNum < step;
          const isActive = stepNum === step;

          let itemClass = "mf-step-item";
          if (isActive) itemClass += " mf-step-item--active";
          if (isCompleted) itemClass += " mf-step-item--done";

          return (
            <div key={stepNum} className={itemClass}>
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
