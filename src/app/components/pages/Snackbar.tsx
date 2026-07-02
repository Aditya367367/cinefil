import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarMessage {
  id: string;
  message: string;
  severity: SnackbarSeverity;
  duration?: number;
}

interface SnackbarProps {
  message: SnackbarMessage;
  onClose: () => void;
}

export function Snackbar({ message, onClose }: SnackbarProps) {
  useEffect(() => {
    const duration = message.duration || 5000;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const getSeverityStyles = () => {
    switch (message.severity) {
      case 'success':
        return {
          bgColor: 'bg-[#0f2540]/95 backdrop-blur-md',
          borderColor: 'border-[var(--cinefil-gold)]/40',
          icon: <CheckCircle size={20} className="text-[var(--cinefil-gold)]" />,
          textColor: 'text-white',
        };
      case 'error':
        return {
          bgColor: 'bg-rose-950/95 backdrop-blur-md',
          borderColor: 'border-rose-500/40',
          icon: <AlertCircle size={20} className="text-rose-400" />,
          textColor: 'text-white',
        };
      case 'warning':
        return {
          bgColor: 'bg-[#183858]/95 backdrop-blur-md',
          borderColor: 'border-amber-500/40',
          icon: <AlertCircle size={20} className="text-amber-400" />,
          textColor: 'text-white',
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-[#0f2540]/95 backdrop-blur-md',
          borderColor: 'border-blue-400/40',
          icon: <Info size={20} className="text-blue-400" />,
          textColor: 'text-white',
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div className={`fixed bottom-4 right-4 z-50 animate-slide-up`}>
      <div className={`${styles.bgColor} ${styles.borderColor} border rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-4 flex items-center gap-3 min-w-[320px] max-w-md`}>
        {styles.icon}
        <p className={`flex-1 text-sm font-medium ${styles.textColor}`}>{message.message}</p>
        <button
          onClick={onClose}
          className={`text-white/60 hover:text-white transition`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
