import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { createAppTheme } from '@/theme/theme';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider
 * Provides Material UI theme with dark/light mode support
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode] = useLocalStorage<'light' | 'dark'>('theme-mode', 'light');

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

