import { useEffect, useState } from "react";
import { User, ChevronRight, Sparkles, Users } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { memberService } from "../../../services/memberService";
import { SpotlightCard } from "../../../components/ui/SpotlightCard";

interface CommitteeMember {
  id: number;
  name: string;
  role: string;
  photo_url?: string;
  slug?: string;
  biography?: string;
}

export function CommitteePage({ onNavigate }: { onNavigate: (page: string, state?: any) => void }) {
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [minimumLoading, setMinimumLoading] = useState(true);

  useEffect(() => {
    memberService
      .getTeams()
      .then((res) => {
        const teams = Array.isArray(res) ? res : res.results || [];
        const committeeTeam = teams.find((t: any) =>
          t.team_name.toLowerCase().includes("committee")
        );
        if (committeeTeam && committeeTeam.team_members && committeeTeam.team_members.length > 0) {
          const members = committeeTeam.team_members.map((tm: any) => ({
            id: tm.member.id,
            name: tm.member.full_name,
            role: tm.team_role || tm.member.role_title || "Committee Member",
            photo_url: tm.member.photo_url,
            slug: tm.member.slug,
            biography: tm.member.biography,
          }));
          setCommitteeMembers(members);
        }
      })
      .catch((err) => {
        console.error("Failed to load committee members.", err);
      })
      .finally(() => {
        setLoading(false);
      });

    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-[#f8fafc] min-h-screen">
      <PageBanner
        title="OPERATIONAL COMMITTEE"
        subtitle="The standing operational committee overseeing administrative execution and day-to-day statutory operations of CINEFIL."
        badge="Executive Operations"
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Standing Committee Members"
            subtitle="Dedicated leaders facilitating member applications, verification protocols, and public performance compliance."
            badge="Administration"
          />

          {loading || minimumLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6 mt-10">
              {committeeMembers.map((member) => (
                <SpotlightCard
                  key={member.id}
                  className="flex flex-col items-center text-center p-5 rounded-2xl border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group justify-between bg-white min-h-[260px]"
                  spotlightColor="rgba(201, 162, 39, 0.2)"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Avatar Frame */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-100 border-2 border-[var(--cinefil-gold)] p-0.5 group-hover:scale-105 transition-transform duration-300 shadow-md relative">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-xl"
                          loading="lazy"
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
                        <User size={36} className="text-[var(--cinefil-gold)]" />
                      </div>
                    </div>

                    <div className="mt-4 px-1">
                      <h3
                        className="font-bold text-sm sm:text-base text-gray-900 tracking-tight leading-tight line-clamp-2 group-hover:text-[var(--cinefil-navy)] transition-colors"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {member.name}
                      </h3>
                      <span className="mt-1 inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--cinefil-gold)] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 w-full flex justify-center">
                    <button
                      onClick={() => onNavigate(`profile/${member.slug || member.id}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--cinefil-navy)] bg-slate-100 hover:bg-[var(--cinefil-navy)] hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <span>View Profile</span>
                      <ChevronRight size={12} />
                    </button>
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
