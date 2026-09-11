import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageBanner({ title, subtitle, badge }: PageBannerProps) {
  return (
    <div className="relative py-16 sm:py-20 text-center overflow-hidden bg-gradient-to-b from-[#000000] via-[#091726] to-[#0f2540] border-b border-[var(--cinefil-gold)]/20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Subtle floating gold particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#c9a227_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Optional Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-[3px] bg-[var(--cinefil-gold)]/15 border border-[var(--cinefil-gold)]/30 text-[var(--cinefil-gold)] text-[11px] font-bold tracking-widest uppercase mb-3 shadow-xs"
          >
            <Sparkles size={12} /> {badge}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-white font-extrabold tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
            lineHeight: 1.15,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </motion.h1>

        {/* Golden Underline Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-16 h-0.5 mx-auto mt-4 rounded-[2px] bg-gradient-to-r from-transparent via-[var(--cinefil-gold)] to-transparent"
        />

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-white/75 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
