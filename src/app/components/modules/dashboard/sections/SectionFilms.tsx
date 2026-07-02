import React from "react";
import { Film, BadgeDollarSign, Share2 } from "lucide-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useDashboard } from "../context/DashboardContext";
import { getBackendFileUrl } from "../../../../../utils/fileUrl";

export function SectionFilms() {
  const {
    isMember, isPendingMember,
    filmsList, filmsTotalPages, filmsPage, filmsPageSize, filmsTotalCount, handleFilmsPageChange,
    handleEditFilm, handleDeleteFilm, handleConfirmDelete,
    showFilmModal, setShowFilmModal, showDeleteModal, setShowDeleteModal,
    filmToDelete, setFilmToDelete,
    editingFilm, filmSubmitting, handleCreateFilm, handleUpdateFilm, handleCancelEdit,
    newFilmTitle, setNewFilmTitle, newFilmLanguage, setNewFilmLanguage,
    newFilmReleaseYear, setNewFilmReleaseYear, newFilmReleaseDate, setNewFilmReleaseDate,
    newFilmCertificate, setNewFilmCertificate, newFilmCast, setNewFilmCast,
    newFilmDocumentType, setNewFilmDocumentType, newFilmDocumentName, newFilmDocumentFile, setNewFilmDocumentFile,
    newFilmRightHolderMember, newFilmRightHolderType, setNewFilmRightHolderType, newFilmRightHolderPercentage, setNewFilmRightHolderPercentage,
    filmSharedWithNames, setFilmSharedWithNames, filmSharePercentage, setFilmSharePercentage,
    loadFilmOptions, onCreateFilm, loadActorOptions, onCreateActor,
    user, changeSection,

    // New variables
    newFilmProducerName, setNewFilmProducerName, newFilmDirectorName, setNewFilmDirectorName, newFilmDuration, setNewFilmDuration,
    censorDocFile, setCensorDocFile, censorDocName, censorDocUrl, censorDocId,
    copyrightDocFile, setCopyrightDocFile, copyrightDocName, copyrightDocUrl, copyrightDocId,
    ownershipDocFile, setOwnershipDocFile, ownershipDocName, ownershipDocUrl, ownershipDocId,
    isViewOnly, setIsViewOnly,
  } = useDashboard();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header Area */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Film size={22} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Film Rights & Allocation
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5">
              Cast, Owners, & Royalty Management
            </h1>
          </div>
        </div>
        
        {isMember && (
          <button
            onClick={() => {
              handleCancelEdit();
              setIsViewOnly(false);
              setShowFilmModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm w-fit shrink-0"
            type="button"
          >
            <span className="text-base font-normal">+</span>
            <span>Add New Film</span>
          </button>
        )}
      </div>

      {!isMember && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-gray-800 shadow-2xs">
          <p className="font-bold text-sm sm:text-base">Film registration is available only to approved members.</p>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            {isPendingMember
              ? "Your membership application is pending. Once approved, you can add films here."
              : "Submit a membership application from the membership page to gain access."}
          </p>
          <button
            onClick={() => { /* Assume handled by parent or context, for now we will link to /membership-form */ window.location.href='/membership-form'; }}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-bold text-gray-900 transition hover:bg-gray-100 border border-gray-200 shadow-2xs"
          >
            {isPendingMember ? "View membership status" : "Open membership application"}
          </button>
        </div>
      )}

      {isMember && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <BadgeDollarSign size={16} className="text-blue-600 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Registered Film Ledger Catalogue
            </h3>
          </div>

          <div className="overflow-hidden rounded-xl bg-gray-50/50">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest border-b border-gray-800">
                  <tr>
                    <th className="p-4 pl-6">Film Production</th>
                    <th className="p-4">Censor Cert No.</th>
                    <th className="p-4">Core Language</th>
                    <th className="p-4 text-center">Release Year</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs font-medium text-gray-700 bg-white">
                  {filmsList.map((film) => (
                    <tr key={film.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm tracking-tight">{film.title}</span>
                          <span className="mt-0.5 font-mono text-[10px] text-gray-400">
                            ID: #{film.id}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-gray-600 max-w-[180px] truncate">
                        {film.censor_certificate_no || "—"}
                      </td>
                      <td className="p-4">
                        <span className="inline-block rounded-lg border border-gray-200/50 bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-800">
                          {film.language || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 text-center font-semibold text-gray-600">
                        {film.release_year || "—"}
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={async () => {
                              setIsViewOnly(true);
                              await handleEditFilm(film);
                            }}
                            className="inline-flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-200 border border-gray-200 text-gray-700 px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs"
                            type="button"
                          >
                            View
                          </button>
                          <button
                            onClick={async () => {
                              setIsViewOnly(false);
                              await handleEditFilm(film);
                            }}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-200/60 text-blue-700 hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs"
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFilm(film)}
                            className="inline-flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-600 border border-red-200/60 text-red-700 hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs"
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block lg:hidden divide-y divide-gray-200 bg-white">
              {filmsList.map((film) => (
                <div key={film.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base tracking-tight break-words">
                        {film.title}
                      </h4>
                      <p className="mt-0.5 font-mono text-[10px] text-gray-400">
                        System Key: #{film.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          setIsViewOnly(true);
                          await handleEditFilm(film);
                        }}
                        className="inline-flex items-center justify-center rounded-xl bg-gray-50 active:bg-gray-200 border border-gray-200 text-gray-700 px-3.5 py-2 text-xs font-bold transition-all shrink-0"
                        type="button"
                      >
                        View
                      </button>
                      <button
                        onClick={async () => {
                          setIsViewOnly(false);
                          await handleEditFilm(film);
                        }}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-50 active:bg-blue-600 border border-blue-200/40 text-blue-700 active:text-white px-3.5 py-2 text-xs font-bold transition-all shrink-0"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFilm(film)}
                        className="inline-flex items-center justify-center rounded-xl bg-red-50 active:bg-red-600 border border-red-200/40 text-red-700 active:text-white px-3.5 py-2 text-xs font-bold transition-all shrink-0"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                    <div className="flex flex-col justify-center min-w-0 border-r border-gray-200/60 pr-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Censor No
                      </span>
                      <span className="font-mono text-[11px] text-gray-700 font-semibold truncate">
                        {film.censor_certificate_no || "—"}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center min-w-0 border-r border-gray-200/60 px-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Language
                      </span>
                      <span className="text-[11px] text-gray-800 font-bold truncate">
                        {film.language || "N/A"}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center min-w-0 pl-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Year
                      </span>
                      <span className="text-[11px] text-gray-600 font-bold">
                        {film.release_year || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filmsList.length === 0 && (
              <div className="p-10 text-center bg-white">
                <div className="inline-flex p-3 rounded-full bg-gray-50 text-gray-400 mb-3 border border-gray-100">
                  <Film size={20} />
                </div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  No matching entries found
                </p>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
                  No validated production streams matched the search scope inside your workspace.
                </p>
              </div>
            )}

            {filmsTotalPages > 1 && (
              <div className="mt-4 px-4 sm:px-6 lg:px-8 py-4 bg-white border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Showing {((filmsPage - 1) * filmsPageSize) + 1} to {Math.min(filmsPage * filmsPageSize, filmsTotalCount)} of {filmsTotalCount} films
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFilmsPageChange(filmsPage - 1)}
                      disabled={filmsPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(filmsTotalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (filmsTotalPages <= 5) pageNum = i + 1;
                        else if (filmsPage <= 3) pageNum = i + 1;
                        else if (filmsPage >= filmsTotalPages - 2) pageNum = filmsTotalPages - 4 + i;
                        else pageNum = filmsPage - 2 + i;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handleFilmsPageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                              filmsPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handleFilmsPageChange(filmsPage + 1)}
                      disabled={filmsPage === filmsTotalPages}
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP ACTION MODAL OVERLAY */}
      {showFilmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 animate-scale-up">
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                  <Film size={16} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {isViewOnly ? "View Film Details" : (editingFilm ? "Modify Film Parameter Entry" : "Register New Production Ledger")}
                </h3>
              </div>
              <button
                onClick={() => setShowFilmModal(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg transition-colors text-sm font-bold"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
              {editingFilm && (
                <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Cast loaded</p>
                    <p className="mt-1 font-semibold text-gray-900 truncate">
                      {newFilmCast.length > 0 ? newFilmCast.map((actor) => actor.label).join(", ") : "No cast found"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Documents loaded</p>
                    <p className="mt-1 font-semibold text-gray-900 truncate">
                      {[
                        censorDocName && "Censor",
                        copyrightDocName && "Copyright",
                        ownershipDocName && "Ownership"
                      ].filter(Boolean).join(", ") || "No documents found"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rights loaded</p>
                    <p className="mt-1 font-semibold text-gray-900 truncate">
                      {newFilmRightHolderMember?.label
                        ? `${newFilmRightHolderMember.label}${newFilmRightHolderType ? ` · ${newFilmRightHolderType}` : ""}${newFilmRightHolderPercentage ? ` · ${newFilmRightHolderPercentage}%` : ""}`
                        : "No right holder found"}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Film Title
                  {isViewOnly ? (
                    <div className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 normal-case tracking-normal">
                      {newFilmTitle || "—"}
                    </div>
                  ) : (
                    <div className="mt-1.5 normal-case tracking-normal font-normal text-sm">
                      <AsyncCreatableSelect
                        value={newFilmTitle ? { value: newFilmTitle, label: newFilmTitle } : null}
                        inputValue={newFilmTitle}
                        onInputChange={(inputValue, meta) => {
                          if (meta.action === "input-change") setNewFilmTitle(inputValue);
                          return inputValue;
                        }}
                        onChange={(selectedOption) => setNewFilmTitle(selectedOption?.label || "")}
                        loadOptions={loadFilmOptions}
                        onCreateOption={async (inputValue) => {
                          try {
                            const createdFilm: any = await onCreateFilm(inputValue);
                            setNewFilmTitle(createdFilm.label);
                          } catch (error: any) {
                            setNewFilmTitle(inputValue);
                          }
                        }}
                        classNamePrefix="react-select"
                        placeholder="Search or create film title..."
                        noOptionsMessage={() => "Type to search film titles..."}
                        formatCreateLabel={(inputValue) => `Create new film: "${inputValue}"`}
                        isClearable
                      />
                    </div>
                  )}
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Language
                  <input
                    value={newFilmLanguage}
                    onChange={(e) => setNewFilmLanguage(e.target.value)}
                    disabled={isViewOnly}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                    placeholder="e.g. Hindi"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Release Year
                  <input
                    type="number"
                    value={newFilmReleaseYear}
                    onChange={(e) => setNewFilmReleaseYear(e.target.value)}
                    disabled={isViewOnly}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                    placeholder="2026"
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Release Date
                  <input
                    type="date"
                    value={newFilmReleaseDate}
                    onChange={(e) => setNewFilmReleaseDate(e.target.value)}
                    disabled={isViewOnly}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Censor Certificate Number
                  <input
                    value={newFilmCertificate}
                    onChange={(e) => setNewFilmCertificate(e.target.value)}
                    disabled={isViewOnly}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-mono font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                    placeholder="Certificate number"
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Cast Members
                  {isViewOnly ? (
                    <div className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 normal-case tracking-normal">
                      {newFilmCast.length > 0 ? newFilmCast.map((c) => c.label).join(", ") : "No cast found"}
                    </div>
                  ) : (
                    <div className="mt-1.5 normal-case tracking-normal font-normal text-sm">
                      <AsyncCreatableSelect
                        isMulti
                        value={newFilmCast}
                        onChange={(selectedOptions) => setNewFilmCast(selectedOptions as any[])}
                        loadOptions={loadActorOptions}
                        onCreateOption={async (inputValue) => {
                          try {
                            const newActor: any = await onCreateActor(inputValue);
                            setNewFilmCast([...newFilmCast, newActor]);
                          } catch (error) {
                            console.error('Error creating actor:', error);
                          }
                        }}
                        classNamePrefix="react-select"
                        placeholder="Search or create actors..."
                        noOptionsMessage={() => "Type to search actors..."}
                        formatCreateLabel={(inputValue) => `Create new actor: "${inputValue}"`}
                        isClearable
                      />
                    </div>
                  )}
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Producer Name
                  <input
                    value={newFilmProducerName}
                    onChange={(e) => setNewFilmProducerName(e.target.value)}
                    disabled={isViewOnly}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                    placeholder="Producer Name"
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Director Name
                  <input
                    value={newFilmDirectorName}
                    onChange={(e) => setNewFilmDirectorName(e.target.value)}
                    disabled={isViewOnly}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                    placeholder="Director Name"
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Duration
                  <input
                    value={newFilmDuration}
                    onChange={(e) => setNewFilmDuration(e.target.value)}
                    disabled={isViewOnly}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                    placeholder="e.g. 120 mins"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Ownership Type
                  <select
                    value={newFilmRightHolderType}
                    onChange={(e) => setNewFilmRightHolderType(e.target.value)}
                    disabled={isViewOnly}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                  >
                    <option value="">Select ownership type</option>
                    <option value="Producer">Producer</option>
                    <option value="Producer and still holds all rights himself">Producer and still holds all rights himself</option>
                    <option value="Negative rights holder">Negative rights holder</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 border-t border-gray-100 pt-4">
                {/* Censor Certificate */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Censor Certificate</span>
                  {isViewOnly ? (
                    censorDocUrl ? (
                      <a 
                        href={getBackendFileUrl(censorDocUrl)}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-1.5 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition border border-blue-200"
                      >
                        View Document
                      </a>
                    ) : (
                      <span className="mt-1.5 text-xs text-gray-400 italic py-2">Not uploaded</span>
                    )
                  ) : (
                    <div className="mt-1.5 space-y-1.5">
                      <input 
                        type="file" 
                        id="censor-doc-upload" 
                        className="hidden" 
                        onChange={(e) => setCensorDocFile(e.target.files?.[0] || null)} 
                      />
                      <label 
                        htmlFor="censor-doc-upload" 
                        className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition border border-gray-200 cursor-pointer"
                      >
                        {censorDocFile ? censorDocFile.name : (censorDocName ? "Change file" : "Upload file")}
                      </label>
                      {censorDocName && !censorDocFile && (
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-1.5">
                          <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{censorDocName}</span>
                          <a 
                            href={getBackendFileUrl(censorDocUrl)}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] font-bold text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      )}
                      {censorDocFile && (
                        <div className="text-[10px] text-blue-600 font-semibold truncate">Staged: {censorDocFile.name}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Copyright Certificate */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Copyright Certificate</span>
                  {isViewOnly ? (
                    copyrightDocUrl ? (
                      <a 
                        href={getBackendFileUrl(copyrightDocUrl)}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-1.5 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition border border-blue-200"
                      >
                        View Document
                      </a>
                    ) : (
                      <span className="mt-1.5 text-xs text-gray-400 italic py-2">Not uploaded</span>
                    )
                  ) : (
                    <div className="mt-1.5 space-y-1.5">
                      <input 
                        type="file" 
                        id="copyright-doc-upload" 
                        className="hidden" 
                        onChange={(e) => setCopyrightDocFile(e.target.files?.[0] || null)} 
                      />
                      <label 
                        htmlFor="copyright-doc-upload" 
                        className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition border border-gray-200 cursor-pointer"
                      >
                        {copyrightDocFile ? copyrightDocFile.name : (copyrightDocName ? "Change file" : "Upload file")}
                      </label>
                      {copyrightDocName && !copyrightDocFile && (
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-1.5">
                          <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{copyrightDocName}</span>
                          <a 
                            href={getBackendFileUrl(copyrightDocUrl)}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] font-bold text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      )}
                      {copyrightDocFile && (
                        <div className="text-[10px] text-blue-600 font-semibold truncate">Staged: {copyrightDocFile.name}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Ownership Documents */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Ownership Documents</span>
                  {isViewOnly ? (
                    ownershipDocUrl ? (
                      <a 
                        href={getBackendFileUrl(ownershipDocUrl)}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-1.5 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition border border-blue-200"
                      >
                        View Document
                      </a>
                    ) : (
                      <span className="mt-1.5 text-xs text-gray-400 italic py-2">Not uploaded</span>
                    )
                  ) : (
                    <div className="mt-1.5 space-y-1.5">
                      <input 
                        type="file" 
                        id="ownership-doc-upload" 
                        className="hidden" 
                        onChange={(e) => setOwnershipDocFile(e.target.files?.[0] || null)} 
                      />
                      <label 
                        htmlFor="ownership-doc-upload" 
                        className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition border border-gray-200 cursor-pointer"
                      >
                        {ownershipDocFile ? ownershipDocFile.name : (ownershipDocName ? "Change file" : "Upload file")}
                      </label>
                      {ownershipDocName && !ownershipDocFile && (
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-1.5">
                          <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{ownershipDocName}</span>
                          <a 
                            href={getBackendFileUrl(ownershipDocUrl)}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] font-bold text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      )}
                      {ownershipDocFile && (
                        <div className="text-[10px] text-blue-600 font-semibold truncate">Staged: {ownershipDocFile.name}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-slate-50/60 p-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Share2 size={13} />
                  <span>Film Royalty Allocation Shares</span>
                </p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Share Names (Comma-Separated)
                    <input
                      type="text"
                      value={filmSharedWithNames}
                      onChange={(e) => setFilmSharedWithNames(e.target.value)}
                      disabled={isViewOnly}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                      placeholder="e.g. Shyam Raj, Pooja Harish"
                    />
                  </label>

                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Share Percentage (Ownership)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={filmSharePercentage}
                      onChange={(e) => setFilmSharePercentage(e.target.value)}
                      disabled={isViewOnly}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                      placeholder="50"
                    />
                  </label>
                </div>

                <div className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Shared By Manager Account
                  <input
                    value={user?.full_name || ""}
                    disabled
                    readOnly
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-xs font-bold text-gray-500 outline-none normal-case tracking-normal"
                  />
                </div>

                {(() => {
                  const pct = parseFloat(filmSharePercentage) || 0;
                  const namesList = filmSharedWithNames.split(',').map(n => n.trim()).filter(n => n);
                  const totalSharedPct = pct * namesList.length;
                  const mainPct = Math.max(0, 100 - totalSharedPct);

                  if (namesList.length === 0 && !filmSharePercentage) return null;

                  return (
                    <div className="mt-4 pt-4 border-t border-gray-200/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Calculated Share Breakdown (Total: 100%)</p>
                      <div className="space-y-2">
                        {/* Main right holder */}
                        <div className="flex items-center justify-between text-xs bg-blue-50/50 border border-blue-100/50 rounded-lg px-3 py-2">
                          <span className="font-semibold text-gray-800">{user?.full_name || "Main Member"} (Main Right Holder)</span>
                          <span className="font-mono font-bold text-blue-600">
                            {mainPct}%
                          </span>
                        </div>
                        {/* Shared right holders */}
                        {namesList.map((name, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                            <span className="font-medium text-gray-700">{name} (Shared Holder)</span>
                            <span className="font-mono font-bold text-gray-600">
                              {pct}%
                            </span>
                          </div>
                        ))}
                      </div>
                      {totalSharedPct > 100 && (
                        <p className="text-rose-600 text-[10px] font-bold mt-2">
                          Warning: Total shared allocation ({totalSharedPct}%) exceeds 100%!
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5 text-xs font-bold uppercase tracking-wider">
                {isViewOnly ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleCancelEdit();
                      setShowFilmModal(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleCancelEdit();
                        setShowFilmModal(false);
                      }}
                      className="px-4 py-2.5 rounded-xl text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={async (e) => {
                        if (editingFilm) await handleUpdateFilm();
                        else await handleCreateFilm();
                        setShowFilmModal(false);
                      }}
                      disabled={filmSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md disabled:opacity-50"
                      type="button"
                    >
                      {filmSubmitting
                        ? (editingFilm ? "Updating..." : "Submitting...")
                        : (editingFilm ? "Update Film Data" : "Save Entry to Catalog")}
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && filmToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 animate-scale-up">
            <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between border-b border-red-700">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white/20 text-white rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Confirm Film Deletion
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setFilmToDelete(null);
                }}
                className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors text-sm font-bold"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-bold text-red-900 mb-1">
                  Warning: This action cannot be undone
                </p>
                {filmsList.length === 1 ? (
                  <p className="text-xs text-red-700 leading-relaxed font-bold">
                    WARNING: This is your last registered film. If you delete this film, your membership will be revoked because at least one film is required. You will lose access to the member dashboard until you submit a new film. All associated data will be removed.
                  </p>
                ) : (
                  <p className="text-xs text-red-700 leading-relaxed">
                    You are about to permanently delete the film <span className="font-bold">"{filmToDelete.title}"</span> from your catalog. All associated data including cast, documents, and right holders will be removed.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 text-xs font-bold uppercase tracking-wider pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setFilmToDelete(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md"
                  type="button"
                >
                  Yes, Delete Film
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
