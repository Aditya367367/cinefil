import React from "react";
import { Check } from "lucide-react";

const STEP_LABELS: Record<number, { label: string; shortLabel: string }> = {
  1: { label: "Membership Category", shortLabel: "Category" },
  2: { label: "Personal Information", shortLabel: "Personal Info" },
  3: { label: "Authorized Representative", shortLabel: "Representative" },
  4: { label: "Bank Details", shortLabel: "Bank Details" },
  5: { label: "KYC Documents", shortLabel: "KYC Documents" },
  6: { label: "Ownership Details", shortLabel: "Ownership" },
  7: { label: "Film Details", shortLabel: "Repertoire Details" },
  8: { label: "Declaration of Rights", shortLabel: "Declaration" },
  9: { label: "Membership Agreement", shortLabel: "Agreement" },
  10: { label: "Review Application", shortLabel: "Review" },
  11: { label: "Membership Fee", shortLabel: "Fee Payment" },
};

export const ProgressBar = ({ currentStep, totalSteps, isAuthenticated = false }: { currentStep: number; totalSteps: number, isAuthenticated?: boolean }) => {
  return (
    <div className="mf-sidebar">
      <h2 className="mf-progress-title">Membership Application</h2>
      
      <div className="mf-stepper">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          
          let mappedIndex = stepNum;
          if (isAuthenticated) {
            // If authenticated, we skip step 1 (Category), so physical step 1 maps to logical step 2.
            mappedIndex = stepNum + 1; 
          }
          
          const meta = STEP_LABELS[mappedIndex] || { label: `Step ${stepNum}`, shortLabel: `Step ${stepNum}` };
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          let itemClass = "mf-step-item";
          if (isActive) itemClass += " mf-step-item--active";
          if (isCompleted) itemClass += " mf-step-item--done";

          return (
            <div key={stepNum} className={itemClass}>
              <div className="mf-step-circle">
                {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
              </div>
              <div className="mf-step-content">
                <span className="mf-step-label">{meta.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
