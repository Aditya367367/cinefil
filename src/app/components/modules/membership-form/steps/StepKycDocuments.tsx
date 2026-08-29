import React from "react";
import { ChevronRight, ChevronLeft, Upload, Check, FileText, Image, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";

export function StepKycDocuments() {
  const {
    panCard, setPanCard,
    aadharCard, setAadharCard,
    boardResolution, setBoardResolution,
    passportPhoto, setPassportPhoto,
    existingPanCardUrl, existingAadharCardUrl,
    existingBoardResolutionUrl, existingPassportPhotoUrl,
    applicantTypes,
    documentErrors, setDocumentErrors,
    validateDocument,
    nextStep, prevStep,
  } = useMembershipForm();

  const makeUploadHandler = (key: string, setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) {
        setDocumentErrors((prev) => ({ ...prev, [key]: error }));
        setter(null);
      } else {
        setDocumentErrors((prev) => ({ ...prev, [key]: "" }));
        setter(file);
      }
    }
  };

  const isIndividual = applicantTypes.includes("individual");

  const uploads = [
    {
      id: "pan-card",
      key: "panCard",
      label: "PAN Card",
      required: true,
      hint: "Mandatory statutory tax identifier",
      file: panCard,
      existingUrl: existingPanCardUrl,
      handler: makeUploadHandler("panCard", setPanCard),
      icon: FileText,
    },
    {
      id: "aadhar-card",
      key: "aadharCard",
      label: "Aadhaar Card",
      required: false,
      hint: "Government identity proof (Optional / Recommended for Individuals)",
      file: aadharCard,
      existingUrl: existingAadharCardUrl,
      handler: makeUploadHandler("aadharCard", setAadharCard),
      icon: ShieldCheck,
    },
    {
      id: "board-res",
      key: "boardResolution",
      label: "Authority Letter or Board Resolution",
      hint: isIndividual ? "Optional for Individuals" : "Mandatory for Entities / Production Houses",
      required: !isIndividual,
      file: boardResolution,
      existingUrl: existingBoardResolutionUrl,
      handler: makeUploadHandler("boardResolution", setBoardResolution),
      icon: FileText,
    },
    {
      id: "passport-photo-1",
      key: "passportPhoto",
      label: "Passport-Size Photograph",
      required: true,
      hint: "Recent color photograph (PNG / JPG)",
      file: passportPhoto,
      existingUrl: existingPassportPhotoUrl,
      handler: makeUploadHandler("passportPhoto", setPassportPhoto),
      icon: Image,
    },
  ];

  return (
    <div className="mf-step animate-in fade-in duration-300">
      <div className="mf-step__header mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-[var(--cinefil-gold)]/20 text-[var(--cinefil-gold)] border border-[var(--cinefil-gold)]/30 animate-pulse">
            <Sparkles size={16} />
          </span>
          <h3 className="mf-step__title flex items-center gap-2 text-xl font-extrabold text-[var(--cinefil-navy)]">
            KYC Documents & Identification
          </h3>
        </div>
        <p className="mf-step__subtitle text-xs sm:text-sm text-gray-500">
          Upload verified identification documents to substantiate statutory membership records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {uploads.map((u) => {
          const IconComp = u.icon;
          const hasUploaded = !!(u.file || u.existingUrl);
          const hasError = !!documentErrors[u.key];

          return (
            <div
              key={u.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between bg-white relative group ${
                hasError
                  ? "border-rose-400 bg-rose-50/20"
                  : hasUploaded
                  ? "border-emerald-300 shadow-sm bg-emerald-50/15"
                  : "border-gray-200 hover:border-[var(--cinefil-gold)] hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5 cursor-pointer">
                    <IconComp size={15} className={`transition-transform duration-300 group-hover:scale-110 ${hasUploaded ? "text-emerald-600" : "text-[var(--cinefil-gold)]"}`} />
                    <span>{u.label}</span>
                    {u.required && <span className="text-rose-500 font-black">*</span>}
                  </label>
                  {hasUploaded && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                      <Check size={11} /> Uploaded
                    </span>
                  )}
                </div>

                {u.hint && (
                  <p className="text-[11px] text-gray-400 font-medium mb-3">
                    {u.hint}
                  </p>
                )}

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={u.handler}
                  className="hidden"
                  id={u.id}
                />

                <label
                  htmlFor={u.id}
                  className={`mt-2 flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center ${
                    hasUploaded
                      ? "border-emerald-300 bg-emerald-50/30 text-emerald-800"
                      : "border-gray-200 bg-slate-50 hover:bg-slate-100 hover:border-[var(--cinefil-gold)]"
                  }`}
                >
                  {u.file ? (
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-emerald-600" />
                      <span className="text-xs font-bold text-gray-800 truncate max-w-[200px]">
                        {u.file.name}
                      </span>
                    </div>
                  ) : u.existingUrl ? (
                    <div className="flex items-center justify-between w-full px-2">
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-emerald-600" />
                        <span className="text-xs font-semibold text-gray-700">Existing Document</span>
                      </div>
                      <a
                        href={u.existingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-sky-600 hover:underline inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload size={20} className="mx-auto text-[var(--cinefil-gold)] transform group-hover:-translate-y-1 transition-transform" />
                      <p className="text-xs font-bold text-gray-700">Click to Upload</p>
                      <p className="text-[10px] text-gray-400">PDF, JPG, PNG up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>

              {hasError && (
                <p className="text-[11px] text-rose-600 font-semibold mt-2">
                  {documentErrors[u.key]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mf-actions pt-4 border-t border-gray-100 flex items-center justify-between">
        <button type="button" onClick={prevStep} className="mf-btn mf-btn--prev">
          <ChevronLeft size={16} /> Back
        </button>
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
