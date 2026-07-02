interface PageBannerProps {
  title: string;
  subtitle?: string;
}

export function PageBanner({ title, subtitle }: PageBannerProps) {
  return (
    <div
      className="py-16 text-center"
      style={{ background: "linear-gradient(180deg, #000000 0%, #183858 100%)" }}
    >
      <h1
        className="text-white"
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.6rem)", letterSpacing: "0.04em" }}
      >
        {title}
      </h1>
      <div className="w-16 h-0.5 mx-auto mt-3" style={{ backgroundColor: "var(--cinefil-gold)" }} />
      {subtitle && (
        <p className="mt-3 text-white/60 text-sm max-w-xl mx-auto px-4">{subtitle}</p>
      )}
    </div>
  );
}
