import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { memberService } from "../../../services/memberService";

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
    memberService.getTeams()
      .then((res) => {
        const teams = Array.isArray(res) ? res : res.results || [];
        const committeeTeam = teams.find((t: any) =>
          t.team_name.toLowerCase().includes("committee")
        );
        if (committeeTeam && committeeTeam.team_members && committeeTeam.team_members.length > 0) {
          const members = committeeTeam.team_members.map((tm: any) => ({
            id: tm.member.id,
            name: tm.member.full_name,
            role: tm.team_role || tm.member.role_title || "Member",
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
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <PageBanner title="COMMITTEE" subtitle="The standing committee overseeing day-to-day operations of CINEFIL." />
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Committee Members" />
          {loading || minimumLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex flex-col items-center text-center gap-3">
                  <div className="w-full aspect-square rounded-none bg-slate-200 animate-pulse" />
                  <div className="w-full space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {committeeMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center text-center gap-3 group">
                  <div
                    className="w-full aspect-square rounded-none flex items-center justify-center transition-all group-hover:shadow-lg bg-cover bg-center"
                    style={{
                      backgroundColor: "var(--cinefil-light-bg)",
                      border: "3px solid var(--cinefil-gold)",
                      backgroundImage: member.photo_url ? `url(${member.photo_url})` : "none"
                    }}
                  >
                    {!member.photo_url && <User size={44} style={{ color: "var(--cinefil-gold)", opacity: 0.5 }} />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}>
                      {member.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--cinefil-gold)" }}>{member.role}</p>
                    <button
                      onClick={() => onNavigate(`profile/${member.slug || member.id}`)}
                      className="text-xs mt-1.5 underline hover:opacity-70"
                      style={{ color: "var(--cinefil-muted)" }}
                    >
                      Know More
                    </button>
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