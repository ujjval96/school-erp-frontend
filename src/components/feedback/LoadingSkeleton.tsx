import { Skeleton, Box, Card, CardContent } from '@mui/material';

/**
 * Loading Skeleton Components
 * Various skeleton layouts for loading states
 */

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Box>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={52}
          sx={{ mb: 1, borderRadius: 1 }}
        />
      ))}
    </Box>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }}/>
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} />
      </CardContent>
    </Card>
  );
}

export function FormSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width="30%" height={40} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width={120} height={40} />
    </Box>
  );
}

export function ProfileSkeleton() {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Skeleton variant="circular" width={48} height={48} />
      <Box flex={1}>
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="60%" height={20} />
      </Box>
    </Box>
  );
}

export default function LoadingSkeleton({ variant = 'table', rows }: { variant?: 'table' | 'card' | 'form' | 'profile'; rows?: number }) {
  switch (variant) {
    case 'table':
      return <TableSkeleton rows={rows} />;
    case 'card':
      return <CardSkeleton />;
    case 'form':
      return <FormSkeleton />;
    case 'profile':
      return <ProfileSkeleton />;
    default:
      return <TableSkeleton rows={rows} />;
  }
}

