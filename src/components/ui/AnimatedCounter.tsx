import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface AnimatedCounterProps {
  value: string | number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState<string | number>(0);

  // Extract numeric part if string contains numbers
  const strVal = String(value);
  const numericMatch = strVal.match(/\d+/g);
  const isPureNumber = numericMatch && !strVal.includes("(");
  const targetNum = isPureNumber ? parseInt(numericMatch.join(""), 10) : null;
  const nonNumericSuffix = isPureNumber
    ? strVal.replace(/\d+/g, "") + suffix
    : suffix;

  useEffect(() => {
    if (!isInView) return;

    if (targetNum === null) {
      setDisplayValue(strVal);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Ease-out expo curve for smooth deceleration
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOut * targetNum);

      setDisplayValue(current.toLocaleString());

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(targetNum.toLocaleString());
      }
    };

    animationFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, targetNum, strVal, duration]);

  return (
    <span ref={ref} className={className}>
      {targetNum !== null ? `${displayValue}${nonNumericSuffix}` : strVal}
    </span>
  );
}
