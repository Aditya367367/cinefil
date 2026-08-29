import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  Download,
  ShieldCheck,
  Film,
  Sparkles,
  Users,
  Tv,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Globe2,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { SectionHeader } from "./SectionHeader";
import type { Page } from "./Navbar";
import { industryService } from "../../../services/industryService";
import announcementService, { Announcement } from "../../../services/announcementService";
import statsService, { SiteStats } from "../../../services/statsService";
import { HomePageSkeleton } from "./HomePageSkeleton";
import { CinematicBeamsHero } from "../../../components/ui/CinematicBeamsHero";
import { SpotlightCard } from "../../../components/ui/SpotlightCard";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";
import { FilmStripMarquee } from "../../../components/ui/FilmStripMarquee";
import { InteractiveHowItWorks } from "../../../components/ui/InteractiveHowItWorks";
import { AnnouncementTicker } from "../../../components/ui/AnnouncementTicker";
import "../../../styles/HomePage.css";

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
        if (response.results && response.results.length > 0) {
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

  const isInitialLoading = industriesLoading || announcementsLoading || statsLoading;

  if (isInitialLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-[#f8fafc] overflow-hidden">
      {/* Live Announcement Bar */}
      <AnnouncementTicker announcements={announcements} />

      {/* Cinematic Beams Hero */}
      <CinematicBeamsHero className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-6 relative z-20">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full border backdrop-blur-md shadow-lg"
              style={{
                color: "var(--cinefil-gold)",
                borderColor: "rgba(201, 162, 39, 0.4)",
                backgroundColor: "rgba(15, 37, 64, 0.6)",
              }}
            >
              <ShieldCheck size={14} className="text-[var(--cinefil-gold)]" />
              Copyright Society · Govt. of India Registered
            </span>
          </motion.div>

          {/* Main Hero Headline with Cinematic Shimmer */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-white max-w-4xl px-4 font-black tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 6.5vw, 4.25rem)",
              lineHeight: 1.15,
              textShadow: "0 4px 20px rgba(0,0,0,0.7)",
            }}
          >
            CINEFIL PRODUCERS
            <br />
            <span className="gold-shimmer-text">PERFORMANCE LIMITED</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-white/80 max-w-2xl text-base sm:text-lg leading-relaxed px-4 font-normal"
          >
            Registered under Section 33(3) of the Copyright Act 1957. Empowering film producers,
            protecting cinematograph rights, and issuing statutory public performance licenses PAN-India & Overseas.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap gap-4 justify-center px-4 pt-3"
          >
            <button
              onClick={() => (user?.is_member ? onNavigate("member-dashboard") : onNavigate("producers-owners"))}
              className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 shadow-xl relative overflow-hidden group cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #c9a227 0%, #f0c040 100%)",
                color: "var(--cinefil-navy)",
                boxShadow: "0 8px 25px rgba(201, 162, 39, 0.35)",
              }}
            >
              {/* Button light shimmer sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform pointer-events-none" />
              <Sparkles size={18} />
              <span>{user?.is_member ? "Member Dashboard" : "Become a Member"}</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("license-form")}
              className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base border-2 border-white/40 text-white flex items-center gap-2.5 transition-all hover:bg-white/10 hover:border-white transform hover:scale-105 active:scale-95 backdrop-blur-md cursor-pointer"
            >
              <Tv size={18} className="text-[var(--cinefil-gold)]" />
              <span>Get a Licence (CPL)</span>
            </button>
          </motion.div>

          {/* Mini Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-white/70"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[var(--cinefil-gold)]" /> Statutory Protection
            </span>
            <span className="flex items-center gap-1.5">
              <Lock size={15} className="text-[var(--cinefil-gold)]" /> Central Govt. Registered
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 size={15} className="text-[var(--cinefil-gold)]" /> PAN-India & Overseas
            </span>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-10 sm:h-14" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,60 C360,10 1080,10 1440,60 L1440,60 L0,60 Z" fill="#0a1420" />
          </svg>
        </div>
      </CinematicBeamsHero>

      {/* Film Strip Infinite Marquee */}
      <FilmStripMarquee />

      {/* Stats Counter Section with 21st.dev Spotlight Cards */}
      <section className="py-16 sm:py-20 bg-[#0f2540] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--cinefil-gold)]">
              Authorized National Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Guarding India's Cinematograph Legacy
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                num: stats?.member_count ? `${stats.member_count}+` : "700+",
                label: "Registered Producers",
                sub: "Indian film rights owners",
                icon: Users,
              },
              {
                num: stats?.film_count ? `${stats.film_count}+` : "1,000+",
                label: "Films in Repertoire",
                sub: "Multi-lingual catalog",
                icon: Film,
              },
              {
                num: "33(3)",
                label: "Copyright Act 1957",
                sub: "Statutory authorization",
                icon: ShieldCheck,
              },
              {
                num: "PAN-India",
                label: "Jurisdiction & Overseas",
                sub: "Public performance enforcement",
                icon: Globe2,
              },
            ].map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <SpotlightCard
                  key={idx}
                  className="p-6 sm:p-8 text-center bg-white/[0.05] border-white/10 text-white backdrop-blur-md hover:border-[var(--cinefil-gold)]/50"
                  spotlightColor="rgba(201, 162, 39, 0.25)"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--cinefil-gold)]/15 border border-[var(--cinefil-gold)]/30 flex items-center justify-center text-[var(--cinefil-gold)]">
                    <StatIcon size={24} />
                  </div>
                  <p
                    className="text-3xl sm:text-5xl font-black text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <AnimatedCounter value={stat.num} />
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[var(--cinefil-gold)] mt-2">
                    {stat.label}
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {stat.sub}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive 3-Step Conversion Funnel */}
      <InteractiveHowItWorks onNavigate={onNavigate} />

      {/* Businesses that Require Licence */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Commercial Sectors Requiring CINEFIL Licence"
            subtitle="If your commercial establishment communicates cinematograph film content to the public via TV, LED walls, screens, or projection, an authorized CPL is mandatory by law."
          />

          {industriesLoading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[var(--cinefil-gold)] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 mt-3">Loading licensing sectors...</p>
            </div>
          )}

          {industriesError && (
            <div className="text-center py-8 text-red-500 text-sm">
              <p>{industriesError}</p>
            </div>
          )}

          {!industriesLoading && !industriesError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
              {industries.map((industry) => (
                <div
                  key={industry.id}
                  onClick={() => onNavigate("license-form")}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer border border-gray-100 aspect-[4/3]"
                >
                  <img
                    src={industry.photo}
                    alt={industry.industry_name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-85 group-hover:opacity-100"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 flex flex-col justify-end p-6 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cinefil-gold)]">
                          Licensing Category
                        </span>
                        <h3 className="text-white text-lg sm:text-xl font-bold leading-tight mt-0.5">
                          {industry.industry_name}
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[var(--cinefil-gold)] text-[var(--cinefil-navy)] flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                    <p className="text-xs text-white/70 mt-2 line-clamp-2">
                      {industry.description || "Authorized Cinematograph Performance License for commercial exhibition."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Apply Banner inside Business section */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-[#0f2540] to-[#183858] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[var(--cinefil-gold)]/30">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Not sure if your business needs a licence?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl">
                Our licensing officers provide instant tariff assessment according to your venue size and screen capacity.
              </p>
            </div>
            <button
              onClick={() => onNavigate("license-form")}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-[var(--cinefil-gold)] text-[var(--cinefil-navy)] hover:bg-[var(--cinefil-gold-light)] transition-all flex items-center gap-2 shadow-lg flex-shrink-0 cursor-pointer"
            >
              Get Tariff Assessment <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* About CINEFIL & Repertoire Overview */}
      <section className="py-20 bg-[#f4f5f7] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--cinefil-navy)]">
                  About the Society
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--cinefil-navy)] mt-1">
                  Empowering Creators, Administering Rights
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                <strong>CINEFIL PRODUCERS PERFORMANCE LTD (CINEFIL)</strong> is a registered Copyright Society under Section 33(3) of the Copyright Act 1957 for Cinematograph Film Works. Founded and governed by Indian film producers and owners, CINEFIL collects and distributes statutory royalties from public performance venues across India and Overseas.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                Under Section 34 of the Copyright Act 1957, CINEFIL administers authorizations across cinema chains, OTT networks, hotels, transport hubs, and public commercial venues.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate("governance")}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-[var(--cinefil-navy)] text-white hover:bg-[var(--cinefil-navy-mid)] transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  Governance & Board <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => onNavigate("films")}
                  className="px-6 py-3 rounded-xl font-bold text-sm border-2 border-[var(--cinefil-navy)] text-[var(--cinefil-navy)] hover:bg-[var(--cinefil-navy)] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  Search Film Catalog <Film size={16} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <SpotlightCard
                className="p-6 bg-white shadow-xl border-gray-100"
                spotlightColor="rgba(24, 56, 88, 0.15)"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">National Registration</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Statutory registration granted by the Ministry of Commerce and Industry, Copyright Office, Govt. of India.
                    </p>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard
                className="p-6 bg-white shadow-xl border-gray-100"
                spotlightColor="rgba(24, 56, 88, 0.15)"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-sky-100 text-sky-800">
                    <Film size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Comprehensive Repertoire</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Protecting feature films, short films, and documentaries across Hindi, Tamil, Telugu, Malayalam, Bengali, and all regional languages.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* Official Copyright Certificate Download Banner */}
      <div
        className="py-10 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a1828 0%, #183858 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="text-left">
            <p className="font-bold text-base sm:text-lg text-[var(--cinefil-gold)]">
              Copyright Registration through Copyright Office Website, Government of India
            </p>
            <p className="text-xs text-white/60">
              Download statutory documentation, certificates, and tariff schedules.
            </p>
          </div>
          <button
            onClick={() => onNavigate("governance")}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-[var(--cinefil-gold)] text-[var(--cinefil-gold)] hover:bg-[var(--cinefil-gold)] hover:text-[var(--cinefil-navy)] transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-lg"
          >
            <Download size={15} /> Official Documents
          </button>
        </div>
      </div>
    </div>
  );
}
