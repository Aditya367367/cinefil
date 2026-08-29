import React from "react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { Edit2, CheckCircle2, AlertCircle, Sparkles, Send, CreditCard, ChevronLeft, ArrowRight, Loader2, Check } from "lucide-react";

export const StepReview = () => {
  const {
    isAuthenticated,
    setStep,
    nextStep,
    prevStep,
    activeSteps,
    selectedMembershipType,
    // Step 1 (Category)
    membershipCategories,
    applicantTypes,
    // Step 2 (Applicant Details)
    applicantName,
    applicantEmail,
    mobileNumber,
    panNumberField,
    registeredAddress,
    city,
    stateField,
    country,
    pinCode,
    // Step 3 (Authorized Rep)
    repName,
    repDesignation,
    repMobile,
    repEmail,
    repAadhar,
    repPan,
    repAuthorityLetter,
    existingRepAuthorityLetterUrl,
    // Step 4 (Bank)
    accountHolderName,
    bankName,
    branchName,
    accountNumber,
    ifscCode,
    // Step 5 (KYC)
    panCard,
    existingPanCardUrl,
    aadharCard,
    existingAadharCardUrl,
    boardResolution,
    existingBoardResolutionUrl,
    passportPhoto,
    existingPassportPhotoUrl,
    // Step 6 (Ownership)
    isOriginalProducer,
    relationWithProducer,
    productionHouseName,
    totalFilmsOwned,
    producerOwnershipDeclaration,
    existingProducerOwnershipDeclarationUrl,
    natureOfOwnership,
    assignmentAgreement,
    existingAssignmentAgreementUrl,
    otherOwnershipDeclaration,
    existingOtherOwnershipDeclarationUrl,
    // Step 7 (Films)
    films,
    excelUploaded,
    // Step 8 (Declaration)
    declareLawfulOwner,
    authorizeCinefil,
    agreeToAbide,
    // Step 9 (Agreement)
    agreementAccepted,
    digitalSignature,
    signaturePlace,
    signatureDate,
    handleSubmitWithoutPayment,
    submitting,
  } = useMembershipForm();

  const getStepIndexByKey = (stepKey: string) => {
    const idx = activeSteps.indexOf(stepKey);
    return idx !== -1 ? idx + 1 : -1;
  };

  const isIndividual = applicantTypes.includes("individual");

  const isProducer = isAuthenticated
    ? !!selectedMembershipType?.membership_name?.toLowerCase().includes("producer")
    : membershipCategories.includes("producer_member");

  const isOtherMember = isAuthenticated
    ? !selectedMembershipType?.membership_name?.toLowerCase().includes("producer")
    : membershipCategories.includes("other_member");

  const DataRow = ({
    label,
    value,
    required = false,
  }: {
    label: string;
    value: string | boolean | File | null | undefined;
    required?: boolean;
  }) => {
    const resolved =
      value instanceof File
        ? value.name
        : typeof value === "boolean"
        ? value
          ? "Yes"
          : null
        : value?.toString().trim() || null;

    const isEmpty = resolved === null || resolved === undefined || resolved === "";

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 text-xs sm:text-sm gap-1">
        <span className="text-gray-500 font-medium">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </span>
        <span
          className={`font-semibold text-right ${
            isEmpty
              ? required
                ? "text-rose-500 italic font-bold"
                : "text-gray-400 italic"
              : "text-gray-900"
          }`}
        >
          {isEmpty ? (required ? "Missing Required" : "Not Provided") : resolved}
        </span>
      </div>
    );
  };

  const FileRow = ({
    label,
    file,
    existingUrl,
    required = false,
  }: {
    label: string;
    file: File | null;
    existingUrl?: string | null;
    required?: boolean;
  }) => {
    const hasFile = !!(file || existingUrl);

    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100 text-xs sm:text-sm">
        <span className="text-gray-500 font-medium">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </span>
        {file ? (
          <span className="font-semibold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 size={13} /> {file.name}
          </span>
        ) : existingUrl ? (
          <span className="font-semibold text-sky-700 flex items-center gap-1.5 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            <CheckCircle2 size={13} /> Uploaded on file
          </span>
        ) : (
          <span
            className={`text-xs italic ${
              required ? "text-rose-500 font-bold" : "text-gray-400"
            }`}
          >
            {required ? "Missing Document" : "Not Provided"}
          </span>
        )}
      </div>
    );
  };

  const SectionCard = ({
    title,
    editStep,
    children,
  }: {
    title: string;
    editStep?: number;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm mb-6 relative group hover:border-[var(--cinefil-gold)] transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <h4 className="text-sm sm:text-base font-extrabold text-[var(--cinefil-navy)] tracking-tight">
          {title}
        </h4>
        {editStep && editStep > 0 && (
          <button
            type="button"
            onClick={() => setStep(editStep)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cinefil-gold)] hover:text-[var(--cinefil-navy)] px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        )}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );

  const filledFilms = (films || []).filter(
    (f) => f.title || (f.cast && f.cast.length > 0) || f.year || f.language
  );

  return (
    <div className="mf-step max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="mf-step__header mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--cinefil-gold)]/15 border border-[var(--cinefil-gold)]/30 text-[var(--cinefil-gold)] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={13} /> Final Verification
        </div>
        <h3 className="mf-step__title text-2xl font-black text-[var(--cinefil-navy)]">
          Review Application Dossier
        </h3>
        <p className="mf-step__subtitle text-xs sm:text-sm text-gray-500 mt-1">
          Please verify all applicant, KYC, bank, and film repertoire details before finalizing submission.
        </p>
      </div>

      {/* Step 1: Membership Category */}
      {activeSteps.includes("category") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("category")} — Membership Category`}
          editStep={getStepIndexByKey("category")}
        >
          <DataRow
            label="Membership Category"
            value={
              membershipCategories.includes("producer_member")
                ? "Producer Member (Right Holder)"
                : "Other Member"
            }
            required
          />
          <DataRow
            label="Applicant Entity Type"
            value={applicantTypes.map((t) => t.replace(/_/g, " ")).join(", ")}
            required
          />
        </SectionCard>
      )}

      {/* Step 2: Applicant Details */}
      {activeSteps.includes("applicant") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("applicant")} — Applicant Details`}
          editStep={getStepIndexByKey("applicant")}
        >
          <DataRow label="Applicant / Entity Name" value={applicantName} required />
          <DataRow label="Email Address" value={applicantEmail} required />
          <DataRow label="Mobile Contact" value={mobileNumber} required />
          <DataRow label="PAN Number" value={panNumberField} required />
          <DataRow label="Registered Address" value={registeredAddress} required />
          <DataRow label="City / State" value={`${city || ""}, ${stateField || ""}`} required />
          <DataRow label="PIN Code / Country" value={`${pinCode || ""}, ${country || "India"}`} required />
        </SectionCard>
      )}

      {/* Step 3: Authorized Representative */}
      {activeSteps.includes("rep") && !isIndividual && (
        <SectionCard
          title={`Step ${getStepIndexByKey("rep")} — Authorized Representative`}
          editStep={getStepIndexByKey("rep")}
        >
          <DataRow label="Representative Name" value={repName} required />
          <DataRow label="Designation" value={repDesignation} required />
          <DataRow label="Mobile Number" value={repMobile} required />
          <DataRow label="Email Address" value={repEmail} required />
          <DataRow label="Aadhaar Number" value={repAadhar} />
          <DataRow label="PAN Number" value={repPan} />
          <FileRow
            label="Authority Letter"
            file={repAuthorityLetter}
            existingUrl={existingRepAuthorityLetterUrl}
          />
        </SectionCard>
      )}

      {/* Step 4: Bank Details */}
      {activeSteps.includes("bank") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("bank")} — Bank Details`}
          editStep={getStepIndexByKey("bank")}
        >
          <DataRow label="Account Holder Name" value={accountHolderName} required />
          <DataRow label="Bank Name" value={bankName} required />
          <DataRow label="Branch Name" value={branchName} required />
          <DataRow label="Account Number" value={accountNumber} required />
          <DataRow label="IFSC Code" value={ifscCode} required />
        </SectionCard>
      )}

      {/* Step 5: KYC Documents */}
      {activeSteps.includes("kyc") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("kyc")} — KYC Documents`}
          editStep={getStepIndexByKey("kyc")}
        >
          <FileRow label="PAN Card" file={panCard} existingUrl={existingPanCardUrl} required />
          <FileRow label="Aadhaar Card" file={aadharCard} existingUrl={existingAadharCardUrl} />
          {!isIndividual && (
            <FileRow
              label="Board Resolution / Authority Letter"
              file={boardResolution}
              existingUrl={existingBoardResolutionUrl}
              required
            />
          )}
          <FileRow
            label="Passport Photograph"
            file={passportPhoto}
            existingUrl={existingPassportPhotoUrl}
            required
          />
        </SectionCard>
      )}

      {/* Step 6: Ownership Details */}
      {activeSteps.includes("ownership") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("ownership")} — Ownership Details`}
          editStep={getStepIndexByKey("ownership")}
        >
          {isProducer && (
            <>
              <DataRow label="Original Producer" value={isOriginalProducer} required />
              {isOriginalProducer === "No" && (
                <DataRow label="Relation with Producer" value={relationWithProducer} />
              )}
              <DataRow label="Production House Name" value={productionHouseName} required />
              <DataRow label="Total Films Owned" value={totalFilmsOwned} required />
              <FileRow
                label="Producer Ownership Declaration"
                file={producerOwnershipDeclaration}
                existingUrl={existingProducerOwnershipDeclarationUrl}
                required
              />
            </>
          )}
          {isOtherMember && (
            <>
              <DataRow
                label="Nature of Ownership"
                value={natureOfOwnership.join(", ").replace(/_/g, " ") || null}
                required
              />
              <FileRow
                label="Assignment Agreement"
                file={assignmentAgreement}
                existingUrl={existingAssignmentAgreementUrl}
                required
              />
              <FileRow
                label="Other Ownership Declaration"
                file={otherOwnershipDeclaration}
                existingUrl={existingOtherOwnershipDeclarationUrl}
                required
              />
            </>
          )}
        </SectionCard>
      )}

      {/* Step 7: Repertoire Details */}
      {activeSteps.includes("film") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("film")} — Repertoire Details`}
          editStep={getStepIndexByKey("film")}
        >
          {filledFilms.length === 0 ? (
            <div className="flex items-center gap-2 text-xs font-bold text-rose-500 py-2">
              <AlertCircle size={15} /> No films added yet
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500">
                {filledFilms.length} film(s) registered {excelUploaded && "(via Excel Upload)"}
              </p>
              {filledFilms.map((f, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs">
                  <span className="font-bold text-[var(--cinefil-navy)]">
                    {i + 1}. {f.title?.label || f.title?.value}
                  </span>
                  <div className="flex flex-wrap gap-4 mt-1 text-gray-600">
                    <span>Year: {f.release_date ? f.release_date.substring(0, 4) : f.year || "N/A"}</span>
                    <span>Language: {f.language || "N/A"}</span>
                    {f.remarks && <span>Remarks: {f.remarks}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* Step 8: Declarations */}
      {activeSteps.includes("declaration") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("declaration")} — Declaration of Rights`}
          editStep={getStepIndexByKey("declaration")}
        >
          <DataRow label="Declared as Lawful Owner" value={declareLawfulOwner ? "Accepted ✓" : null} required />
          <DataRow label="Authorized CINEFIL to Administer" value={authorizeCinefil ? "Accepted ✓" : null} required />
          <DataRow label="Agreed to Abide by Rules" value={agreeToAbide ? "Accepted ✓" : null} required />
        </SectionCard>
      )}

      {/* Step 9: Membership Agreement */}
      {activeSteps.includes("agreement") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("agreement")} — Membership Agreement`}
          editStep={getStepIndexByKey("agreement")}
        >
          <DataRow label="Agreement Terms Accepted" value={agreementAccepted ? "Accepted ✓" : null} required />
          <DataRow label="Digital Signature (Full Name)" value={digitalSignature} required />
          <DataRow label="Place of Signing" value={signaturePlace} required />
          <DataRow label="Date of Signing" value={signatureDate} required />
        </SectionCard>
      )}

      {/* Submission Choices & Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-50 to-blue-500/10 border border-amber-300/60 shadow-md mb-8">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-[var(--cinefil-gold)] flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p className="font-extrabold text-[var(--cinefil-navy)] mb-1">
              Submission & Enrollment Options:
            </p>
            <p>
              You can instantly <strong>Submit Without Payment</strong> to activate your Associate Membership number, or proceed to <strong>Online Payment</strong> via Razorpay.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={prevStep}
          disabled={submitting}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Submit Without Payment Button */}
          <button
            type="button"
            onClick={handleSubmitWithoutPayment}
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm border-2 border-[var(--cinefil-navy)] text-[var(--cinefil-navy)] bg-white hover:bg-[var(--cinefil-navy)] hover:text-white transition-all shadow-md flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Submit Without Payment</span>
              </>
            )}
          </button>

          {/* Continue to Payment */}
          <button
            type="button"
            onClick={nextStep}
            disabled={submitting}
            className="w-full sm:w-auto px-7 py-3 rounded-xl font-extrabold text-xs sm:text-sm text-[var(--cinefil-navy)] bg-gradient-to-r from-[var(--cinefil-gold)] to-[var(--cinefil-gold-light)] hover:shadow-lg transition-all shadow-md flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <CreditCard size={16} />
            <span>Continue to Payment Options</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
