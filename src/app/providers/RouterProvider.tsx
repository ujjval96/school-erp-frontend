import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import { router } from '../router';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

/**
 * RouterProvider
 * Provides TanStack Router with loading fallback
 */
export default function RouterProvider() {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      }
    >
      <TanStackRouterProvider router={router} />
    </Suspense>
  );
}

