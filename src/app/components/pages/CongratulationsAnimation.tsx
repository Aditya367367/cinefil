import { useEffect, useState } from "react";
import { CheckCircle, Sparkles } from "lucide-react";

export function CongratulationsAnimation({ onComplete }: { onComplete: () => void }) {
  const [showContent, setShowContent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 100);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      onComplete();
      window.location.href = "/member-dashboard";
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearInterval(interval);
      clearTimeout(redirectTimer);
    };
  }, [onComplete]);

  // SVG ring properties
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 3) * circumference;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-md">
      <div className={`text-center p-8 rounded-2xl bg-white shadow-2xl transition-all duration-700 max-w-md w-full mx-4 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="relative mb-6 flex justify-center items-center">
          <div className="relative">
            <CheckCircle size={96} className="text-emerald-500 animate-bounce" />
            <Sparkles 
              size={24} 
              className="absolute -top-2 -right-2 text-amber-400 animate-spin" 
              style={{ animationDuration: '3s' }}
            />
            <Sparkles 
              size={20} 
              className="absolute -bottom-2 -left-2 text-amber-400 animate-spin" 
              style={{ animationDuration: '2.5s' }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          Application Submitted!
        </h2>
        <p className="text-sm text-slate-600 mb-6 font-medium">
          Your membership application has been submitted successfully.
        </p>

        {/* Circular Counter */}
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          <div className="relative flex items-center justify-center w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-slate-100"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-amber-500 transition-all duration-1000 ease-linear"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-2xl font-black text-slate-800">
              {timeLeft}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Redirecting to member dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}
