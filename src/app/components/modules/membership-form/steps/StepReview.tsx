import React from "react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { Edit2, CheckCircle2, AlertCircle } from "lucide-react";

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
    isEmailVerified,
    isMobileVerified,
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
    boardResolution,
    existingBoardResolutionUrl,
    passportPhoto,
    existingPassportPhotoUrl,
    passportPhoto2,
    existingPassportPhoto2Url,
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
  } = useMembershipForm();

  // Map each logical step key to a UI step number
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

  /* ── Helpers ──────────────────────────────── */
  const val = (v: string | null | undefined | boolean | File | null) => {
    if (v instanceof File) return v.name;
    if (typeof v === "boolean") return v ? "Yes" : "No";
    return v?.toString().trim() || null;
  };

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40% 60%",
          gap: "12px",
          marginBottom: "10px",
          fontSize: "14px",
          alignItems: "center",
        }}
      >
        <div style={{ color: "var(--mf-text-secondary)", fontWeight: 500 }}>
          {label}
          {required && (
            <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
          )}
        </div>
        <div
          style={{
            fontWeight: 600,
            wordBreak: "break-word",
            color: isEmpty
              ? "#ef4444"
              : "var(--mf-accent)",
            fontStyle: isEmpty ? "italic" : "normal",
            fontSize: isEmpty ? "13px" : "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isEmpty ? (
            <>
              <AlertCircle size={14} color="#ef4444" />
              Not filled
            </>
          ) : (
            resolved
          )}
        </div>
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
    file: File | null | undefined;
    existingUrl?: string | null;
    required?: boolean;
  }) => {
    const hasFile = file || existingUrl;
    const displayName = file ? file.name : existingUrl ? "Existing Document" : null;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40% 60%",
          gap: "12px",
          marginBottom: "10px",
          fontSize: "14px",
          alignItems: "center",
        }}
      >
        <div style={{ color: "var(--mf-text-secondary)", fontWeight: 500 }}>
          {label}
          {required && (
            <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
          )}
        </div>
        <div
          style={{
            fontWeight: 600,
            color: hasFile ? "var(--mf-accent)" : "#ef4444",
            fontStyle: !hasFile ? "italic" : "normal",
            fontSize: !hasFile ? "13px" : "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {hasFile ? (
            <>
              <CheckCircle2 size={14} color="var(--mf-success)" />
              {displayName}
              {existingUrl && !file && (
                <a
                  href={`http://localhost:8000${existingUrl.startsWith('/') ? '' : '/'}${existingUrl.replace('http://localhost:8000', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '12px', marginLeft: '8px', color: '#3b82f6', textDecoration: 'underline' }}
                >
                  View
                </a>
              )}
            </>
          ) : (
            <>
              <AlertCircle size={14} color="#ef4444" />
              Not uploaded
            </>
          )}
        </div>
      </div>
    );
  };

  const SectionCard = ({
    title,
    editStep,
    children,
  }: {
    title: string;
    editStep: number;
    children: React.ReactNode;
  }) => (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--mf-border)",
        borderRadius: "var(--mf-radius)",
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 20px",
          background: "rgba(15,42,74,0.03)",
          borderBottom: "1px solid var(--mf-border)",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--mf-accent)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </span>
        <button
          type="button"
          onClick={() => setStep(editStep)}
          style={{
            background: "none",
            border: "1.5px solid var(--mf-gold)",
            color: "var(--mf-gold)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 12px",
            borderRadius: "99px",
            transition: "var(--mf-transition)",
          }}
        >
          <Edit2 size={12} /> Edit
        </button>
      </div>
      {/* Section Body */}
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );

  const filledFilms = films.filter((f) => f.title);

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <span className="mf-step__pretitle">Step {getStepIndexByKey("review")}</span>
        <h2 className="mf-step__title flex items-center gap-2">
          Review Application
          <abbr title="Review all the entered details in your application before proceeding to payment." style={{ cursor: "help", textDecoration: "none" }}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
          </abbr>
        </h2>
        <p className="mf-step__subtitle">
          Review all your details below. Fields marked in{" "}
          <span style={{ color: "#ef4444", fontWeight: 600 }}>red</span> are
          empty — click <strong>Edit</strong> to fill them in.
        </p>
      </div>

      {/* ── Step 1: Membership Category ─────── */}
      {activeSteps.includes("category") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("category")} — Membership Category`}
          editStep={getStepIndexByKey("category")}
        >
          <DataRow
            label="Membership Categories"
            value={membershipCategories.join(", ").replace(/_/g, " ") || null}
            required
          />
          <DataRow
            label="Applicant Types"
            value={applicantTypes.join(", ").replace(/_/g, " ") || null}
            required
          />
        </SectionCard>
      )}

      {/* ── Step 2: Personal Information ────── */}
      {activeSteps.includes("applicant") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("applicant")} — Personal Information`}
          editStep={getStepIndexByKey("applicant")}
        >
          <DataRow label="Full Name" value={applicantName} required />
          <DataRow label="Email Address" value={applicantEmail} required />
          <DataRow label="Email Verified" value={isEmailVerified ? "Verified ✓" : null} required />
          <DataRow label="Mobile Number" value={mobileNumber} required />
          <DataRow label="Mobile Verified" value={isMobileVerified ? "Verified ✓" : null} required />
          <DataRow label="PAN Number" value={panNumberField} required />
          <DataRow label="Registered Address" value={registeredAddress} required />
          <DataRow label="City" value={city} />
          <DataRow label="State" value={stateField} />
          <DataRow label="Country" value={country} />
          <DataRow label="Pin Code" value={pinCode} />
        </SectionCard>
      )}

      {/* ── Step 3: Authorized Representative ── */}
      {activeSteps.includes("representative") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("representative")} — Authorized Representative`}
          editStep={getStepIndexByKey("representative")}
        >
          <DataRow label="Representative Name" value={repName} />
          <DataRow label="Designation" value={repDesignation} />
          <DataRow label="Email" value={repEmail} />
          <DataRow label="Mobile" value={repMobile} />
          <DataRow label="Aadhar Number" value={repAadhar} />
          <DataRow label="PAN" value={repPan} />
          <FileRow label="Authority Letter" file={repAuthorityLetter} existingUrl={existingRepAuthorityLetterUrl} />
        </SectionCard>
      )}

      {/* ── Step 4: Bank Details ─────────────── */}
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

      {/* ── Step 5: KYC Documents ─────────────── */}
      {activeSteps.includes("kyc") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("kyc")} — KYC Documents`}
          editStep={getStepIndexByKey("kyc")}
        >
          <FileRow label="PAN Card" file={panCard} existingUrl={existingPanCardUrl} required />
          {!isIndividual && (
            <FileRow label="Authority Letter or Board Resolution" file={boardResolution} existingUrl={existingBoardResolutionUrl} required />
          )}
          <FileRow label="Passport-Size Photograph 1" file={passportPhoto} existingUrl={existingPassportPhotoUrl} required />
          <FileRow label="Passport-Size Photograph 2" file={passportPhoto2} existingUrl={existingPassportPhoto2Url} required />
        </SectionCard>
      )}

      {/* ── Step 6: Ownership Details ─────────── */}
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
              <FileRow label="Producer Ownership Declaration" file={producerOwnershipDeclaration} existingUrl={existingProducerOwnershipDeclarationUrl} required />
            </>
          )}
          {isOtherMember && (
            <>
              <DataRow
                label="Nature of Ownership"
                value={natureOfOwnership.join(", ").replace(/_/g, " ") || null}
                required
              />
              <FileRow label="Assignment Agreement" file={assignmentAgreement} existingUrl={existingAssignmentAgreementUrl} required />
              <FileRow label="Other Ownership Declaration" file={otherOwnershipDeclaration} existingUrl={existingOtherOwnershipDeclarationUrl} required />
            </>
          )}
        </SectionCard>
      )}

      {/* ── Step 7: Repertoire / Film Details ─── */}
      {activeSteps.includes("film") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("film")} — Repertoire Details`}
          editStep={getStepIndexByKey("film")}
        >
          {filledFilms.length === 0 ? (
            <div
              style={{
                color: "#ef4444",
                fontStyle: "italic",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AlertCircle size={14} /> No films added yet
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--mf-text-secondary)",
                  marginBottom: "12px",
                }}
              >
                {filledFilms.length} film(s) listed
                {excelUploaded && " (via Excel upload)"}
              </div>
              {filledFilms.map((f, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--mf-bg)",
                    border: "1px solid var(--mf-border)",
                    borderRadius: "var(--mf-radius)",
                    padding: "12px 16px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--mf-accent)",
                      marginBottom: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {i + 1}. {f.title?.label || f.title?.value}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--mf-text-secondary)",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: "4px 16px",
                    }}
                  >
                    {(f.release_date || f.year) && <span>Year: {f.release_date ? f.release_date.substring(0, 4) : f.year}</span>}
                    {f.language && <span>Language: {f.language}</span>}
                    {f.remarks && <span>Remarks: {f.remarks}</span>}
                  </div>
                </div>
              ))}
            </>
          )}
        </SectionCard>
      )}

      {/* ── Step 8: Declaration of Rights ──────── */}
      {activeSteps.includes("declaration") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("declaration")} — Declaration of Rights`}
          editStep={getStepIndexByKey("declaration")}
        >
          <DataRow
            label="Declared as Lawful Owner"
            value={declareLawfulOwner ? "Accepted ✓" : null}
            required
          />
          <DataRow
            label="Authorized CINEFIL to Administer"
            value={authorizeCinefil ? "Accepted ✓" : null}
            required
          />
          <DataRow
            label="Agreed to Abide by Rules"
            value={agreeToAbide ? "Accepted ✓" : null}
            required
          />
        </SectionCard>
      )}

      {/* ── Step 9: Membership Agreement ──────── */}
      {activeSteps.includes("agreement") && (
        <SectionCard
          title={`Step ${getStepIndexByKey("agreement")} — Membership Agreement`}
          editStep={getStepIndexByKey("agreement")}
        >
          <DataRow
            label="Agreement Accepted"
            value={agreementAccepted ? "Accepted ✓" : null}
            required
          />
          <DataRow label="Digital Signature (Full Name)" value={digitalSignature} required />
          <DataRow label="Place of Signing" value={signaturePlace} required />
          <DataRow label="Date of Signing" value={signatureDate} required />
        </SectionCard>
      )}

      {/* ── Actions ─────────────────────────── */}
      <div className="mf-actions">
        <button type="button" className="mf-btn mf-btn--prev" onClick={prevStep}>
          ← Back
        </button>
        <button type="button" className="mf-btn mf-btn--next" onClick={nextStep}>
          Continue to Payment →
        </button>
      </div>
    </div>
  );
};
