import { ChevronRight, Download, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { SectionHeader } from "./SectionHeader";
import type { Page } from "./Navbar";
import { industryService } from "../../services/industryService";
import announcementService, { Announcement } from "../../services/announcementService";
import statsService, { SiteStats } from "../../services/statsService";
import { HomePageSkeleton } from "./HomePageSkeleton";
import "../../styles/HomePage.css";


interface Industry {
  id: number;
  industry_name: string;
  description: string;
  photo: string;
}

const initialAnnouncements: Announcement[] = [
  { id: 1, title: "AGM NOTICE 2026", date: "2026-06-01", file: null, is_active: true, created_at: "" },
  { id: 2, title: "MEDICAL CAMP 31-03-2026", date: "2026-03-31", file: null, is_active: true, created_at: "" },
];

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [industriesLoading, setIndustriesLoading] = useState(true);
  const [industriesError, setIndustriesError] = useState<string | null>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);

  const [stats, setStats] = useState<SiteStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setIndustriesLoading(true);
        const response = await industryService.getIndustries();
        setIndustries(response.results);
        setIndustriesError(null);
      } catch (err) {
        setIndustriesError("Failed to fetch industries. Please try again later.");
        console.error(err);
      } finally {
        setIndustriesLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        setAnnouncementsLoading(true);
        const response = await announcementService.getAnnouncements();
        if (response.results.length > 0) {
          setAnnouncements(response.results);
        }
        setAnnouncementsError(null);
      } catch (err) {
        setAnnouncementsError("Failed to fetch announcements.");
        console.error(err);
      } finally {
        setAnnouncementsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await statsService.getStats();
        setStats(response);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchIndustries();
    fetchAnnouncements();
    fetchStats();
  }, []);

  // Show skeleton while initial data is loading
  const isInitialLoading = industriesLoading || announcementsLoading || statsLoading;

  if (isInitialLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Hero */}
      <div
        className="relative w-full overflow-hidden hero-bg-animation"
        style={{ background: "linear-gradient(180deg, #000000 0%, #183858 100%)", minHeight: 440 }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center gap-6">
          <span
            className="text-xs font-semibold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full border"
            style={{ color: "var(--cinefil-gold)", borderColor: "var(--cinefil-gold)" }}
          >
            Copyright Society · Est. India
          </span>
          <h1
            className="text-white max-w-3xl px-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 6vw, 3.5rem)",
              lineHeight: 1.2,
              letterSpacing: "0.03em",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            CINEFIL PRODUCERS
            <br />
            <span style={{ color: "var(--cinefil-gold)" }}>PERFORMANCE LIMITED</span>
          </h1>
          <p className="text-white/70 max-w-xl text-base sm:text-lg leading-relaxed px-4">
            A Copyright Society registered under the Central Government, managing Cinematograph Film Work
            public performance rights across India and Overseas.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center px-4">
            <button
              onClick={() => (user?.is_member ? onNavigate("member-dashboard") : onNavigate("producers-owners"))}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-md font-bold text-sm sm:text-base flex items-center gap-2 transition-all transform hover:scale-105"
              style={{
                background: "linear-gradient(45deg, var(--cinefil-gold), var(--cinefil-gold-light))",
                color: "var(--cinefil-navy)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            >
              {user?.is_member ? "Member Dashboard" : "Become a Member"} <ChevronRight size={18} />
            </button>
            <button
              onClick={() => onNavigate("license-form")}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-md font-bold text-sm sm:text-base border-2 border-white/50 text-white flex items-center gap-2 transition-all hover:bg-white/10 hover:border-white"
            >
              Get a Licence
            </button>
          </div>
        </div>

        {/* Wave */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: 60 }}>
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>

      {/* Announcements */}
      <div style={{ backgroundColor: "var(--cinefil-light-bg)" }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {announcementsLoading && <p className="text-center text-sm">Loading announcements...</p>}
          {announcementsError && <p className="text-center text-sm text-red-500">{announcementsError}</p>}
          {!announcementsLoading && !announcementsError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 px-6 py-5 rounded-xl bg-white shadow-lg border-l-4 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]"
                  style={{ borderLeftColor: "var(--cinefil-gold)" }}
                  onClick={() => a.file && window.open(a.file, '_blank')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      a.file && window.open(a.file, '_blank');
                    }
                  }}
                >
                  <span style={{ color: "var(--cinefil-gold)" }}><Bell size={20} /></span>
                  <div>
                    <p className="font-bold text-base" style={{ color: "var(--cinefil-navy)" }}>{a.title}</p>
                    <p className="text-sm" style={{ color: "var(--cinefil-muted)" }}>
                      {new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <ChevronRight size={18} className="ml-auto" style={{ color: "var(--cinefil-muted)" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Are you using... */}
      <div className="py-8 sm:py-12" style={{ background: "linear-gradient(180deg, #0f2540 0%, #183858 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-semibold text-base sm:text-lg px-4" style={{ color: "var(--cinefil-gold)", fontFamily: "var(--font-heading)" }}>
            Are you using Television, LCD Screen, or any other device for communication to the public?
          </p>
          <p className="text-white/60 text-xs sm:text-sm mt-2 px-4">
            You may require a CINEFIL (Cinematograph Film) Performance License (CPL)
          </p>
          <button
            onClick={() => onNavigate("license-form")}
            className="mt-4 px-5 sm:px-6 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
            style={{ backgroundColor: "var(--cinefil-gold)", color: "var(--cinefil-navy)" }}
          >
            Apply for Licence
          </button>
        </div>
      </div>

      {/* Businesses */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Businesses That Require CINEFIL Licence"
            subtitle="If your business communicates film content to the public via any screen, you need a CPL."
          />
          {industriesLoading && (
            <div className="text-center">
              <p>Loading industries...</p>
            </div>
          )}
          {industriesError && (
            <div className="text-center text-red-500">
              <p>{industriesError}</p>
            </div>
          )}
          {!industriesLoading && !industriesError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => onNavigate("license-form")}
                  className="group relative overflow-hidden rounded-2xl shadow-lg transition-all transform hover:scale-[1.03] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[var(--cinefil-gold)] focus:ring-offset-2 aspect-[4/3]"
                >
                  <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm sm:text-lg font-bold px-2 text-center">{industry.industry_name}</p>
                  </div>
                  <img
                    src={industry.photo}
                    alt={industry.industry_name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About + Stats */}
      <section style={{ backgroundColor: "var(--cinefil-light-bg)" }} className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div>
              <SectionHeader title="CINEFIL Producers Performance Limited" centered={false} />
              <div className="space-y-4 sm:space-y-5 text-sm sm:text-base leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
                <p>
                  CINEFIL PRODUCERS PERFORMANCE LTD (CINEFIL) is a Copyright Society registered by the Central
                  Government under Section 33(3) of the Copyright Act 1957 for Cinematograph Film Work and its formed
                  by the Film Producers and Other Owners Film India (collectively referred as "Members") having the
                  object of collecting royalties from India and Overseas by issuing and granting Cinematograph Film
                  Work public performance License.
                </p>
                <p>
                  An Introduced Tariff (Tarrif) CINEFIL has obtained successive authorizations from its Author and
                  Other Owners transmitted to the associations of Sections 34 of the Copyright Act 1957. Presently,
                  members of CINEFIL are not less than 700 members which will be updated subsequently.
                </p>
                <button
                  onClick={() => onNavigate("governance")}
                  className="inline-flex items-center gap-2 text-sm sm:text-base font-bold mt-4 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--cinefil-gold)] focus:ring-offset-2 rounded px-2 py-1"
                  style={{ color: "var(--cinefil-gold)" }}
                >
                  Learn More <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { num: stats ? `${stats.member_count}+` : "700+", label: "Members" },
                { num: stats ? `${stats.film_count}+` : "1000+", label: "Films Registered" },
                { num: "33(3)", label: "Copyright Act" },
                { num: "PAN India", label: "Reach" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white p-4 sm:p-8 rounded-2xl text-center shadow-xl border-t-4 transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[var(--cinefil-gold)] focus:ring-offset-2"
                  style={{ borderTopColor: "var(--cinefil-gold)" }}
                >
                  <p
                    className="text-2xl sm:text-4xl font-extrabold"
                    style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-display)" }}
                  >
                    {stat.num}
                  </p>
                  <p className="text-xs sm:text-sm mt-2 font-semibold" style={{ color: "var(--cinefil-muted)" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Copyright banner */}
      <div
        className="py-8 sm:py-12 text-center"
        style={{ background: "linear-gradient(180deg, #0f2540 0%, #183858 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <p className="font-semibold text-sm sm:text-base px-2" style={{ color: "var(--cinefil-gold)", fontFamily: "var(--font-heading)" }}>
            Copyright Registration through Copyright Office Website, Government of India
          </p>
          <button
            onClick={() => onNavigate("governance")}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-semibold border text-white hover:border-[--cinefil-gold] transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[var(--cinefil-gold)] focus:ring-offset-2"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            <Download size={14} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}