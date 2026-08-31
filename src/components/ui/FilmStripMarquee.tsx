import React from "react";
import { Film, Clapperboard, Tv, Plane, Hotel, Radio, ShieldCheck, Award } from "lucide-react";

interface MarqueeItem {
  icon: React.ReactNode;
  label: string;
  sub: string;
}

const marqueeItems: MarqueeItem[] = [
  { icon: <Film size={18} className="text-[var(--cinefil-gold)]" />, label: "Cinematograph Films", sub: "Section 33(3) Rights" },
  { icon: <Tv size={18} className="text-[var(--cinefil-gold)]" />, label: "Television & OTT", sub: "Commercial Broadcasting" },
  { icon: <Hotel size={18} className="text-[var(--cinefil-gold)]" />, label: "Hotels & Resorts", sub: "Public Screenings" },
  { icon: <Plane size={18} className="text-[var(--cinefil-gold)]" />, label: "Airlines & Transport", sub: "In-Transit Licensing" },
  { icon: <Clapperboard size={18} className="text-[var(--cinefil-gold)]" />, label: "700+ Producers", sub: "All-India Repertoire" },
  { icon: <ShieldCheck size={18} className="text-[var(--cinefil-gold)]" />, label: "Govt. Registered", sub: "Central Govt. Copyright" },
  { icon: <Radio size={18} className="text-[var(--cinefil-gold)]" />, label: "Events & Festivals", sub: "Public Performance License" },
  { icon: <Award size={18} className="text-[var(--cinefil-gold)]" />, label: "Royalty Distribution", sub: "Transparent & Direct" },
];

export function FilmStripMarquee() {
  return (
    <div className="relative w-full bg-[#0a1420] py-3.5 overflow-hidden border-y border-[var(--cinefil-gold)]/25">
      {/* Infinite scrolling track */}
      <div 
        className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4 sm:gap-6 py-1"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#0f233a] border border-white/10 hover:border-[var(--cinefil-gold)]/40 hover:bg-[#152e4d] transition-colors duration-150 cursor-default flex-shrink-0"
          >
            <div className="p-1.5 sm:p-2 rounded-lg bg-[var(--cinefil-navy)] border border-[var(--cinefil-gold)]/30 flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                {item.label}
              </p>
              <p className="text-[10px] sm:text-xs text-white/60 tracking-wider whitespace-nowrap">
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Left and Right Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#0a1420] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#0a1420] to-transparent pointer-events-none z-10" />
    </div>
  );
}

