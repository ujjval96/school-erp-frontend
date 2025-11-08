# Quick Start Guide

**Version**: 1.0.0  
**Date**: 2024-11-08  
**Status**: Complete

This guide helps you get the School ERP Frontend up and running quickly for local development.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **npm**: v10.x or higher (comes with Node.js)
- **Git**: Latest version
- **Backend Services Running**:
  - central-oidc-service at `http://localhost:8080`
  - erp-backend at `http://localhost:3000`

---

## Step 1: Clone the Repository

```bash
cd /Users/ujjwal/Documents/saas_product
cd school-erp-frontend
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies:
- React 19.1.1
- Material UI v7.3.4
- TanStack Router & Query
- Axios, Zustand, oidc-client-ts
- Vite, TypeScript, ESLint

---

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with the following configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1

# OIDC Configuration
VITE_OIDC_AUTHORITY=http://localhost:8080
VITE_OIDC_CLIENT_ID=school-erp
VITE_OIDC_CLIENT_SECRET=school-erp-secret-dev
VITE_OIDC_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
VITE_OIDC_SCOPES=openid email profile tenant school.read school.write

# App Configuration
VITE_APP_NAME=School ERP
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=debug

# Feature Flags (optional)
VITE_FEATURE_ONLINE_PAYMENT=false
VITE_FEATURE_SMS_NOTIFICATIONS=false
```

---

## Step 4: Set Up Local Subdomain (Optional)

To test multi-tenant subdomain routing locally, add entries to your hosts file:

### macOS/Linux

```bash
sudo nano /etc/hosts
```

Add these lines:

```
127.0.0.1 school1.localhost
127.0.0.1 school2.localhost
127.0.0.1 default.localhost
```

### Windows

```bash
notepad C:\Windows\System32\drivers\etc\hosts
```

Add the same lines as above.

**Note**: Modern browsers support `*.localhost` by default, so this step may be optional.

---

## Step 5: Start the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

You should see output like:

```
VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
  ➜  press h + enter to show help
```

---

## Step 6: Access the Application

Open your browser and navigate to:

- **Default tenant**: `http://localhost:5173`
- **School 1**: `http://school1.localhost:5173`
- **School 2**: `http://school2.localhost:5173`

---

## Step 7: Login

### Test Credentials

Use the test credentials from your erp-backend:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Teacher User:**
- Email: `teacher@example.com`
- Password: `teacher123`

**Login Flow:**
1. Click "Login" button
2. You'll be redirected to OIDC service at `http://localhost:8080`
3. Enter credentials
4. You'll be redirected back to the app at `/auth/callback`
5. After token exchange, you'll land on the dashboard

---

## Project Structure

```
school-erp-frontend/
├── public/                    # Static assets
├── src/
│   ├── app/                   # App initialization
│   ├── features/              # Feature modules
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── teachers/
│   │   └── ...
│   ├── components/            # Shared components
│   │   ├── layout/
│   │   ├── common/
│   │   └── feedback/
│   ├── hooks/                 # Shared hooks
│   ├── services/              # API services
│   ├── store/                 # State management
│   ├── theme/                 # Material UI theme
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   ├── config/                # Configuration
│   └── main.tsx               # Entry point
├── specs/                     # Specifications
├── .env.example               # Example environment
├── .env.local                 # Local environment (gitignored)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Development Workflow

### 1. Create a New Feature

Follow the feature-based architecture:

```bash
# Create feature directory structure
mkdir -p src/features/my-feature/{components,hooks,services,types}
```

Create the following files:
- `components/MyFeaturePage.tsx` - Main page component
- `hooks/useMyFeature.ts` - React Query hooks
- `services/myFeatureService.ts` - API service
- `types/myFeature.types.ts` - TypeScript types

### 2. Add Routes

Edit `src/app/router.tsx`:

```typescript
import { lazy } from 'react';

const MyFeaturePage = lazy(() => import('@/features/my-feature/components/MyFeaturePage'));

const myFeatureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-feature',
  component: MyFeaturePage,
  beforeLoad: requireAuth, // Add auth guard
});
```

### 3. Create API Service

Create `src/features/my-feature/services/myFeatureService.ts`:

```typescript
import { apiClient } from '@/services/api/apiClient';
import type { MyFeature } from '../types/myFeature.types';

export const myFeatureService = {
  async getAll(): Promise<MyFeature[]> {
    const { data } = await apiClient.get('/my-feature');
    return data.data;
  },
  
  async getById(id: string): Promise<MyFeature> {
    const { data } = await apiClient.get(`/my-feature/${id}`);
    return data.data;
  },
  
  async create(item: Partial<MyFeature>): Promise<MyFeature> {
    const { data } = await apiClient.post('/my-feature', item);
    return data.data;
  },
};
```

### 4. Create React Query Hooks

Create `src/features/my-feature/hooks/useMyFeature.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { myFeatureService } from '../services/myFeatureService';

export function useMyFeatures() {
  return useQuery({
    queryKey: ['my-features'],
    queryFn: myFeatureService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateMyFeature() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: myFeatureService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-features'] });
    },
  });
}
```

### 5. Create Components

Use Material UI components exclusively:

```typescript
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useMyFeatures } from '../hooks/useMyFeature';

export default function MyFeaturePage() {
  const { data: items, isLoading } = useMyFeatures();
  
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Feature
      </Typography>
      
      {items?.map((item) => (
        <Card key={item.id}>
          <CardContent>
            <Typography variant="h6">{item.name}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
```

---

## Available Scripts

### Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
```

### Testing

```bash
npm run test         # Run unit tests (Vitest)
npm run test:ui      # Open Vitest UI
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run E2E tests (Playwright)
```

---

## Common Tasks

### Add a New Dependency

```bash
npm install package-name
npm install -D package-name  # Dev dependency
```

### Update Material UI Theme

Edit `src/theme/theme.ts`:

```typescript
export function useAppTheme(mode: 'light' | 'dark', primaryColor?: string) {
  return useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: primaryColor || '#1976d2',
        },
      },
    });
  }, [mode, primaryColor]);
}
```

### Add Environment Variable

1. Add to `.env.local`:
   ```env
   VITE_NEW_VAR=value
   ```

2. Update TypeScript types in `src/vite-env.d.ts`:
   ```typescript
   interface ImportMetaEnv {
     readonly VITE_NEW_VAR: string;
     // ... other vars
   }
   ```

3. Use in code:
   ```typescript
   const newVar = import.meta.env.VITE_NEW_VAR;
   ```

---

## Debugging

### React DevTools

Install React DevTools browser extension:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### TanStack Query DevTools

Already included in development mode. Access via floating icon in bottom-right corner.

### Network Debugging

Open browser DevTools → Network tab to inspect API calls:
- Check request headers (Authorization, x-tenant-subdomain)
- Check response status and data
- Look for failed requests

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "/@fs/*": "/*"
      }
    }
  ]
}
```

Press F5 to start debugging.

---

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts
export default defineConfig({
  server: {
    port: 3001, // Use different port
  },
});
```

### Backend Connection Refused

Ensure backend services are running:

```bash
# Check OIDC service
curl http://localhost:8080/health

# Check ERP backend
curl http://localhost:3000/health
```

### CORS Errors

Verify CORS is configured in erp-backend `.env`:

```env
CORS_ORIGIN=http://localhost:5173
```

### OIDC Redirect Loop

Check OIDC configuration:
1. Verify client ID matches: `school-erp`
2. Verify redirect URI matches: `http://localhost:5173/auth/callback`
3. Check browser console for errors

### TypeScript Errors

```bash
# Regenerate type definitions
npm run type-check

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Vite HMR Not Working

```bash
# Restart dev server
npm run dev

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## Next Steps

1. **Read the Constitution**: Review `.specify/memory/constitution.md` for coding standards
2. **Explore the Codebase**: Start with `src/app/App.tsx` and `src/app/router.tsx`
3. **Check Examples**: Look at `src/features/auth/` for a complete feature example
4. **Run Tests**: Execute `npm run test` to see test examples
5. **Review Spec**: Read `.specify/memory/baseline-spec.md` for requirements

---

## Resources

- [React Documentation](https://react.dev/)
- [Material UI Documentation](https://mui.com/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Getting Help

- Check the [backend API docs](http://localhost:3000/api/docs)
- Review the [baseline spec](../../.specify/memory/baseline-spec.md)
- Ask the team in Slack/Discord
- Open an issue in GitHub

---

**Status**: ✅ Quick Start Complete  
**Updated**: 2024-11-08

**Happy Coding! 🚀**

