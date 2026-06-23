import { useEffect, useState } from "react";
import { User, Scale, AlertCircle, ShieldAlert, ChevronRight } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { legalAdvisorService, LegalAdvisor } from "../../services/legalAdvisorService";

export function LegalAdvisorPage({ onNavigate }: { onNavigate: (page: string, state?: any) => void }) {
  const [advisors, setAdvisors] = useState<LegalAdvisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [minimumLoading, setMinimumLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAdvisors = async () => {
      try {
        setLoading(true);
        const data = await legalAdvisorService.getAdvisors();
        if (isMounted) {
          setAdvisors(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load legal council records:", err);
        if (isMounted) {
          setError("Unable to retrieve our legal advisory directory. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAdvisors();

    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-slate-50 min-h-screen">
      <PageBanner 
        title="LEGAL ADVISOR" 
        subtitle="Expert legal counsel guiding CINEFIL's institutional compliance and strategic rights enforcement." 
      />

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Legal Advisory Council" 
            subtitle="CINEFIL's panel of eminent legal experts and legal scholars specializing in intellectual property, media governance, and global copyright law." 
          />

          {/* Loading State */}
          {loading || minimumLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 mt-8 sm:mt-10">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col justify-between p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200 animate-pulse" />
                    <div className="mt-3 sm:mt-4 w-full space-y-1.5 sm:space-y-2">
                      <div className="h-3 sm:h-4 bg-slate-200 rounded w-3/4 mx-auto animate-pulse" />
                      <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-1/2 mx-auto animate-pulse" />
                      <div className="h-14 sm:h-16 bg-slate-100 rounded-xl mt-2 animate-pulse" />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-slate-100 flex justify-center">
                    <div className="h-7 sm:h-8 w-20 sm:w-24 bg-slate-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Error State */}
              {error && (
                <div className="max-w-md mx-auto my-8 sm:my-12 p-4 sm:p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center shadow-xs animate-fade-in">
                  <AlertCircle size={32} className="mx-auto text-rose-500 mb-3 w-7 h-7 sm:w-8 sm:h-8" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Network Handshake Exception</h4>
                  <p className="text-[10px] sm:text-xs text-rose-700/90 mt-1 font-medium">{error}</p>
                </div>
              )}

              {/* Empty State */}
              {!error && advisors.length === 0 && (
                <div className="max-w-sm mx-auto my-8 sm:my-12 p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center shadow-inner animate-fade-in">
                  <ShieldAlert size={36} className="mx-auto text-slate-300 mb-2 w-8 h-8 sm:w-9 sm:h-9" />
                  <h4 className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Directory Empty</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">The advisory panel list is undergoing administrative verification updates.</p>
                </div>
              )}

              {/* Advisors Grid Content */}
              {!error && advisors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 mt-8 sm:mt-10">
              {advisors.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col justify-between p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* User Avatar Frame */}
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center shadow-inner bg-gradient-to-b from-slate-50 to-slate-100 p-1 group-hover:scale-102 transition-transform duration-300"
                      style={{ border: "2px solid var(--cinefil-gold)" }}
                    >
                      {a.photo_url ? (
                        <img 
                          src={a.photo_url} 
                          alt={a.member_name} 
                          className="w-full h-full rounded-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Safe fallback treatment for broken asset URLs
                            (e.target as HTMLImageElement).style.display = "none";
                            const fallbackContainer = (e.target as HTMLImageElement).parentElement;
                            if (fallbackContainer) {
                              fallbackContainer.classList.add("bg-slate-900");
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-slate-400">
                          <User size={40} style={{ color: "var(--cinefil-gold)", opacity: 0.7 }} />
                        </div>
                      )}
                    </div>

                    {/* Meta Body Info */}
                    <div className="mt-4">
                      <h3 
                        className="font-bold text-sm text-slate-900 tracking-tight"
                        style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
                      >
                        {a.member_name}
                      </h3>
                      <p 
                        className="text-[11px] font-bold uppercase tracking-wider mt-1" 
                        style={{ color: "var(--cinefil-gold)" }}
                      >
                        {a.specialisation}
                      </p>
                      
                      {a.description && (
                        <p 
                          className="text-xs text-slate-500 mt-2.5 leading-relaxed font-medium line-clamp-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100"
                        >
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Core Action Footer Trigger */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex justify-center">
                    <button
                      onClick={() => onNavigate(`profile/${a.slug || a.member}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 group-hover:bg-[var(--cinefil-navy)] group-hover:text-white px-4 py-1.5 rounded-lg transition-all duration-300 shadow-2xs"
                      type="button"
                    >
                      <span>Know More</span>
                      <ChevronRight size={12} className="opacity-70" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
              )}
            </>
          )}

          {/* Statutory Policy Framework Legal Notice Block */}
          <div
            className="p-6 sm:p-8 rounded-2xl shadow-xs border transition-all duration-300 hover:shadow-sm"
            style={{ backgroundColor: "var(--cinefil-light-bg)", borderColor: "rgba(201,162,39,0.15)" }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-white border border-amber-200 shadow-2xs rounded-xl text-center shrink-0">
                <Scale size={26} style={{ color: "var(--cinefil-gold)" }} />
              </div>
              
              <div className="space-y-3.5 text-sm leading-relaxed text-slate-600 font-medium">
                <p>
                  CINEFIL's centralized legal advisory panel comprises highly distinguished statutory practitioners and intellectual property counsel. These specialists actively guide the Society on all core technical vectors regarding legal execution regimes, institutional compliance matrices, policy configurations, and proactive rights administration.
                </p>
                <p>
                  Our assigned legal advisors serve an indispensable oversight capacity, securing complete operational transparency within the exact ambit of the <strong>Copyright Act 1957</strong>. They insulate global portfolio operations and ensure that your individual or label intellectual assets are vigorously guarded against unvetted commercial exploit pipelines.
                </p>
                <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                  <span>For active litigation support, formal corporate inquiries, or enforcement notifications, direct correspondence to:</span>
                  <a 
                    href="mailto:admin@cinefilindia.com" 
                    className="font-bold underline tracking-wide hover:opacity-80 transition-opacity" 
                    style={{ color: "var(--cinefil-navy)" }}
                  >
                    admin@cinefilindia.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}