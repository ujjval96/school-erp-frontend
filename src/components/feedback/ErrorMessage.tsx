import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { getErrorMessage } from '@/services/api/apiClient';

interface ErrorMessageProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
}

/**
 * ErrorMessage
 * Display API or general errors with optional retry
 */
export default function ErrorMessage({ error, title = 'Error', onRetry }: ErrorMessageProps) {
  const message = getErrorMessage(error);

  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {message}
        {onRetry && (
          <Box sx={{ mt: 2 }}>
            <Button size="small" variant="outlined" onClick={onRetry}>
              Retry
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
}

