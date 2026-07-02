import React, { useState } from "react";
import { ChevronRight, ChevronLeft, PlusCircle, Trash2, Upload, Check, X } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";
import { getBackendFileUrl } from "../../../../../utils/fileUrl";


const OWNERSHIP_OPTIONS = [
  "Producer",
  "Producer and still holds all rights himself",
  "Negative rights holder"
];

export function StepFilmDetails() {
  const {
    films, excelUploaded, applications,
    handleFilmChange, addFilm, removeFilm, handleExcelUpload,
    nextStep, prevStep,
  } = useMembershipForm();

  const isNoFilmApp = applications?.some((app: any) => app.status === 'no_film');

  // Local state for cast input (per-film tag input)
  const [castInputs, setCastInputs] = useState<{ [key: number]: string }>({});

  const handleOwnershipTypeChange = (index: number, option: string) => {
    const current = films[index].ownership_type || [];
    handleFilmChange(index, 'ownership_type', current.includes(option) ? [] : [option]);
  };

  const handleCastKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const name = (castInputs[index] || '').trim();
      if (!name) return;
      const existing = films[index].cast || [];
      // Avoid duplicates
      if (existing.some((c: any) => (c.label || c.value || c) === name)) return;
      const newCast = [...existing, { value: name, label: name }];
      handleFilmChange(index, 'cast', newCast);
      setCastInputs(prev => ({ ...prev, [index]: '' }));
    }
  };

  const removeCastMember = (filmIndex: number, castIndex: number) => {
    const existing = films[filmIndex].cast || [];
    const updated = existing.filter((_: any, i: number) => i !== castIndex);
    handleFilmChange(filmIndex, 'cast', updated);
  };

  return (
    <div className="mf-step">
      <div className="mf-step__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h3 className="mf-step__title">Repertoire Details</h3>
          <p className="mf-step__subtitle">Add details of the films you own or hold rights to.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="mf-hidden-input" id="excel-upload" />
          <label htmlFor="excel-upload" className={`mf-btn mf-btn--small ${excelUploaded ? "mf-btn--outline" : "mf-btn--outline"}`} style={{ cursor: "pointer", color: excelUploaded ? "#059669" : undefined, borderColor: excelUploaded ? "#a7f3d0" : undefined }}>
            <Upload size={14} /> {excelUploaded ? "Uploaded ✓" : "Excel Upload"}
          </label>
        </div>
      </div>

      <div className="mf-info-box mf-info-box--neutral" style={{ marginBottom: "20px", fontSize: "12px" }}>
        <strong>Excel format:</strong> Film Title, Language, Year of Release, Star Cast, Producer Name, Director Name, Duration, Ownership Type. Document columns are optional in Excel.
      </div>
      
      {isNoFilmApp && films.length > 0 && (
        <div className="mf-info-box mf-info-box--warning" style={{ marginBottom: "20px", fontSize: "13px", backgroundColor: "#fffbeb", borderColor: "#fef3c7", color: "#92400e" }}>
          <strong>Notice:</strong> The films listed below were present in your previous submission (including the one you just deleted from your dashboard). Please remove any films you no longer own, add your new film(s), and submit.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {films.map((film, index) => (
          <div key={index} className="mf-film-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span className="mf-film-card__number">{index + 1}</span>
              {films.length > 1 && (
                <button type="button" onClick={() => removeFilm(index)} className="mf-film-card__remove">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="mf-grid">
              {/* Film Title — Plain text input */}
              <div>
                <label className="mf-label">Film Title <span className="mf-label__req">*</span></label>
                <input
                  value={typeof film.title === 'object' ? (film.title?.label || film.title?.value || '') : (film.title || '')}
                  onChange={(e) => handleFilmChange(index, 'title', { value: e.target.value, label: e.target.value })}
                  className="mf-input"
                  placeholder="Enter film title"
                />
              </div>

              {/* Star Cast — Tag-style input */}
              <div>
                <label className="mf-label">Star Cast</label>
                <div className="mf-tags-input">
                  <div className="mf-tags-input__tags">
                    {(film.cast || []).map((castMember: any, cIdx: number) => (
                      <span key={cIdx} className="mf-tag">
                        {castMember.label || castMember.value || castMember}
                        <button type="button" onClick={() => removeCastMember(index, cIdx)} className="mf-tag__remove">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={castInputs[index] || ''}
                    onChange={(e) => setCastInputs(prev => ({ ...prev, [index]: e.target.value }))}
                    onKeyDown={(e) => handleCastKeyDown(index, e)}
                    className="mf-tags-input__field"
                    placeholder={film.cast && film.cast.length > 0 ? "Add more..." : "Type name & press Enter"}
                  />
                </div>
              </div>

              {/* Basic info */}
              <div>
                <label className="mf-label">Language</label>
                <input value={film.language} onChange={(e) => handleFilmChange(index, 'language', e.target.value)} className="mf-input" placeholder="e.g. Hindi" />
              </div>
              <div>
                <label className="mf-label">Year of Release</label>
                <input value={film.year} onChange={(e) => handleFilmChange(index, 'year', e.target.value)} className="mf-input" placeholder="YYYY" />
              </div>
              <div>
                <label className="mf-label">Producer Name</label>
                <input value={film.producer_name} onChange={(e) => handleFilmChange(index, 'producer_name', e.target.value)} className="mf-input" placeholder="Producer Name" />
              </div>
              <div>
                <label className="mf-label">Director Name</label>
                <input value={film.director_name} onChange={(e) => handleFilmChange(index, 'director_name', e.target.value)} className="mf-input" placeholder="Director Name" />
              </div>
              <div>
                <label className="mf-label">Duration</label>
                <input value={film.duration} onChange={(e) => handleFilmChange(index, 'duration', e.target.value)} className="mf-input" placeholder="e.g. 120 mins" />
              </div>

              {/* Ownership type */}
              <div className="mf-field--span">
                <label className="mf-label">Ownership Type</label>
                <div className="mf-radio-group" style={{ marginTop: "6px", gridTemplateColumns: "1fr", gap: "8px" }}>
                  {OWNERSHIP_OPTIONS.map((option) => (
                    <div
                      key={option}
                      className={`mf-radio-card ${(film.ownership_type || []).includes(option) ? "mf-radio-card--selected" : ""}`}
                      onClick={() => handleOwnershipTypeChange(index, option)}
                      style={{ padding: "10px 14px" }}
                    >
                      <div className="mf-radio-card__indicator" />
                      <span className="mf-radio-card__label">{option}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document uploads */}
              <div>
                <label className="mf-label">Censor Certificate</label>
                <input type="file" id={`censor-${index}`} className="mf-hidden-input" onChange={(e) => handleFilmChange(index, 'censor_certificate', e.target.files?.[0] || null)} />
                <label htmlFor={`censor-${index}`} className={`mf-upload ${film.censor_certificate || film.existing_censor_certificate_url ? "mf-upload--has-file" : ""}`} style={{ padding: "12px" }}>
                  {film.censor_certificate ? <><Check size={14} style={{ color: "#059669" }} /><span className="mf-upload__filename" style={{ fontSize: "12px" }}>{film.censor_certificate.name}</span></> : 
                   film.existing_censor_certificate_url ? <><Check size={14} style={{ color: "#059669" }} /><span className="mf-upload__filename" style={{ fontSize: "12px" }}>Existing Document Uploaded</span><a href={getBackendFileUrl(film.existing_censor_certificate_url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", marginLeft: "auto", color: "#3b82f6", zIndex: 10 }} onClick={(e) => e.stopPropagation()}>View</a></> :
                   <><Upload size={16} className="mf-upload__icon" /><span className="mf-upload__text" style={{ fontSize: "12px" }}>Upload file</span></>}
                </label>
              </div>
              <div>
                <label className="mf-label">Copyright Certificate <span className="mf-label__hint">(optional)</span></label>
                <input type="file" id={`copyright-${index}`} className="mf-hidden-input" onChange={(e) => handleFilmChange(index, 'copyright_certificate', e.target.files?.[0] || null)} />
                <label htmlFor={`copyright-${index}`} className={`mf-upload ${film.copyright_certificate || film.existing_copyright_certificate_url ? "mf-upload--has-file" : ""}`} style={{ padding: "12px" }}>
                  {film.copyright_certificate ? <><Check size={14} style={{ color: "#059669" }} /><span className="mf-upload__filename" style={{ fontSize: "12px" }}>{film.copyright_certificate.name}</span></> : 
                   film.existing_copyright_certificate_url ? <><Check size={14} style={{ color: "#059669" }} /><span className="mf-upload__filename" style={{ fontSize: "12px" }}>Existing Document Uploaded</span><a href={getBackendFileUrl(film.existing_copyright_certificate_url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", marginLeft: "auto", color: "#3b82f6", zIndex: 10 }} onClick={(e) => e.stopPropagation()}>View</a></> :
                   <><Upload size={16} className="mf-upload__icon" /><span className="mf-upload__text" style={{ fontSize: "12px" }}>Upload file</span></>}
                </label>
              </div>
              <div>
                <label className="mf-label">Ownership Documents</label>
                <input type="file" id={`ownership-${index}`} className="mf-hidden-input" onChange={(e) => handleFilmChange(index, 'ownership_document', e.target.files?.[0] || null)} />
                <label htmlFor={`ownership-${index}`} className={`mf-upload ${film.ownership_document || film.existing_ownership_document_url ? "mf-upload--has-file" : ""}`} style={{ padding: "12px" }}>
                  {film.ownership_document ? <><Check size={14} style={{ color: "#059669" }} /><span className="mf-upload__filename" style={{ fontSize: "12px" }}>{film.ownership_document.name}</span></> : 
                   film.existing_ownership_document_url ? <><Check size={14} style={{ color: "#059669" }} /><span className="mf-upload__filename" style={{ fontSize: "12px" }}>Existing Document Uploaded</span><a href={getBackendFileUrl(film.existing_ownership_document_url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", marginLeft: "auto", color: "#3b82f6", zIndex: 10 }} onClick={(e) => e.stopPropagation()}>View</a></> :
                   <><Upload size={16} className="mf-upload__icon" /><span className="mf-upload__text" style={{ fontSize: "12px" }}>Upload file</span></>}
                </label>
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addFilm} className="mf-btn mf-btn--outline" style={{ width: "100%", justifyContent: "center", padding: "14px", borderStyle: "dashed" }}>
          <PlusCircle size={16} /> Add Another Film
        </button>
      </div>

      <div className="mf-actions">
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
