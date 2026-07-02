import { useEffect, useState } from "react";
import { Download, Search, Film, Calendar, Globe } from "lucide-react";
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
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    filmService.getPublicFilms({ search: debouncedSearchTerm, language: selectedLanguage, page, page_size: pageSize })
      .then((res) => {
        setFilms(Array.isArray(res) ? res : res.results || []);
        setTotalCount(res.count || 0);
      })
      .catch((err) => {
        console.error("Failed to load films list", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedSearchTerm, selectedLanguage, page, pageSize]);

  const uniqueLanguages = Array.from(new Set(films.map(f => f.language)));
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "var(--font-body)", backgroundColor: "#f8fafc" }}>
      <PageBanner title="LIST OF FILMS" subtitle="Browse CINEFIL's registered cinematograph film database." />

      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
          >
            Film Catalog & CPL Directory
          </h2>
          <div className="w-14 h-0.5 mx-auto mb-6" style={{ backgroundColor: "var(--cinefil-gold)" }} />
          <p className="text-sm text-slate-500 max-w-2xl mx-auto mb-8">
            CINEFIL administers public performance licensing (CPL) for a large catalog of registered Hindi, English, and regional Indian films.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center max-w-4xl mx-auto mb-8">
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search films, cast..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:border-[--cinefil-gold] bg-slate-50"
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border rounded-xl text-sm focus:outline-none focus:border-[--cinefil-gold] bg-slate-50 flex-1 sm:flex-none"
              >
                <option value="">All Languages</option>
                {uniqueLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-6 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-5 bg-slate-200 rounded w-16 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                    <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="h-3 bg-slate-200 rounded w-20 mb-2 animate-pulse" />
                    <div className="flex flex-wrap gap-1.5">
                      <div className="h-5 bg-slate-200 rounded-full w-16 animate-pulse" />
                      <div className="h-5 bg-slate-200 rounded-full w-20 animate-pulse" />
                      <div className="h-5 bg-slate-200 rounded-full w-14 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : films.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Film size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">No films match your search.</p>
              <p className="text-xs text-slate-400 mt-1">Try refining your filter or search criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {films.map((film) => (
                  <div key={film.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-base text-slate-900 line-clamp-1">{film.title}</h3>
                      {/* <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {film.censor_certificate_no || "No Cert"}
                      </span> */}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                      <Globe size={14} className="text-amber-500" />
                      <span>{film.language || "Not Available"}</span>
                      <span className="text-slate-300">•</span>
                      <Calendar size={14} className="text-amber-500" />
                      <span>{film.release_year || "Not Available"}</span>
                    </div>

                    {film.cast && film.cast.length > 0 && (
                      <div className="border-t pt-3 mt-3">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Cast</p>
                        <div className="flex flex-wrap gap-1.5">
                          {film.cast.map(c => (
                            <span key={c.id} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
                              {c.actor_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-500">
                    Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} films
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${page === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
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
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}