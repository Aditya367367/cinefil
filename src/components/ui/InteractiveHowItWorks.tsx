import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, FileCheck2, Coins, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import type { Page } from "../../app/components/pages/Navbar";

interface Step {
  id: number;
  icon: React.ElementType;
  stepNum: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  ctaText: string;
  ctaTarget: Page;
  color: string;
}

const steps: Step[] = [
  {
    id: 0,
    icon: ShieldCheck,
    stepNum: "01",
    title: "Producers Register Catalog",
    subtitle: "Copyright Safeguard under Sec. 33(3)",
    description:
      "Film producers and copyright owners assign public performance rights of their cinematograph films to CINEFIL. We maintain an authoritative national repertoire protecting titles across multiple languages and formats.",
    highlights: [
      "Official registration under Copyright Act 1957",
      "PAN-India & overseas territory protection",
      "Zero registration hassle with seamless portal",
    ],
    ctaText: "Become a Member",
    ctaTarget: "producers-owners",
    color: "#c9a227",
  },
  {
    id: 1,
    icon: FileCheck2,
    stepNum: "02",
    title: "Businesses Obtain License",
    subtitle: "Authorized Public Performance (CPL)",
    description:
      "Venues, hotels, screens, transport operators, and broadcasters obtain a legal Cinematograph Performance License (CPL). Avoid copyright infringement penalties and ensure lawful public exhibition.",
    highlights: [
      "Transparent statutory tariff structure",
      "Instant compliance certificate upon issuance",
      "Broad repertoire covering 1000+ films",
    ],
    ctaText: "Apply for Licence",
    ctaTarget: "license-form",
    color: "#38bdf8",
  },
  {
    id: 2,
    icon: Coins,
    stepNum: "03",
    title: "Transparent Royalties",
    subtitle: "Direct Distribution to Rightsholders",
    description:
      "Licence royalties collected from all public performance venues are distributed directly, transparently, and equitably to the respective producers and creators according to log data and national tariffs.",
    highlights: [
      "Itemized digital distribution statements",
      "Audited accounts overseen by Governing Board",
      "Direct bank transfers for verified members",
    ],
    ctaText: "Explore Schemes",
    ctaTarget: "schemes",
    color: "#10b981",
  },
];

interface InteractiveHowItWorksProps {
  onNavigate: (page: Page) => void;
}

export function InteractiveHowItWorks({ onNavigate }: InteractiveHowItWorksProps) {
  const [activeStep, setActiveStep] = useState(0);
  const current = steps[activeStep];
  const IconComponent = current.icon;

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#0f2540] to-[#0a1828] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(201,162,39,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[3px] bg-[var(--cinefil-gold)]/15 border border-[var(--cinefil-gold)]/30 text-[var(--cinefil-gold)] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={13} /> The CINEFIL Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Copyright Protection & Licensing Works
          </h2>
          <p className="mt-3 text-white/70 text-sm sm:text-base leading-relaxed">
            A seamless statutory framework connecting Indian film creators with commercial exhibition venues.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {steps.map((s, idx) => {
            const StepIcon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-4 p-5 rounded-[4px] border text-left transition-all duration-200 relative overflow-hidden group ${
                  isActive
                    ? "bg-[#163354] border-[var(--cinefil-gold)] shadow-md shadow-black/30 scale-[1.01]"
                    : "bg-[#0d2036] border-white/10 hover:bg-[#122842] hover:border-white/25"
                }`}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--cinefil-gold)]" />
                )}
                <div
                  className={`p-3 rounded-[4px] transition-colors ${
                    isActive
                      ? "bg-[var(--cinefil-gold)] text-[var(--cinefil-navy)] font-bold shadow-sm"
                      : "bg-white/10 text-white/80 group-hover:text-white"
                  }`}
                >
                  <StepIcon size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--cinefil-gold)]">
                    Step {s.stepNum}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {s.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="p-6 sm:p-10 rounded-[4px] bg-[#0f243c] border border-white/15 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-[var(--cinefil-gold)]/20 text-[var(--cinefil-gold)] text-xs font-bold uppercase tracking-wider">
                  Phase {current.stepNum} · {current.subtitle}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {current.title}
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  {current.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5 pt-2">
                  {current.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                      <CheckCircle2 size={17} className="text-[var(--cinefil-gold)] flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onNavigate(current.ctaTarget)}
                    className="px-6 py-3 rounded-[4px] font-bold text-sm flex items-center gap-2 transition-all transform hover:scale-[1.02] shadow-sm cursor-pointer"
                    style={{
                      backgroundColor: "var(--cinefil-gold)",
                      color: "var(--cinefil-navy)",
                    }}
                  >
                    {current.ctaText} <ArrowRight size={16} />
                  </button>
                  <span className="text-xs text-white/50">
                    Need guidance? Contact our legal cell anytime.
                  </span>
                </div>
              </div>

              {/* Visual Spotlight Graphic */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square rounded-[4px] p-8 bg-gradient-to-tr from-white/[0.08] to-white/[0.02] border border-white/20 flex flex-col items-center justify-center text-center shadow-inner group">
                  <div className="absolute inset-0 rounded-[4px] bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.2)_0%,transparent_70%)] pointer-events-none" />
                  
                  <div className="w-20 h-20 rounded-[4px] bg-[var(--cinefil-gold)]/20 border border-[var(--cinefil-gold)] flex items-center justify-center text-[var(--cinefil-gold)] mb-6 shadow-md animate-pulse-slow">
                    <IconComponent size={40} />
                  </div>

                  <p className="text-lg font-bold text-white tracking-wide">
                    {current.title}
                  </p>
                  <p className="text-xs text-white/60 mt-1 max-w-xs">
                    {current.subtitle}
                  </p>
                  
                  <div className="mt-6 inline-block px-3 py-1 rounded-[3px] bg-white/10 text-[11px] text-[var(--cinefil-gold)] font-mono">
                    Statutory Protocol Section 33(3)
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
