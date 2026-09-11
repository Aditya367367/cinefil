import { useEffect, useState, useRef } from "react";
import api from "../../services/api";

interface PosterItem {
  id: number;
  title: string;
  language: string;
  release_year: number;
  producer_name: string;
  poster_url: string;
  accent_color: string;
}

interface NetflixPostersBackdropProps {
  className?: string;
}

const FALLBACK_POSTERS: PosterItem[] = [
  { id: 1,  title: "RRR",                    language: "Telugu",    release_year: 2022, producer_name: "DVV Entertainment",      poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80&auto=format&fit=crop", accent_color: "#eab308" },
  { id: 2,  title: "KGF Chapter 2",           language: "Kannada",   release_year: 2022, producer_name: "Hombale Films",          poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80&auto=format&fit=crop", accent_color: "#f59e0b" },
  { id: 3,  title: "Ponniyin Selvan",         language: "Tamil",     release_year: 2022, producer_name: "Lyca Productions",       poster_url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80&auto=format&fit=crop", accent_color: "#d97706" },
  { id: 4,  title: "Dangal",                  language: "Hindi",     release_year: 2016, producer_name: "Aamir Khan Productions", poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80&auto=format&fit=crop", accent_color: "#3b82f6" },
  { id: 5,  title: "Baahubali 2",             language: "Telugu",    release_year: 2017, producer_name: "Arka Media Works",       poster_url: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&q=80&auto=format&fit=crop", accent_color: "#e11d48" },
  { id: 6,  title: "Kantara",                 language: "Kannada",   release_year: 2022, producer_name: "Hombale Films",          poster_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80&auto=format&fit=crop", accent_color: "#10b981" },
  { id: 7,  title: "Pushpa: The Rise",        language: "Telugu",    release_year: 2021, producer_name: "Mythri Movie Makers",    poster_url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80&auto=format&fit=crop", accent_color: "#ef4444" },
  { id: 8,  title: "Vikram",                  language: "Tamil",     release_year: 2022, producer_name: "Raaj Kamal Films",       poster_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80&auto=format&fit=crop", accent_color: "#6366f1" },
  { id: 9,  title: "Drishyam 2",              language: "Malayalam", release_year: 2021, producer_name: "Aashirvad Cinemas",      poster_url: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&q=80&auto=format&fit=crop", accent_color: "#06b6d4" },
  { id: 10, title: "Brahmastra",              language: "Hindi",     release_year: 2022, producer_name: "Star Studios",           poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80&auto=format&fit=crop", accent_color: "#8b5cf6" },
  { id: 11, title: "Sholay",                  language: "Hindi",     release_year: 1975, producer_name: "Sippy Films",            poster_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80&auto=format&fit=crop", accent_color: "#ca8a04" },
  { id: 12, title: "Lagaan",                  language: "Hindi",     release_year: 2001, producer_name: "Aamir Khan Productions", poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80&auto=format&fit=crop", accent_color: "#ea580c" },
  { id: 13, title: "3 Idiots",                language: "Hindi",     release_year: 2009, producer_name: "Vinod Chopra Films",     poster_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80&auto=format&fit=crop", accent_color: "#22c55e" },
  { id: 14, title: "Mughal-E-Azam",           language: "Hindi",     release_year: 1960, producer_name: "Sterling Investment",    poster_url: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=400&q=80&auto=format&fit=crop", accent_color: "#f43f5e" },
  { id: 15, title: "Devdas",                  language: "Hindi",     release_year: 2002, producer_name: "Mega Bollywood",         poster_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80&auto=format&fit=crop", accent_color: "#a855f7" },
  { id: 16, title: "2.0",                     language: "Tamil",     release_year: 2018, producer_name: "Lyca Productions",       poster_url: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&q=80&auto=format&fit=crop", accent_color: "#14b8a6" },
  { id: 17, title: "Uri: The Surgical Strike", language: "Hindi",    release_year: 2019, producer_name: "RSVP Movies",            poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80&auto=format&fit=crop", accent_color: "#f59e0b" },
  { id: 18, title: "Tumbbad",                 language: "Hindi",     release_year: 2018, producer_name: "Colour Yellow",          poster_url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80&auto=format&fit=crop", accent_color: "#dc2626" },
  { id: 19, title: "Super 30",                language: "Hindi",     release_year: 2019, producer_name: "Reliance Entertainment", poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80&auto=format&fit=crop", accent_color: "#0ea5e9" },
  { id: 20, title: "Padmaavat",               language: "Hindi",     release_year: 2018, producer_name: "Bhansali Productions",   poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80&auto=format&fit=crop", accent_color: "#ec4899" },
];

const NUM_COLS = 6;

function splitIntoColumns(items: PosterItem[], cols: number): PosterItem[][] {
  const out: PosterItem[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => out[i % cols].push(item));
  return out.map((col) => {
    let c = [...col];
    while (c.length < 10) c = [...c, ...col];
    return c;
  });
}

function PosterCard({ poster }: { poster: PosterItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "2/3",
        borderRadius: "3px",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        boxShadow: "0 8px 24px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.13)",
        willChange: "transform",
      }}
    >
      {!imgError ? (
        <img
          src={poster.poster_url}
          alt={poster.title}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(145deg, #0f2540 0%, ${poster.accent_color}66 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
          }}
        >
          🎬
        </div>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.08) 42%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "7px 5px 5px",
        }}
      >
        <p
          style={{
            color: "#fff",
            fontSize: "8px",
            fontWeight: 700,
            lineHeight: 1.3,
            margin: 0,
            textShadow: "0 1px 4px rgba(0,0,0,0.9)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {poster.title}
        </p>
        <p
          style={{
            color: poster.accent_color,
            fontSize: "6.5px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "2px 0 0",
          }}
        >
          {poster.language} · {poster.release_year}
        </p>
      </div>
    </div>
  );
}

interface MarqueeColumnProps {
  posters: PosterItem[];
  direction: "up" | "down";
  speed: number;
}

function MarqueeColumn({ posters, direction, speed }: MarqueeColumnProps) {
  const items = [...posters, ...posters];
  const colRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);

  useEffect(() => {
    const el = colRef.current;
    if (!el) return;

    const init = requestAnimationFrame(() => {
      const halfH = el.scrollHeight / 2;
      if (direction === "down") posRef.current = -halfH / 2;

      let lastTs: number | null = null;
      const tick = (ts: number) => {
        if (lastTs === null) lastTs = ts;
        const delta = (ts - lastTs) / 1000;
        lastTs = ts;

        posRef.current += (direction === "up" ? -1 : 1) * speed * delta;
        if (direction === "up"   && posRef.current <= -halfH) posRef.current += halfH;
        if (direction === "down" && posRef.current >= 0)      posRef.current -= halfH;

        el.style.transform = `translateY(${posRef.current}px)`;
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(init);
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [direction, speed, posters.length]);

  return (
    <div
      ref={colRef}
      style={{ display: "flex", flexDirection: "column", gap: "8px", willChange: "transform" }}
    >
      {items.map((poster, i) => (
        <PosterCard key={`${poster.id}-${i}`} poster={poster} />
      ))}
    </div>
  );
}

export function NetflixPostersBackdrop({ className = "" }: NetflixPostersBackdropProps) {
  const [posters, setPosters] = useState<PosterItem[]>(FALLBACK_POSTERS);

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ success: boolean; results: PosterItem[] }>("/films/hero-posters/")
      .then((res) => {
        if (!cancelled && res.data?.results?.length) setPosters(res.data.results);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const columns = splitIntoColumns(posters, NUM_COLS);
  const speeds: number[]             = [34, 24, 46, 28, 42, 32];
  const dirs: Array<"up" | "down">   = ["up", "down", "up", "down", "up", "down"];

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        // Fill the hero container completely, overflow is clipped by parent
        position: "absolute",
        top: "-8%",
        left: "-4%",
        right: "-4%",
        bottom: "-8%",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* 6-column full-viewport poster grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${NUM_COLS}, 1fr)`,
          gap: "8px",
          alignItems: "flex-start",
          // Shallow perspective tilt for cinematic depth
          transform: "rotateX(5deg) scale(1.1)",
          transformOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          // BRIGHTER: was 0.38 opacity, now 0.72 + brightness 1.05
          opacity: 0.72,
          filter: "brightness(1.05) saturate(1.3) contrast(0.95)",
        }}
      >
        {columns.map((col, i) => (
          <MarqueeColumn key={i} posters={col} direction={dirs[i]} speed={speeds[i]} />
        ))}
      </div>

      {/* Lighter vignette so posters stay visible but text remains readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            "radial-gradient(ellipse 95% 75% at 50% 50%, transparent 0%, rgba(6,14,24,0.28) 60%, rgba(6,14,24,0.75) 100%)",
            "linear-gradient(to bottom, rgba(4,10,20,0.50) 0%, transparent 18%, transparent 80%, rgba(4,10,20,0.75) 100%)",
          ].join(", "),
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}
