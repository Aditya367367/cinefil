import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}>
      {badge && (
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[var(--cinefil-gold)] mb-2 px-3 py-1 rounded-full bg-[var(--cinefil-navy)]/5 border border-[var(--cinefil-gold)]/30">
          {badge}
        </span>
      )}
      <h2
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--cinefil-navy)] tracking-tight leading-tight"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      <div
        className={`h-1 w-16 mt-3 mb-4 rounded-full bg-gradient-to-r from-[var(--cinefil-gold)] to-[var(--cinefil-gold-light)] ${
          centered ? "mx-auto" : ""
        }`}
      />
      {subtitle && (
        <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
