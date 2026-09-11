import { useEffect, useState } from "react";
import { User, Scale, ShieldAlert, ChevronRight, ShieldCheck, Mail } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { useTranslation } from "../../contexts/LanguageContext";
import { legalAdvisorService, LegalAdvisor } from "../../../services/legalAdvisorService";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { SpotlightCard } from "../../../components/ui/SpotlightCard";

export function LegalAdvisorPage({ onNavigate }: { onNavigate: (page: string, state?: any) => void }) {
  const { t } = useTranslation();
  const [advisors, setAdvisors] = useState<LegalAdvisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showSnackbar } = useSnackbar();
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAdvisors = async () => {
      try {
        setLoading(true);
        const data = await legalAdvisorService.getAdvisors();
        if (isMounted) {
          setAdvisors(Array.isArray(data) ? data : []);
          setErrorOccurred(false);
        }
      } catch (err) {
        console.error("Failed to load legal council records:", err);
        if (isMounted) {
          setErrorOccurred(true);
          showSnackbar("Unable to retrieve legal advisory directory. Please try again later.", "error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAdvisors();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-[#f8fafc] min-h-screen">
      <PageBanner
        title={t("LEGAL ADVISORS")}
        subtitle="Expert legal counsel and distinguished IP advocates steering institutional compliance and rights enforcement."
        badge="Legal Council"
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t("Legal Advisory Council")}
            subtitle="CINEFIL's panel of eminent advocates and legal scholars specializing in intellectual property, cinematograph performance rights, and global copyright laws."
            badge="Expert Counsel"
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 mt-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-[4px] bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {!errorOccurred && advisors.length === 0 && (
                <div className="max-w-md mx-auto my-12 p-8 bg-slate-50 border border-slate-200 rounded-[4px] text-center shadow-inner">
                  <ShieldAlert size={36} className="mx-auto text-slate-400 mb-2" />
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Directory In Progress</h4>
                  <p className="text-xs text-slate-500 mt-1">The legal advisory panel is undergoing administrative updates.</p>
                </div>
              )}

              {!errorOccurred && advisors.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 mt-10">
                  {advisors.map((a) => (
                    <SpotlightCard
                      key={a.id}
                      className="flex flex-col justify-between p-6 sm:p-8 bg-white rounded-[4px] border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                      spotlightColor="rgba(201, 162, 39, 0.2)"
                    >
                      <div className="flex flex-col items-center text-center">
                        {/* User Avatar Frame */}
                        <div className="w-24 h-24 rounded-[4px] overflow-hidden flex items-center justify-center shadow-xs bg-slate-100 border border-[var(--cinefil-gold)] p-0.5 group-hover:scale-105 transition-transform duration-300 relative">
                          {a.photo_url ? (
                            <img
                              src={a.photo_url}
                              alt={a.member_name}
                              className="w-full h-full rounded-[3px] object-cover"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                const fallbackContainer = (e.target as HTMLImageElement).parentElement;
                                if (fallbackContainer) fallbackContainer.classList.add("bg-slate-900");
                              }}
                            />
                          ) : (
                            <div className="w-full h-full rounded-[3px] bg-slate-50 flex items-center justify-center text-[var(--cinefil-navy)]">
                              <User size={36} className="text-[var(--cinefil-gold)]" />
                            </div>
                          )}
                        </div>

                        {/* Meta Body Info */}
                        <div className="mt-4">
                          <h3
                            className="font-extrabold text-base text-gray-900 tracking-tight leading-tight group-hover:text-[var(--cinefil-navy)] transition-colors"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {a.member_name}
                          </h3>
                          <span className="mt-1 inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--cinefil-gold)] bg-amber-50 px-2.5 py-0.5 rounded-[3px] border border-amber-200">
                            {a.specialisation || "Legal Advisor"}
                          </span>

                          {a.description && (
                            <p className="text-xs text-gray-600 mt-3 leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded-[4px] border border-gray-100">
                              {a.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                        <button
                          onClick={() => onNavigate(`profile/${a.slug || a.member}`)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cinefil-navy)] bg-slate-100 hover:bg-[var(--cinefil-navy)] hover:text-white px-4 py-2 rounded-[4px] transition-all shadow-2xs cursor-pointer"
                          type="button"
                        >
                          <span>View Advisor Profile</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Statutory Policy Framework Legal Notice Block */}
          <SpotlightCard
            className="p-8 sm:p-10 rounded-[4px] shadow-md border-white/10 bg-slate-900 text-white"
            spotlightColor="rgba(201, 162, 39, 0.25)"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="p-4 bg-white/10 border border-[var(--cinefil-gold)]/40 rounded-[4px] text-center shrink-0">
                <Scale size={32} className="text-[var(--cinefil-gold)]" />
              </div>

              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-white/80">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Statutory Intellectual Property Oversight
                </h3>
                <p>
                  CINEFIL's legal advisory panel comprises distinguished practitioners and intellectual property counsel. These specialists actively guide the Society on all core statutory mandates regarding legal execution, institutional compliance matrices, and proactive rights administration.
                </p>
                <p>
                  Our legal advisors ensure complete operational transparency within the exact ambit of the <strong>Copyright Act 1957</strong>, protecting film creators against unlicensed commercial exploitation across India and overseas territories.
                </p>
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-white/60">
                  <Mail size={14} className="text-[var(--cinefil-gold)]" />
                  <span>For active litigation support or corporate inquiries, write to:</span>
                  <a
                    href="mailto:admin@cinefilindia.com"
                    className="font-bold text-[var(--cinefil-gold)] hover:underline"
                  >
                    admin@cinefilindia.com
                  </a>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}
