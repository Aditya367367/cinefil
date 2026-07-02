import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, SnackbarMessage, SnackbarSeverity } from '../components/pages/Snackbar';
import { handleApiError } from '../../utils/errorHandler';

interface SnackbarContextType {
  showSnackbar: (message: any, severity?: SnackbarSeverity, duration?: number) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const showSnackbar = (message: any, severity: SnackbarSeverity = 'info', duration?: number) => {
    const id = Date.now().toString();
    let resolvedMessage = 'An unexpected error occurred';
    
    if (typeof message === 'string') {
      resolvedMessage = message;
    } else if (message && typeof message === 'object') {
      resolvedMessage = handleApiError(message);
    }
    
    setSnackbar({ id, message: resolvedMessage, severity, duration });
  };

  const hideSnackbar = () => {
    setSnackbar(null);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      {snackbar && <Snackbar message={snackbar} onClose={hideSnackbar} />}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
