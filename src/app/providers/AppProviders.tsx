import { ReactNode } from 'react';
import ThemeProvider from './ThemeProvider';
import QueryProvider from './QueryProvider';
import { ToastProvider } from '@/components/feedback/Toast';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders
 * Combines all app-level providers in the correct order
 */
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

