import React from "react";
import { useMembershipForm, MembershipFormProvider } from "./context/MembershipFormContext";
import { ProgressBar } from "./components/ProgressBar";
import { StepRegisterAccount } from "./steps/StepRegisterAccount";
import { StepMembershipCategory } from "./steps/StepMembershipCategory";
import { StepApplicantDetails } from "./steps/StepApplicantDetails";

import { StepBankDetails } from "./steps/StepBankDetails";
import { StepKycDocuments } from "./steps/StepKycDocuments";

import { StepFilmDetails } from "./steps/StepFilmDetails";
import { StepDeclaration } from "./steps/StepDeclaration";
import { StepAgreement } from "./steps/StepAgreement";
import { StepReview } from "./steps/StepReview";
import { StepMembershipFee } from "./steps/StepMembershipFee";
import { CongratulationsAnimation } from "../../pages/CongratulationsAnimation";
import { PageBanner } from "../../pages/PageBanner";
import "./membership-form.css";

import { useAuth } from "../../../../context/AuthContext";

function MembershipFormInner() {
  const {
    step,
    totalSteps,
    isAuthenticated,
    handleSubmitApplication,
    showCongratulations,
    handleAnimationComplete,
    applications,
    loadingApplications,
    currentStepKey,
  } = useMembershipForm();

  const { user } = useAuth();

  const progressPercent = totalSteps > 0 ? Math.round((step / totalSteps) * 100) : 0;

  const terminatedApplication = applications?.find(app => app.status === 'terminated');
  const pendingApplication = applications?.find(app => !['draft', 'rejected', 'paid_no_receipt', 'documents_pending', 'query_raised', 'no_film'].includes(app.status));
  const noFilmApplication = applications?.find(app => app.status === 'no_film');

  const renderStep = () => {
    switch (currentStepKey) {
      case "register": return <StepRegisterAccount />;
      case "category": return <StepMembershipCategory />;
      case "applicant": return <StepApplicantDetails />;

      case "bank": return <StepBankDetails />;
      case "kyc": return <StepKycDocuments />;

      case "film": return <StepFilmDetails />;
      case "declaration": return <StepDeclaration />;
      case "agreement": return <StepAgreement />;
      case "review": return <StepReview />;
      case "fee": return <StepMembershipFee />;
      default: return null;
    }
  };

  if (loadingApplications) {

  return (
      <div className="mf-page">
        <PageBanner title="MEMBERSHIP FORM" subtitle="Loading application status..." />
        <div className="mf-container">
          <div className="flex justify-center items-center h-64 text-amber-500">
            <svg className="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (user?.is_member) {
    return (
      <div className="mf-page">
        <PageBanner title="MEMBERSHIP STATUS" subtitle="You are an active member." />
        <div className="mf-container max-w-3xl mx-auto mt-12">
          <div className="mb-6 p-8 rounded-xl border border-green-500/30 bg-green-500/10 text-green-500 font-medium text-center shadow-lg">
            <h2 className="text-2xl mb-2">Already a Member</h2>
            <p>You are already a registered and approved member of Cinefil. You can manage your profile from your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (terminatedApplication) {
    return (
      <div className="mf-page">
        <PageBanner title="MEMBERSHIP TERMINATED" subtitle="Your membership has been terminated." />
        <div className="mf-container max-w-3xl mx-auto mt-12">
          <div className="mb-6 p-8 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 font-medium text-center shadow-lg">
            <h2 className="text-2xl mb-2">Membership Terminated</h2>
            <p>Your membership has been terminated. Please contact support for further information.</p>
          </div>
        </div>
      </div>
    );
  }

  if (pendingApplication) {
    return (
      <div className="mf-page">
        <PageBanner title="APPLICATION STATUS" subtitle="Your membership application is currently under review." />
        <div className="mf-container max-w-3xl mx-auto mt-12">
          <div className="mb-6 p-8 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 font-medium text-center shadow-lg">
            <h2 className="text-2xl mb-2">Application Submitted</h2>
            <p>You already have an active application (Status: <span className="uppercase font-bold">{pendingApplication.status.replace(/_/g, ' ')}</span>). You can review your application from your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mf-page">
      {showCongratulations && (
        <CongratulationsAnimation onComplete={handleAnimationComplete} />
      )}
      <PageBanner title="MEMBERSHIP FORM" subtitle="Download the membership / authorisation form or apply online." />

      <div className="mf-container">
        {noFilmApplication && (
          <div className="mb-6 rounded-xl border border-red-500 bg-red-50 p-4 text-red-800 shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-6 w-6 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg">Membership Suspended: Action Required</h3>
                <p className="mt-1 text-sm font-medium">Your membership has been temporarily suspended because you deleted your last registered film. You must add at least one film to restore your membership. Please complete this form to submit a new film.</p>
              </div>
            </div>
          </div>
        )}
        <div className="mf-layout">
          {/* Left Sidebar: Vertical Stepper */}
          <ProgressBar />
          
          {/* Right Area: Form Card */}
          <div className="mf-main-content">
            <div className="mf-card">
              {/* Optional top progress indicator inside the card */}
              <div className="mf-card-progress">
                <div className="mf-card-progress__track">
                  <div className="mf-card-progress__fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="mf-card-progress__text">{progressPercent}%</span>
              </div>

              <form onSubmit={handleSubmitApplication}>
                {renderStep()}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MembershipForm() {
  return (
    <MembershipFormProvider>
      <MembershipFormInner />
    </MembershipFormProvider>
  );
}
