import React, { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

interface CinematicBeamsHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  beamDensity?: number;
  speed?: number;
}

export function CinematicBeamsHero({
  className,
  beamDensity = 20,
  speed = 0.8,
  children,
  ...props
}: CinematicBeamsHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let time = 0;
    let animationFrameId: number;

    // Floating cinematic golden particles
    const particlesCount = 45;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2, // float upwards like dust in a projector beam
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep cinematic projector beams (Gold & Cyan/Navy hues)
      ctx.globalCompositeOperation = "screen";
      time += 0.015 * speed;

      const beamWidth = width / beamDensity;

      for (let i = 0; i <= beamDensity; i++) {
        const x = i * beamWidth + Math.sin(time + i * 0.3) * 15;
        const beamHeight = height * (0.65 + Math.sin(time * 0.5 + i * 0.8) * 0.3);
        const bWidth = beamWidth * (1.2 + Math.cos(time + i) * 0.4);

        // Gold projector beam
        const alphaGold = 0.12 + 0.08 * Math.sin(i * 0.4 + time);
        const gradGold = ctx.createLinearGradient(x, height, x, height - beamHeight);
        gradGold.addColorStop(0, `rgba(201, 162, 39, ${alphaGold})`);
        gradGold.addColorStop(0.5, `rgba(228, 185, 58, ${alphaGold * 0.6})`);
        gradGold.addColorStop(1, "rgba(201, 162, 39, 0)");

        ctx.fillStyle = gradGold;
        ctx.beginPath();
        ctx.moveTo(x - bWidth / 2, height);
        ctx.lineTo(x + bWidth / 2, height);
        ctx.lineTo(x + bWidth * 0.8, height - beamHeight);
        ctx.lineTo(x - bWidth * 0.8, height - beamHeight);
        ctx.closePath();
        ctx.fill();

        // Subtle Cyan/Navy atmospheric contrast beam
        const alphaNavy = 0.15 + 0.06 * Math.cos(i * 0.5 - time);
        const gradNavy = ctx.createLinearGradient(x + 10, height, x + 10, height - beamHeight * 0.9);
        gradNavy.addColorStop(0, `rgba(30, 69, 112, ${alphaNavy})`);
        gradNavy.addColorStop(1, "rgba(15, 37, 64, 0)");

        ctx.fillStyle = gradNavy;
        ctx.beginPath();
        ctx.moveTo(x - bWidth * 0.4 + 10, height);
        ctx.lineTo(x + bWidth * 0.4 + 10, height);
        ctx.lineTo(x + bWidth * 0.6 + 10, height - beamHeight * 0.9);
        ctx.lineTo(x - bWidth * 0.6 + 10, height - beamHeight * 0.9);
        ctx.closePath();
        ctx.fill();
      }

      // Draw floating golden particles (Projector dust motes)
      ctx.globalCompositeOperation = "source-over";
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(time * 50 * p.pulseSpeed) * 0.005;

        // Wrap around boundaries
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `rgba(240, 192, 64, ${Math.max(0.1, Math.min(0.9, p.opacity))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
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
      {/* Dynamic Animated Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full filter blur-[2px]"
      />

      {/* Atmospheric Vignette & Radial Spotlight Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(201, 162, 39, 0.12) 0%, rgba(15, 37, 64, 0.6) 60%, rgba(0, 0, 0, 0.9) 100%)",
        }}
      />

      {/* Film grain subtle overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Children content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
