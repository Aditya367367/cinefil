import React from "react";
import { FastForward } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";

export function SkipTestingButton() {
  const { step, totalSteps, setStep } = useMembershipForm();

  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      alert("This is the last step. Cannot skip further.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleSkip}
      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-purple-100 text-purple-700 rounded shadow hover:bg-purple-200 transition-all ml-4 border border-purple-300"
      title="DEV ONLY: Skip this step"
    >
      Skip (Dev) <FastForward size={14} />
    </button>
  );
}
