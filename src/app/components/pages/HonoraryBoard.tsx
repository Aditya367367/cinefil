import { useEffect, useState } from "react";
import { User, Award, ChevronRight, Sparkles } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { memberService } from "../../../services/memberService";
import { SpotlightCard } from "../../../components/ui/SpotlightCard";

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

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    memberService
      .getTeams()
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
        console.error("Failed to load honorary board:", err);
        if (isMounted) {
          setHonoraryMembers(DEFAULT_HONORARY_MEMBERS);
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
        title="HONORARY BOARD"
        subtitle="Legendary icons of Indian cinema and industry stalwarts guiding CINEFIL's visionary mission."
        badge="Distinguished Patrons"
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Patrons & Honorary Leadership"
            subtitle="Iconic visionaries providing national strategic counsel and cultural stewardship to the society."
            badge="National Icons"
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto">
              {[1, 2].map((i) => (
                <div key={i} className="h-80 rounded-[4px] bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto">
              {honoraryMembers.map((member, i) => (
                <SpotlightCard
                  key={`${member.name}-${i}`}
                  className="flex flex-col items-center text-center p-8 rounded-[4px] border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group justify-between bg-gradient-to-b from-white to-amber-50/20"
                  spotlightColor="rgba(201, 162, 39, 0.25)"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Avatar Frame with Gold Accent */}
                    <div className="w-32 h-32 rounded-[4px] overflow-hidden flex items-center justify-center bg-slate-100 border border-[var(--cinefil-gold)] p-1 group-hover:scale-105 transition-transform duration-300 shadow-xs relative glow-gold">
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
                        className={`absolute inset-0 flex items-center justify-center bg-slate-50 ${
                          member.photo_url ? "hidden" : ""
                        }`}
                      >
                        <User size={48} className="text-[var(--cinefil-gold)]" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-6">
                      <h3
                        className="font-black text-lg sm:text-xl text-gray-950 tracking-tight leading-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {member.name}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--cinefil-gold)] bg-amber-100/80 px-3 py-1 rounded-[3px] border border-amber-300">
                        <Award size={13} /> {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Profile Link */}
                  <div className="mt-6 pt-4 border-t border-amber-100/80 w-full flex justify-center">
                    {member.biography || isLiveFeedSynced ? (
                      <button
                        onClick={() => onNavigate(`profile/${member.slug || member.id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[var(--cinefil-navy)] hover:bg-[var(--cinefil-navy-mid)] px-5 py-2 rounded-[3px] transition-all shadow-xs cursor-pointer"
                      >
                        <span>View Profile & Bio</span>
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                        <Sparkles size={13} className="text-[var(--cinefil-gold)]" />
                        <span>Honorary Board Dignitary</span>
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
