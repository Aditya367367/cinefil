import React from "react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { Edit2, CheckCircle2, AlertCircle } from "lucide-react";

export const StepReview = () => {
  const {
    isAuthenticated,
    setStep,
    nextStep,
    prevStep,
    // Step 1 (Category)
    membershipCategories,
    applicantTypes,
    // Step 2 (Applicant Details)
    applicantName,
    applicantEmail,
    mobileNumber,
    cinLlp,
    gstNumber,
    panNumberField,
    dobIncorporation,
    registeredAddress,
    correspondenceAddress,
    city,
    stateField,
    country,
    pinCode,
    website,
    telephoneNumber,
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
    // Step 4 (Bank)
    accountHolderName,
    bankName,
    branchName,
    accountNumber,
    ifscCode,
    swiftCode,
    upiId,
    canceledCheck,
    gstCertificate,
    // Step 5 (KYC)
    panCard,
    certificateOfIncorporation,
    identityProof,
    addressProof,
    boardResolution,
    // Step 6 (Ownership)
    isOriginalProducer,
    relationWithProducer,
    productionHouseName,
    totalFilmsOwned,
    producerOwnershipDeclaration,
    natureOfOwnership,
    assignmentAgreement,
    otherOwnershipDeclaration,
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

  // Map each logical step to a UI step number
  const getStepIndex = (logicalStep: number) =>
    isAuthenticated ? logicalStep - 1 : logicalStep;

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
    required = false,
  }: {
    label: string;
    file: File | null | undefined;
    required?: boolean;
  }) => {
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
            color: file ? "var(--mf-accent)" : "#ef4444",
            fontStyle: !file ? "italic" : "normal",
            fontSize: !file ? "13px" : "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {file ? (
            <>
              <CheckCircle2 size={14} color="var(--mf-success)" />
              {file.name}
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
        <span className="mf-step__pretitle">Step {isAuthenticated ? "9" : "10"}</span>
        <h2 className="mf-step__title">Review Application</h2>
        <p className="mf-step__subtitle">
          Review all your details below. Fields marked in{" "}
          <span style={{ color: "#ef4444", fontWeight: 600 }}>red</span> are
          empty — click <strong>Edit</strong> to fill them in.
        </p>
      </div>

      {/* ── Step 1: Membership Category ─────── */}
      {!isAuthenticated && (
        <SectionCard title="Step 1 — Membership Category" editStep={1}>
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
      <SectionCard
        title={`Step ${getStepIndex(2)} — Personal Information`}
        editStep={getStepIndex(2)}
      >
        <DataRow label="Full Name" value={applicantName} required />
        <DataRow label="Email Address" value={applicantEmail} required />
        <DataRow label="Email Verified" value={isEmailVerified ? "Verified ✓" : null} required />
        <DataRow label="Mobile Number" value={mobileNumber} required />
        <DataRow label="Mobile Verified" value={isMobileVerified ? "Verified ✓" : null} required />
        <DataRow label="PAN Number" value={panNumberField} />
        <DataRow label="GST Number" value={gstNumber} />
        <DataRow label="CIN / LLPIN" value={cinLlp} />
        <DataRow label="Date of Birth / Incorporation" value={dobIncorporation} />
        <DataRow label="Registered Address" value={registeredAddress} required />
        <DataRow label="Correspondence Address" value={correspondenceAddress} />
        <DataRow label="City" value={city} />
        <DataRow label="State" value={stateField} />
        <DataRow label="Country" value={country} />
        <DataRow label="Pin Code" value={pinCode} />
        <DataRow label="Website" value={website} />
        <DataRow label="Telephone" value={telephoneNumber} />
      </SectionCard>

      {/* ── Step 3: Authorized Representative ── */}
      <SectionCard
        title={`Step ${getStepIndex(3)} — Authorized Representative`}
        editStep={getStepIndex(3)}
      >
        <DataRow label="Representative Name" value={repName} />
        <DataRow label="Designation" value={repDesignation} />
        <DataRow label="Email" value={repEmail} />
        <DataRow label="Mobile" value={repMobile} />
        <DataRow label="Aadhar Number" value={repAadhar} />
        <DataRow label="PAN" value={repPan} />
        <FileRow label="Authority Letter" file={repAuthorityLetter} />
      </SectionCard>

      {/* ── Step 4: Bank Details ─────────────── */}
      <SectionCard
        title={`Step ${getStepIndex(4)} — Bank Details`}
        editStep={getStepIndex(4)}
      >
        <DataRow label="Account Holder Name" value={accountHolderName} required />
        <DataRow label="Bank Name" value={bankName} required />
        <DataRow label="Branch Name" value={branchName} required />
        <DataRow label="Account Number" value={accountNumber} required />
        <DataRow label="IFSC Code" value={ifscCode} required />
        <DataRow label="SWIFT Code" value={swiftCode} />
        <DataRow label="UPI ID" value={upiId} />
        <FileRow label="Cancelled Cheque" file={canceledCheck} required />
        <FileRow label="GST Certificate" file={gstCertificate} />
      </SectionCard>

      {/* ── Step 5: KYC Documents ─────────────── */}
      <SectionCard
        title={`Step ${getStepIndex(5)} — KYC Documents`}
        editStep={getStepIndex(5)}
      >
        <FileRow label="PAN Card" file={panCard} required />
        <FileRow label="Certificate of Incorporation" file={certificateOfIncorporation} required />
        <FileRow label="Identity Proof (Aadhar / Passport)" file={identityProof} required />
        <FileRow label="Address Proof" file={addressProof} required />
        <FileRow label="Board Resolution" file={boardResolution} />
      </SectionCard>

      {/* ── Step 6: Ownership Details ─────────── */}
      <SectionCard
        title={`Step ${getStepIndex(6)} — Ownership Details`}
        editStep={getStepIndex(6)}
      >
        <DataRow label="Original Producer" value={isOriginalProducer} />
        <DataRow label="Relation with Producer" value={relationWithProducer} />
        <DataRow label="Production House Name" value={productionHouseName} />
        <DataRow label="Total Films Owned" value={totalFilmsOwned} />
        <FileRow label="Producer Ownership Declaration" file={producerOwnershipDeclaration} />
        <DataRow
          label="Nature of Ownership"
          value={natureOfOwnership.join(", ").replace(/_/g, " ") || null}
        />
        <FileRow label="Assignment Agreement" file={assignmentAgreement} />
        <FileRow label="Other Ownership Declaration" file={otherOwnershipDeclaration} />
      </SectionCard>

      {/* ── Step 7: Repertoire / Film Details ─── */}
      <SectionCard
        title={`Step ${getStepIndex(7)} — Repertoire Details`}
        editStep={getStepIndex(7)}
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
                  {f.year && <span>Year: {f.year}</span>}
                  {f.language && <span>Language: {f.language}</span>}
                  {f.director_name && <span>Director: {f.director_name}</span>}
                  {f.producer_name && <span>Producer: {f.producer_name}</span>}
                  {f.duration && <span>Duration: {f.duration}</span>}
                </div>
              </div>
            ))}
          </>
        )}
      </SectionCard>

      {/* ── Step 8: Declaration of Rights ──────── */}
      <SectionCard
        title={`Step ${getStepIndex(8)} — Declaration of Rights`}
        editStep={getStepIndex(8)}
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

      {/* ── Step 9: Membership Agreement ──────── */}
      <SectionCard
        title={`Step ${getStepIndex(9)} — Membership Agreement`}
        editStep={getStepIndex(9)}
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
