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
    nextStep, prevStep, isProducer,
  } = useMembershipForm();

  const isNoFilmApp = applications?.some((app: any) => app.status === 'no_film');

  // Local state for cast input (per-film tag input)
  const [castInputs, setCastInputs] = useState<{ [key: number]: string }>({});

  const options = isProducer
    ? ["Producer", "Producer and still holds all rights himself"]
    : ["Negative rights holder"];

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
          <h3 className="mf-step__title flex items-center gap-2">
            Repertoire Details
            <abbr title="Enter the details of the films you own, including title, language, date of release, cast, and remarks." style={{ cursor: "help", textDecoration: "none" }}>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
            </abbr>
          </h3>
          <p className="mf-step__subtitle">{isProducer ? "Add details of the films you have produced." : "Add details of the films in which rights are held/acquired."}</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <a
            href={getBackendFileUrl('/api/v1/download-sample-excel/')}
            className="mf-btn mf-btn--small mf-btn--outline"
            style={{ textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: "4px" }}
            download="sample_films.xlsx"
          >
            Download Sample Excel
          </a>
          <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="mf-hidden-input" id="excel-upload" />
          <label htmlFor="excel-upload" className={`mf-btn mf-btn--small ${excelUploaded ? "mf-btn--outline" : "mf-btn--outline"}`} style={{ cursor: "pointer", color: excelUploaded ? "#059669" : undefined, borderColor: excelUploaded ? "#a7f3d0" : undefined }}>
            <Upload size={14} /> {excelUploaded ? "Uploaded ✓" : "Excel Upload"}
          </label>
        </div>
      </div>

      <div className="mf-info-box mf-info-box--neutral" style={{ marginBottom: "20px", fontSize: "12px" }}>
        <strong>Excel format:</strong> Film Title, Language, Date of Release, Star Cast, Remarks.
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

              {/* Language */}
              <div>
                <label className="mf-label">Language</label>
                <input value={film.language} onChange={(e) => handleFilmChange(index, 'language', e.target.value)} className="mf-input" placeholder="e.g. Hindi" />
              </div>

              {/* Date of Release */}
              <div>
                <label className="mf-label">Date of Release</label>
                <input type="date" value={film.release_date || ''} onChange={(e) => handleFilmChange(index, 'release_date', e.target.value)} className="mf-input" />
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

              {/* Remarks */}
              <div className="mf-field--span">
                <label className="mf-label">Remarks</label>
                <input value={film.remarks || ''} onChange={(e) => handleFilmChange(index, 'remarks', e.target.value)} className="mf-input" placeholder="Enter remarks" />
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
