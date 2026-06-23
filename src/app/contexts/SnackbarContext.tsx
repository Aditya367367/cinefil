import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, SnackbarMessage, SnackbarSeverity } from '../components/Snackbar';

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: SnackbarSeverity, duration?: number) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const showSnackbar = (message: string, severity: SnackbarSeverity = 'info', duration?: number) => {
    const id = Date.now().toString();
    setSnackbar({ id, message, severity, duration });
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
