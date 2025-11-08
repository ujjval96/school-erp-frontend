import { createTheme, Theme } from '@mui/material/styles';
import { useMemo } from 'react';

export function useAppTheme(mode: 'light' | 'dark', primaryColor?: string): Theme {
  return useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: primaryColor || '#1976d2',
        },
        secondary: {
          main: '#dc004e',
        },
        ...(mode === 'light'
          ? {
              background: {
                default: '#f5f5f5',
                paper: '#ffffff',
              },
            }
          : {
              background: {
                default: '#121212',
                paper: '#1e1e1e',
              },
            }),
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '2.5rem',
          fontWeight: 600,
          lineHeight: 1.2,
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 600,
          lineHeight: 1.3,
        },
        h3: {
          fontSize: '1.75rem',
          fontWeight: 600,
          lineHeight: 1.4,
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 600,
          lineHeight: 1.4,
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 600,
          lineHeight: 1.5,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 600,
          lineHeight: 1.6,
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
              fontWeight: 500,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: mode === 'light'
                ? '0 2px 8px rgba(0,0,0,0.1)'
                : '0 2px 8px rgba(0,0,0,0.3)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    });
  }, [mode, primaryColor]);
}

