import { useEffect, useState } from "react";
import { User, ShieldCheck, ChevronRight, Award } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { memberService } from "../../../services/memberService";
import { SpotlightCard } from "../../../components/ui/SpotlightCard";

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

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    memberService
      .getTeams()
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
        console.error("Failed to load governing board:", err);
        if (isMounted) {
          setBoardMembers(DEFAULT_BOARD_MEMBERS);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-[#f8fafc] min-h-screen">
      <PageBanner
        title="GOVERNING BOARD"
        subtitle="Eminent film producers and council leaders steering the statutory administration of CINEFIL India."
        badge="Executive Leadership"
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Board of Directors & Council Members"
            subtitle="The elected leadership safeguarding rights, establishing public performance policies, and ensuring transparent royalty allocations."
            badge="Governing Body"
          />

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-64 rounded-[4px] bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6 mt-10">
              {boardMembers.map((member, i) => (
                <SpotlightCard
                  key={`${member.name}-${i}`}
                  className="flex flex-col items-center text-center p-5 rounded-[4px] border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group justify-between min-h-[270px] bg-white"
                  spotlightColor="rgba(201, 162, 39, 0.2)"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Avatar Frame */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[4px] overflow-hidden flex items-center justify-center bg-slate-100 border border-[var(--cinefil-gold)] p-0.5 group-hover:scale-105 transition-transform duration-300 shadow-xs relative">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-[3px]"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            const backupIcon = (e.target as HTMLImageElement).nextElementSibling;
                            if (backupIcon) backupIcon.classList.remove("hidden");
                          }}
                        />
                      ) : null}
                      <div
                        className={`absolute inset-0 flex items-center justify-center bg-slate-50 text-[var(--cinefil-navy)] ${
                          member.photo_url ? "hidden" : ""
                        }`}
                      >
                        <User size={36} className="text-[var(--cinefil-gold)]" />
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="mt-4 px-1">
                      <h3
                        className="font-bold text-sm sm:text-base text-gray-900 tracking-tight leading-tight line-clamp-2 group-hover:text-[var(--cinefil-navy)] transition-colors"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {member.name}
                      </h3>
                      <span className="mt-1 inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--cinefil-gold)] bg-amber-50 px-2.5 py-0.5 rounded-[3px] border border-amber-200">
                        {member.position}
                      </span>
                    </div>
                  </div>

                  {/* Profile Action */}
                  <div className="mt-4 pt-3 border-t border-gray-100 w-full flex justify-center">
                    {member.biography || isLiveRegistry ? (
                      <button
                        onClick={() => onNavigate(`profile/${member.slug || member.id}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--cinefil-navy)] bg-slate-100 hover:bg-[var(--cinefil-navy)] hover:text-white px-3 py-1.5 rounded-[3px] transition-all duration-200 cursor-pointer"
                      >
                        <span>View Profile</span>
                        <ChevronRight size={12} />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400">
                        <Award size={11} className="text-[var(--cinefil-gold)]" />
                        <span>Executive Council</span>
                      </span>
                    )}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
