interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 
        className="mb-4 text-3xl font-semibold leading-tight tracking-tight"
        style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      <div
        className={`h-1 w-16 mb-6 ${centered ? "mx-auto" : ""}`}
        style={{ backgroundColor: "var(--cinefil-red-accent)" }}
      />
      {subtitle && (
        <p
          className={`text-base leading-relaxed max-w-2xl ${centered ? "mx-auto" : ""}`}
          style={{ color: "var(--cinefil-muted)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
