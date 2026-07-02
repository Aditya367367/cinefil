import React from "react";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";

const DECLARATIONS = [
  "I hereby declare that I am the lawful owner of the rights in the cinematograph films listed herein and that the information furnished is true and correct.",
  "I authorize CINEFIL Producers Performance Limited to administer, license, collect, distribute and enforce video public performance royalties in accordance with the Copyright Act 1957, the Articles of Association, Membership Agreement, Distribution Scheme, and applicable laws.",
  "I agree to abide by the Articles of Association, Membership Rules, Tariff Scheme, and decisions of CINEFIL.",
];

export function StepDeclaration() {
  const {
    declareLawfulOwner, setDeclareLawfulOwner,
    authorizeCinefil, setAuthorizeCinefil,
    agreeToAbide, setAgreeToAbide,
    nextStep, prevStep,
  } = useMembershipForm();

  const states = [declareLawfulOwner, authorizeCinefil, agreeToAbide];
  const setters = [setDeclareLawfulOwner, setAuthorizeCinefil, setAgreeToAbide];

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title">Declaration of Rights</h3>
        <p className="mf-step__subtitle">Please read and accept all declarations to proceed.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {DECLARATIONS.map((text, i) => {
          const checked = states[i];
          return (
            <div
              key={i}
              className={`mf-check-card ${checked ? "mf-check-card--checked" : ""}`}
              onClick={() => setters[i](!checked)}
            >
              <div className="mf-check-card__box">
                {checked && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
              <span className="mf-check-card__text">{text}</span>
            </div>
          );
        })}
      </div>

      <div className="mf-actions">
        <button type="button" onClick={prevStep} className="mf-btn mf-btn--prev">
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <SkipTestingButton />
          <button
            type="button"
            onClick={nextStep}
            disabled={!declareLawfulOwner || !authorizeCinefil || !agreeToAbide}
            className="mf-btn mf-btn--next"
          >
            Continue <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
