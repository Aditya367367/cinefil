import React, { useRef } from "react";
import { cn } from "../../lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(201, 162, 39, 0.15)",
  borderColor = "rgba(201, 162, 39, 0.3)",
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !glowRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(350px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`;
  };

  const handleMouseEnter = () => {
    if (glowRef.current) glowRef.current.style.opacity = "1";
    if (divRef.current) divRef.current.style.borderColor = borderColor;
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
    if (divRef.current) divRef.current.style.borderColor = "";
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-[4px] border bg-white overflow-hidden transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Radial spotlight glow overlay */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 ease-in-out opacity-0"
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

