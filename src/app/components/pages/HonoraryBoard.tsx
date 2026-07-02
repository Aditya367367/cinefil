import { useEffect, useState } from "react";
import { User, Award, ChevronRight, HelpCircle } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { memberService } from "../../../services/memberService";

interface HonoraryMember {
  id: number;
  name: string;
  role: string;
  photo_url?: string;
  biography?: string;
  slug?: string;
}

const DEFAULT_HONORARY_MEMBERS: HonoraryMember[] = [
  { id: 1, name: "Mithun Chakraborty", role: "Co-Chairman (East & North-East)" },
  { id: 2, name: "Priti Sapru", role: "Vice Chairman" },
];

export function HonoraryBoard({ onNavigate }: { onNavigate: (page: string, state?: any) => void }) {
  const [honoraryMembers, setHonoraryMembers] = useState<HonoraryMember[]>(DEFAULT_HONORARY_MEMBERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveFeedSynced, setIsLiveFeedSynced] = useState<boolean>(false);
  const [minimumLoading, setMinimumLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    memberService.getTeams()
      .then((res) => {
        if (!isMounted) return;
        const teams = Array.isArray(res) ? res : res.results || [];
        const honoraryTeam = teams.find((t: any) =>
          t.team_name?.toLowerCase().includes("honorary")
        );

        if (honoraryTeam && honoraryTeam.team_members && honoraryTeam.team_members.length > 0) {
          const members = honoraryTeam.team_members.map((tm: any) => ({
            id: tm.member?.id || Math.random(),
            name: tm.member?.full_name || "Distinguished Advisor",
            role: tm.team_role || tm.member?.role_title || "Honorary Board Member",
            photo_url: tm.member?.photo_url,
            biography: tm.member?.biography,
            slug: tm.member?.slug,
          }));
          setHonoraryMembers(members);
          setIsLiveFeedSynced(true);
        } else {
          setHonoraryMembers(DEFAULT_HONORARY_MEMBERS);
        }
      })
      .catch((err) => {
        console.error("Failed to load live honorary board parameters, utilizing default assets:", err);
        if (isMounted) {
          setHonoraryMembers(DEFAULT_HONORARY_MEMBERS);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

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
        title="HONORARY ADVISORY BOARD"
        subtitle="Eminent industry icons and visionary patrons guiding the legacy and growth of CINEFIL India."
      />

      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Honorary Advisory Board"
            subtitle="Distinguished cinematic personalities and legal luminaries whose guidance strengthens CINEFIL's institutional framework."
          />

          {loading || minimumLoading ? (
            <div className="flex flex-wrap gap-8 justify-center mt-12">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex flex-col items-center justify-between p-6 bg-white border border-slate-200 rounded-none w-64 text-center shadow-xs min-h-[340px]">
                  <div className="w-40 h-40 rounded-none bg-slate-200 animate-pulse" />
                  <div className="mt-5 w-full px-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto animate-pulse" />
                    <div className="h-2 w-8 bg-slate-200 rounded mx-auto animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded w-2/3 mx-auto animate-pulse" />
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 w-full flex justify-center">
                    <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-8 justify-center mt-12">
              {honoraryMembers.map((member, i) => (
                <div
                  key={`${member.name}-${i}`}
                  className="flex flex-col items-center justify-between p-6 bg-white border border-slate-200 rounded-none w-64 text-center shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group min-h-[340px]"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Frame Container Shell */}
                    <div
                      className="w-40 h-40 rounded-none overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-0.5 group-hover:scale-102 transition-transform duration-300 shadow-inner relative"
                      style={{ border: "2px solid var(--cinefil-gold)" }}
                    >
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-none"
                          loading="lazy"
                          onError={(e) => {
                            // Safe fallback abstraction layer
                            (e.target as HTMLImageElement).style.display = "none";
                            const backupShell = (e.target as HTMLImageElement).nextElementSibling;
                            if (backupShell) {
                              backupShell.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 flex items-center justify-center text-slate-300 ${member.photo_url ? 'hidden' : ''}`}>
                        <User size={48} style={{ color: "var(--cinefil-gold)", opacity: 0.6 }} />
                      </div>
                    </div>

                    {/* Metadata Presentation */}
                    <div className="mt-5 w-full px-1">
                      <h3
                        className="font-bold text-sm sm:text-base text-slate-950 tracking-tight leading-snug min-h-[44px] flex items-center justify-center"
                        style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
                      >
                        {member.name}
                      </h3>

                      <div className="h-[2px] w-8 my-2.5 mx-auto bg-gradient-to-r from-transparent via-[var(--cinefil-gold)] to-transparent" />

                      <p className="text-xs text-slate-500 font-semibold leading-tight px-2 min-h-[32px] flex items-start justify-center">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Core Navigational Trigger */}
                  <div className="mt-5 pt-3 border-t border-slate-100 w-full flex justify-center">
                    {member.biography || isLiveFeedSynced ? (
                      <button
                        onClick={() => onNavigate(`profile/${member.slug || member.id}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 hover:bg-[var(--cinefil-navy)] hover:text-white px-4 py-1.5 rounded-lg transition-all duration-300 border border-slate-200/50 shadow-2xs"
                        type="button"
                      >
                        <span>View</span>
                        <ChevronRight size={12} className="opacity-80" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 py-1">
                        <Award size={12} style={{ color: "var(--cinefil-gold)" }} />
                        <span>Patron Council</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}