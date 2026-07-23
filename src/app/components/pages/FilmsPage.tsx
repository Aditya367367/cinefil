import React, { useEffect, useState } from "react";
import { Download, Search, Film, Calendar, Globe, User, ShieldCheck, LayoutGrid, List, X, Info, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { filmService } from "../../../services/filmService";

interface FilmItem {
  id: number;
  title: string;
  language: string;
  release_year: number;
  censor_certificate_no?: string;
  cast?: Array<{ id: number; actor_name: string; character_name: string }>;
  member_name?: string;
}

export function FilmsPage() {
  const [films, setFilms] = useState<FilmItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedFilmModal, setSelectedFilmModal] = useState<FilmItem | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    filmService
      .getPublicFilms({
        search: debouncedSearchTerm,
        language: selectedLanguage,
        page,
        page_size: pageSize,
      })
      .then((res) => {
        setFilms(Array.isArray(res) ? res : res.results || []);
        setTotalCount(res.count || (Array.isArray(res) ? res.length : 0));
      })
      .catch((err) => {
        console.error("Failed to load films list", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedSearchTerm, selectedLanguage, page, pageSize]);

  const uniqueLanguages = Array.from(new Set(films.map((f) => f.language).filter(Boolean)));
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-200">
      {/* Page Banner Header */}
      <PageBanner
        title="FILM CATALOG & CPL DIRECTORY"
        subtitle="Public Performance Licensing (CPL) Database for CINEFIL Registered Cinematograph Titles"
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Metric & Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Registered Catalog</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{totalCount || films.length} Titles</h4>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <Film size={24} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Licensing Coverage</p>
              <h4 className="text-2xl font-black text-emerald-700 mt-1">100% Statutory</h4>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck size={24} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Regional Languages</p>
              <h4 className="text-2xl font-black text-amber-600 mt-1">{uniqueLanguages.length || "Pan-India"}</h4>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <Globe size={24} />
            </div>
          </div>
        </div>

        {/* Search, Language Filter & View Mode Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by film title, censor certificate, or cast member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              {/* Language Selector */}
              <div className="relative flex-1 sm:flex-initial min-w-[160px]">
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition cursor-pointer"
                >
                  <option value="">All Languages</option>
                  {uniqueLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <Globe size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    viewMode === "grid" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    viewMode === "table" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Table View"
                >
                  <List size={15} />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Films Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
                  <div className="h-5 bg-slate-200 rounded-full w-16" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 bg-slate-200 rounded w-20" />
                  <div className="h-4 bg-slate-200 rounded w-16" />
                </div>
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-slate-200 rounded-full w-16" />
                    <div className="h-5 bg-slate-200 rounded-full w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : films.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-4 bg-slate-50 rounded-full text-slate-400 inline-flex mb-3 border border-slate-100">
              <Film size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching films found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any cinematograph films matching "{searchTerm}". Try clearing your search or language filters.
            </p>
            {(searchTerm || selectedLanguage) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLanguage("");
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {films.map((film) => (
              <div
                key={film.id}
                onClick={() => setSelectedFilmModal(film)}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
              >
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1e3a5f] via-amber-500 to-[#1e3a5f] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-[#1e3a5f] transition-colors line-clamp-1">
                        {film.title}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Catalogue Ref: #{film.id}
                      </p>
                    </div>

                    {film.censor_certificate_no ? (
                      <span className="shrink-0 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-emerald-600" /> Cert
                      </span>
                    ) : (
                      <span className="shrink-0 bg-slate-100 text-slate-500 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        Pending Cert
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Globe size={14} className="text-amber-500" />
                      <span>{film.language || "N/A"}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-amber-500" />
                      <span>{film.release_year || "N/A"}</span>
                    </div>
                  </div>

                  {film.member_name && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-600">
                      <User size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate font-semibold text-slate-700">Owner: {film.member_name}</span>
                    </div>
                  )}

                  {film.cast && film.cast.length > 0 && (
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Key Cast & Artists</p>
                      <div className="flex flex-wrap gap-1.5">
                        {film.cast.slice(0, 4).map((c) => (
                          <span
                            key={c.id}
                            className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200/60 px-2.5 py-0.5 rounded-full font-bold"
                          >
                            {c.actor_name}
                          </span>
                        ))}
                        {film.cast.length > 4 && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                            +{film.cast.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1e3a5f] group-hover:text-amber-600 transition-colors">
                  <span>View Details</span>
                  <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1e3a5f] text-white text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="p-4 pl-6">Film Title</th>
                    <th className="p-4">Censor Certificate</th>
                    <th className="p-4">Language</th>
                    <th className="p-4 text-center">Release Year</th>
                    <th className="p-4">Owner / Producer</th>
                    <th className="p-4">Key Cast</th>
                    <th className="p-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700 bg-white">
                  {films.map((film) => (
                    <tr
                      key={film.id}
                      onClick={() => setSelectedFilmModal(film)}
                      className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                    >
                      <td className="p-4 pl-6 font-bold text-slate-900 text-sm">
                        {film.title}
                        <p className="text-[10px] font-mono font-normal text-slate-400">ID: #{film.id}</p>
                      </td>
                      <td className="p-4 font-mono">
                        {film.censor_certificate_no ? (
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[11px]">
                            {film.censor_certificate_no}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg text-[11px]">
                          {film.language || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-600">
                        {film.release_year || "—"}
                      </td>
                      <td className="p-4 text-slate-800 font-semibold max-w-[180px] truncate">
                        {film.member_name || "—"}
                      </td>
                      <td className="p-4 max-w-[220px]">
                        <div className="flex flex-wrap gap-1">
                          {film.cast && film.cast.length > 0 ? (
                            film.cast.slice(0, 2).map((c) => (
                              <span key={c.id} className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                                {c.actor_name}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                          {film.cast && film.cast.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-bold">+{film.cast.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFilmModal(film);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#1e3a5f] hover:text-white text-slate-800 text-xs font-bold transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Showing <span className="font-bold text-slate-800">{(page - 1) * pageSize + 1}</span> to{" "}
              <span className="font-bold text-slate-800">{Math.min(page * pageSize, totalCount)}</span> of{" "}
              <span className="font-bold text-slate-800">{totalCount}</span> registered films
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all shadow-2xs"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        page === pageNum
                          ? "bg-[#1e3a5f] text-white shadow-xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all shadow-2xs"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FILM DETAILS MODAL */}
      {selectedFilmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300 animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-[#1e3a5f] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 text-slate-900 rounded-xl font-bold">
                  <Film size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">{selectedFilmModal.title}</h3>
                  <p className="text-[11px] text-amber-300 font-mono">Catalog Entry #{selectedFilmModal.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFilmModal(null)}
                className="p-1.5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Key Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Language</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedFilmModal.language || "N/A"}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Release Year</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedFilmModal.release_year || "N/A"}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Censor Cert</p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-0.5 truncate">
                    {selectedFilmModal.censor_certificate_no || "Not Uploaded"}
                  </p>
                </div>
              </div>

              {/* Producer / Owner */}
              {selectedFilmModal.member_name && (
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Right Holder / Producer</p>
                    <p className="text-sm font-bold text-amber-950 mt-0.5">{selectedFilmModal.member_name}</p>
                  </div>
                </div>
              )}

              {/* Cast & Crew Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Key Cast & Performers</span>
                </h4>

                {selectedFilmModal.cast && selectedFilmModal.cast.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {selectedFilmModal.cast.map((actor) => (
                      <div key={actor.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                          {actor.actor_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{actor.actor_name}</p>
                          {actor.character_name && (
                            <p className="text-[10px] text-slate-500 truncate">as {actor.character_name}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    No individual cast members catalogued for this film.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedFilmModal(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}