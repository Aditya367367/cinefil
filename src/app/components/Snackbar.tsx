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
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          icon: <CheckCircle size={20} className="text-emerald-600" />,
          textColor: 'text-emerald-900',
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: <AlertCircle size={20} className="text-red-600" />,
          textColor: 'text-red-900',
        };
      case 'warning':
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          icon: <AlertCircle size={20} className="text-amber-600" />,
          textColor: 'text-amber-900',
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: <Info size={20} className="text-blue-600" />,
          textColor: 'text-blue-900',
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div className={`fixed bottom-4 right-4 z-50 animate-slide-up`}>
      <div className={`${styles.bgColor} ${styles.borderColor} border rounded-xl shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
        {styles.icon}
        <p className={`flex-1 text-sm font-medium ${styles.textColor}`}>{message.message}</p>
        <button
          onClick={onClose}
          className={`text-slate-400 hover:text-slate-600 transition`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
