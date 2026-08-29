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
    <div className="relative w-full bg-[#0a1420] py-4 overflow-hidden border-y border-[var(--cinefil-gold)]/25">
      {/* Film Sprocket Perforations Top */}
      <div className="flex justify-between w-[200%] mb-2 opacity-30 select-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="w-3 h-2 bg-white/40 rounded-sm inline-block mx-2" />
        ))}
      </div>

      {/* Infinite scrolling track */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-6">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3.5 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[var(--cinefil-gold)]/40 hover:bg-white/[0.08] transition-all duration-200 cursor-default backdrop-blur-sm"
          >
            <div className="p-2 rounded-lg bg-[var(--cinefil-navy)]/80 border border-[var(--cinefil-gold)]/30">
              {item.icon}
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5">
                {item.label}
              </p>
              <p className="text-[10px] sm:text-xs text-white/50 tracking-wider">
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Film Sprocket Perforations Bottom */}
      <div className="flex justify-between w-[200%] mt-2 opacity-30 select-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="w-3 h-2 bg-white/40 rounded-sm inline-block mx-2" />
        ))}
      </div>

      {/* Left and Right Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a1420] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a1420] to-transparent pointer-events-none z-10" />
    </div>
  );
}
