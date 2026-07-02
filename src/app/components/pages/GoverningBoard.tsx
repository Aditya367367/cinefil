import { useEffect, useState } from "react";
import { User, ShieldCheck, HelpCircle, ChevronRight } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { memberService } from "../../../services/memberService";

interface BoardMember {
  id: number;
  name: string;
  position: string;
  photo_url?: string;
  biography?: string;
  slug?: string;
}

const DEFAULT_BOARD_MEMBERS: BoardMember[] = [
  { id: 1, name: "Shyam Raj", position: "Chairman" },
  { id: 2, name: "C.E. Krishnna", position: "Vice Chairman" },
  { id: 3, name: "Pooja Harish", position: "Patron" },
  { id: 4, name: "Governing Council", position: "Governing Council" },
  { id: 5, name: "Badene Ramesh", position: "Director" },
  { id: 6, name: "P.K. Dugal", position: "Council Member" },
  { id: 7, name: "Fatik Bera", position: "Council Member" },
  { id: 8, name: "C.M. Ansari", position: "Director" },
  { id: 9, name: "Rakesh Chander", position: "Council Member" },
  { id: 10, name: "Deepak Tiwari", position: "Director" },
  { id: 12, name: "Munawar Khan", position: "Director" },
  { id: 13, name: "SATYAN RAJ", position: "Council Member" },
  { id: 14, name: "Tinnu Anand", position: "Director" },
  { id: 15, name: "Omi Kapdiya", position: "Director" },
];

export function GoverningBoard({ onNavigate }: { onNavigate: (page: string, state?: any) => void }) {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(DEFAULT_BOARD_MEMBERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveRegistry, setIsLiveRegistry] = useState<boolean>(false);
  const [minimumLoading, setMinimumLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    memberService.getTeams()
      .then((res) => {
        if (!isMounted) return;
        const teams = Array.isArray(res) ? res : res.results || [];
        const governingTeam = teams.find((t: any) =>
          t.team_name?.toLowerCase().includes("governing")
        );

        if (governingTeam && governingTeam.team_members && governingTeam.team_members.length > 0) {
          const members = governingTeam.team_members.map((tm: any) => ({
            id: tm.member?.id || Math.random(),
            name: tm.member?.full_name || "Official Member",
            position: tm.team_role || tm.member?.role_title || "Council Member",
            photo_url: tm.member?.photo_url,
            biography: tm.member?.biography,
            slug: tm.member?.slug,
          }));
          setBoardMembers(members);
          setIsLiveRegistry(true);
        } else {
          setBoardMembers(DEFAULT_BOARD_MEMBERS);
        }
      })
      .catch((err) => {
        console.error("Failed to load live governing board directory, utilizing secure fallbacks:", err);
        if (isMounted) {
          setBoardMembers(DEFAULT_BOARD_MEMBERS);
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
        title="GOVERNING COUNCIL & BOARD"
        subtitle="Distinguished industry leadership overseeing structural operations and execution pipelines."
      />

      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Governing Council & Board"
            subtitle="The leadership authority commanding long-term strategy, portfolio enforcement, and structural operational oversight across CINEFIL."
          />
          {/* 
          {isLiveRegistry && !loading && (
            <div className="max-w-xl mx-auto mb-10 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-[11px] font-semibold flex items-center gap-2.5 shadow-2xs justify-center animate-fade-in">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span>Verified Identity Registry Live Feed Sync Complete</span>
            </div>
          )} */}

          {loading || minimumLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8 mt-10">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="flex flex-col items-center text-center bg-white border border-slate-100 rounded-none p-4 shadow-xs min-h-[260px]">
                  <div className="w-full aspect-square rounded-none bg-slate-200 animate-pulse" />
                  <div className="mt-4 px-1 w-full space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto animate-pulse" />
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-100/80 w-full flex justify-center">
                    <div className="h-8 w-20 bg-slate-200 rounded-md animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8 mt-10">
              {boardMembers.map((member, i) => (
                <div
                  key={`${member.name}-${i}`}
                  className="flex flex-col items-center text-center bg-white border border-slate-100 rounded-none p-4 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group justify-between min-h-[260px]"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Professional Profile Picture Shell */}
                    <div
                      className="w-full aspect-square rounded-none overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-0.5 group-hover:scale-102 transition-transform duration-300 shadow-inner relative"
                      style={{ border: "2px solid var(--cinefil-gold)" }}
                    >
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-none"
                          loading="lazy"
                          onError={(e) => {
                            // Safe layout handler abstraction for invalid images
                            (e.target as HTMLImageElement).style.display = "none";
                            const backupIcon = (e.target as HTMLImageElement).nextElementSibling;
                            if (backupIcon) {
                              backupIcon.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 flex items-center justify-center text-slate-300 ${member.photo_url ? 'hidden' : ''}`}>
                        <User size={40} style={{ color: "var(--cinefil-gold)", opacity: 0.6 }} />
                      </div>
                    </div>

                    {/* Metadata Content Mapping */}
                    <div className="mt-4 px-1">
                      <h3
                        className="font-bold text-xs sm:text-sm text-slate-950 tracking-tight leading-tight line-clamp-2"
                        style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
                      >
                        {member.name}
                      </h3>
                      <p
                        className="text-[10px] sm:text-xs mt-1 font-bold uppercase tracking-wider"
                        style={{ color: "var(--cinefil-gold)" }}
                      >
                        {member.position}
                      </p>
                    </div>
                  </div>

                  {/* Operational Link CTA Trigger */}
                  <div className="mt-4 pt-2.5 border-t border-slate-100/80 w-full flex justify-center">
                    {member.biography || isLiveRegistry ? (
                      <button
                        onClick={() => onNavigate(`profile/${member.slug || member.id}`)}
                        className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-700 bg-slate-50 hover:bg-[var(--cinefil-navy)] hover:text-white px-3 py-1 rounded-md transition-all duration-300 border border-slate-200/40"
                        type="button"
                      >
                        <span>Profile</span>
                        <ChevronRight size={10} />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 py-1">
                        <HelpCircle size={10} className="opacity-60" />
                        <span>Corporate File</span>
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