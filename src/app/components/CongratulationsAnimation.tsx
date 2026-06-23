import { useEffect, useState } from "react";
import { CheckCircle, Sparkles } from "lucide-react";

export function CongratulationsAnimation({ onComplete }: { onComplete: () => void }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => onComplete(), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className={`text-center transition-all duration-700 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping">
            <CheckCircle size={120} className="text-green-500 opacity-20" />
          </div>
          <CheckCircle size={120} className="relative text-green-500 animate-bounce" />
          <Sparkles 
            size={24} 
            className="absolute -top-2 -right-2 text-yellow-500 animate-spin" 
            style={{ animationDuration: '3s' }}
          />
          <Sparkles 
            size={20} 
            className="absolute -bottom-2 -left-2 text-yellow-500 animate-spin" 
            style={{ animationDuration: '2.5s' }}
          />
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Congratulations!
        </h2>
        <p className="text-lg text-slate-600 mb-4">
          Your membership application has been submitted successfully
        </p>
        <p className="text-sm text-slate-500">
          We will review your application and get back to you soon
        </p>
      </div>
    </div>
  );
}
