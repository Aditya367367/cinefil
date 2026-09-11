import React, { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { NetflixPostersBackdrop } from "./NetflixPostersBackdrop";

interface CinematicBeamsHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  beamDensity?: number;
  speed?: number;
}

export function CinematicBeamsHero({
  className,
  beamDensity = 14,
  speed = 0.6,
  children,
  ...props
}: CinematicBeamsHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On mobile devices or touch screens, skip canvas rendering to keep 120Hz/60Hz buttery smooth
    const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || navigator.maxTouchPoints > 1);
    if (isMobile) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let time = 0;
    let animationFrameId: number;
    let isVisible = true;

    // Optimized particle count for smooth 60 FPS
    const particlesCount = 20;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.15,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    const resize = () => {
      if (!container || !canvas) return;
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    let lastDraw = 0;
    const draw = (timestamp: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // Cap to max ~45-60 FPS for battery & GPU efficiency
      if (timestamp - lastDraw < 16) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastDraw = timestamp;

      ctx.clearRect(0, 0, width, height);

      // Deep cinematic projector beams
      ctx.globalCompositeOperation = "screen";
      time += 0.012 * speed;

      const beamWidth = width / beamDensity;

      for (let i = 0; i <= beamDensity; i++) {
        const x = i * beamWidth + Math.sin(time + i * 0.3) * 12;
        const beamHeight = height * (0.6 + Math.sin(time * 0.4 + i * 0.8) * 0.25);
        const bWidth = beamWidth * (1.1 + Math.cos(time + i) * 0.3);

        // Gold projector beam
        const alphaGold = 0.08 + 0.05 * Math.sin(i * 0.4 + time);
        const gradGold = ctx.createLinearGradient(x, height, x, height - beamHeight);
        gradGold.addColorStop(0, `rgba(201, 162, 39, ${alphaGold})`);
        gradGold.addColorStop(0.6, `rgba(228, 185, 58, ${alphaGold * 0.4})`);
        gradGold.addColorStop(1, "rgba(201, 162, 39, 0)");

        ctx.fillStyle = gradGold;
        ctx.beginPath();
        ctx.moveTo(x - bWidth / 2, height);
        ctx.lineTo(x + bWidth / 2, height);
        ctx.lineTo(x + bWidth * 0.7, height - beamHeight);
        ctx.lineTo(x - bWidth * 0.7, height - beamHeight);
        ctx.closePath();
        ctx.fill();
      }

      // Draw floating golden particles
      ctx.globalCompositeOperation = "source-over";
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(time * 30 * p.pulseSpeed) * 0.004;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `rgba(240, 192, 64, ${Math.max(0.1, Math.min(0.8, p.opacity))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    // Pause when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    window.addEventListener("resize", resize, { passive: true });
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [beamDensity, speed]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden bg-gradient-to-b from-[#000000] via-[#0b1b2d] to-[#183858]", className)}
      {...props}
    >
      {/* Netflix-style scrolling film poster background — deepest layer */}
      <NetflixPostersBackdrop />

      {/* Dynamic Animated Canvas on Desktop only */}
      <canvas
        ref={canvasRef}
        className="hidden md:block absolute inset-0 pointer-events-none w-full h-full"
      />

      {/* Atmospheric Vignette & Radial Spotlight Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 20%, rgba(201, 162, 39, 0.18) 0%, rgba(15, 37, 64, 0.65) 55%, rgba(0, 0, 0, 0.95) 100%)",
        }}
      />

      {/* Children content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

