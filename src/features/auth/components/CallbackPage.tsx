import { Box, Typography, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/components/layout/AuthLayout';

/**
 * CallbackPage
 * OIDC callback handler
 */
export default function CallbackPage() {
  const navigate = useNavigate();
  const { handleCallback, isAuthenticated } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleCallback();
        
        // Redirect to dashboard after successful auth
        if (isAuthenticated) {
          navigate({ to: '/' });
        }
      } catch (error) {
        console.error('Callback error:', error);
        navigate({ to: '/login' });
      }
    };

    processCallback();
  }, [handleCallback, isAuthenticated, navigate]);

  return (
    <AuthLayout>
      <Box textAlign="center">
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Signing you in...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we complete the authentication process.
        </Typography>
      </Box>
    </AuthLayout>
  );
}

