import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import AuthLayout from '@/components/layout/AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';

/**
 * LoginPage
 * OIDC login page
 */
export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { subdomain } = useTenant();

  const handleLogin = async () => {
    await login();
  };

  return (
    <AuthLayout>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          School ERP
        </Typography>
        
        {subdomain && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {subdomain}
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to access your dashboard
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
          onClick={handleLogin}
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? 'Signing in...' : 'Sign in with SSO'}
        </Button>
      </Box>
    </AuthLayout>
  );
}

