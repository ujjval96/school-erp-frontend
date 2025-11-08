# Research & Technology Decisions

**Phase**: 0 - Research  
**Date**: 2024-11-08  
**Status**: Complete

This document captures research findings and technology decisions for the School ERP Frontend baseline implementation.

---

## Table of Contents

1. [OIDC Integration](#1-oidc-integration)
2. [TanStack Router + Query Integration](#2-tanstack-router--query-integration)
3. [Multi-Tenant Subdomain Handling](#3-multi-tenant-subdomain-handling)
4. [Material UI Theme Customization](#4-material-ui-theme-customization)
5. [Performance Optimization](#5-performance-optimization)
6. [Token Storage Strategy](#6-token-storage-strategy)
7. [Form Management](#7-form-management)
8. [State Management Architecture](#8-state-management-architecture)

---

## 1. OIDC Integration

### Decision: Use oidc-client-ts with React Wrapper

**Rationale**:
- `oidc-client-ts` is the TypeScript successor to oidc-client-js, officially maintained
- Provides complete OIDC/OAuth2 implementation with PKCE support
- Well-tested and widely adopted in production React applications
- Strong TypeScript support aligns with project constitution

**Implementation Pattern**:

```typescript
// src/services/oidc/oidcClient.ts
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid email profile tenant school.read school.write',
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcConfig);

// Hook wrapper
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    userManager.getUser().then(user => {
      setUser(user);
      setIsLoading(false);
    });

    const handleUserLoaded = (user: User) => setUser(user);
    const handleUserUnloaded = () => setUser(null);

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !user.expired,
    login: () => userManager.signinRedirect(),
    logout: () => userManager.signoutRedirect(),
  };
}
```

**PKCE Implementation**:
- Enabled automatically by oidc-client-ts when `response_type: 'code'` is used
- No additional configuration needed
- Provides protection against authorization code interception attacks

**Alternatives Considered**:
- **react-oidc-context**: Higher-level wrapper but adds abstraction layer
- **Auth0 React SDK**: Too specific to Auth0, not compatible with our OIDC service
- **NextAuth.js**: Designed for Next.js, not compatible with Vite/React SPA
- **Custom implementation**: Too complex and error-prone

**Integration with Existing central-oidc-service**:
- ✅ Compatible with school-erp client configuration
- ✅ Supports subdomain-based redirect URIs (`http://*.localhost:5173/auth/callback`)
- ✅ Handles token refresh automatically via `automaticSilentRenew`
- ✅ Scope matches backend requirements: `openid email profile tenant school.read school.write`

---

## 2. TanStack Router + Query Integration

### Decision: Use TanStack Router v1 with Loader Pattern

**Rationale**:
- TanStack Router provides type-safe routing with excellent TypeScript support
- Built-in support for React Query integration via loaders
- File-based or code-based routing (we'll use code-based for flexibility)
- Route-level code splitting works seamlessly

**Implementation Pattern**:

```typescript
// src/app/router.tsx
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: lazy(() => import('@/features/dashboard/components/DashboardPage')),
  loader: ({ context }) => {
    // Prefetch dashboard data
    return context.queryClient.ensureQueryData({
      queryKey: ['dashboard', 'stats'],
      queryFn: dashboardService.getStats,
    });
  },
  beforeLoad: ({ context, location }) => {
    // Auth guard
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
});

const router = createRouter({
  routeTree: rootRoute.addChildren([dashboardRoute, /* other routes */]),
  context: {
    auth: undefined!, // Will be provided by RouterProvider
    queryClient: undefined!,
  },
});
```

**Route Guards Pattern**:

```typescript
// src/utils/routeGuards.ts
export function requireAuth({ context, location }) {
  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: { redirect: location.pathname },
    });
  }
}

export function requireRole(roles: string[]) {
  return ({ context, location }) => {
    if (!context.auth.user?.roles.some(role => roles.includes(role))) {
      throw redirect({ to: '/403' });
    }
  };
}
```

**Lazy Loading**:

```typescript
const studentRoutes = createRoute({
  getParentRoute: () => rootRoute,
  path: '/students',
  component: lazy(() => import('@/features/students/components/StudentList')),
});
```

**Alternatives Considered**:
- **React Router v6**: Less type-safe, no built-in React Query integration
- **Remix**: Full-stack framework, overkill for SPA
- **Next.js App Router**: Requires Next.js framework

---

## 3. Multi-Tenant Subdomain Handling

### Decision: Client-Side Subdomain Detection + Vite Proxy for Dev

**Rationale**:
- Subdomain detection is straightforward in browser: `window.location.hostname`
- Vite dev server can be configured for local subdomain testing
- No server-side rendering needed for subdomain routing
- Works seamlessly with static hosting (Vercel, Netlify)

**Implementation Pattern**:

```typescript
// src/hooks/useTenant.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantStore {
  subdomain: string | null;
  tenantId: string | null;
  branding: TenantBranding | null;
  setTenant: (subdomain: string, tenantId: string, branding: TenantBranding) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      subdomain: null,
      tenantId: null,
      branding: null,
      setTenant: (subdomain, tenantId, branding) => set({ subdomain, tenantId, branding }),
      clearTenant: () => set({ subdomain: null, tenantId: null, branding: null }),
    }),
    {
      name: 'tenant-context',
    }
  )
);

// Extract subdomain on app init
export function extractSubdomain(): string | null {
  const hostname = window.location.hostname;
  
  // Handle localhost:5173 patterns
  if (hostname.includes('localhost')) {
    // Pattern: school1.localhost:5173
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost') {
      return parts[0]; // e.g., "school1"
    }
    return 'default'; // Default tenant for localhost
  }
  
  // Handle production patterns: school1.school.com
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0]; // e.g., "school1" from "school1.school.com"
  }
  
  return null;
}

// Initialize tenant context
export function useTenantInit() {
  const { setTenant } = useTenantStore();
  const subdomain = extractSubdomain();
  
  const { data: tenantInfo } = useQuery({
    queryKey: ['tenant', subdomain],
    queryFn: () => tenantService.getTenantBySubdomain(subdomain!),
    enabled: !!subdomain,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  useEffect(() => {
    if (tenantInfo) {
      setTenant(subdomain!, tenantInfo.id, tenantInfo.branding);
    }
  }, [tenantInfo, subdomain, setTenant]);
}
```

**Vite Dev Server Configuration**:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,
    // Enable wildcard subdomains in development
    // Access via: school1.localhost:5173, school2.localhost:5173
  },
});
```

**Local Development Testing**:
- Add entries to `/etc/hosts` (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
  ```
  127.0.0.1 school1.localhost
  127.0.0.1 school2.localhost
  ```
- Access: `http://school1.localhost:5173`, `http://school2.localhost:5173`

**Production Deployment**:
- Configure wildcard DNS: `*.school.com` → CDN/hosting
- Vercel: Automatically handles wildcard subdomains
- Netlify: Configure wildcard domain in DNS and Netlify settings
- CloudFront: Configure alternate domain names with wildcard certificate

**Alternatives Considered**:
- **Path-based multi-tenancy** (`/school1/...`): Less clean UX, complicates routing
- **Header-based** (X-Tenant-ID): Doesn't work for initial page load, requires server-side rendering
- **Separate deployments per tenant**: Not scalable for 10,000 schools

---

## 4. Material UI Theme Customization

### Decision: Dynamic Theme with Tenant-Specific Overrides

**Rationale**:
- Material UI provides robust theming with TypeScript support
- Can dynamically apply tenant colors fetched from backend
- Theme switching (light/dark) built into MUI
- Component style overrides centralized in theme

**Implementation Pattern**:

```typescript
// src/theme/theme.ts
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo } from 'react';

export function useAppTheme(mode: 'light' | 'dark', primaryColor?: string) {
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
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '2.5rem',
          fontWeight: 600,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none', // Disable uppercase
              borderRadius: 8,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
          },
        },
      },
    });
  }, [mode, primaryColor]);
}

// Usage in App
export function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const { branding } = useTenantStore();
  const theme = useAppTheme(mode, branding?.primaryColor);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* App content */}
    </ThemeProvider>
  );
}
```

**Theme Persistence**:

```typescript
// Store theme preference in localStorage
export function useThemeMode() {
  const [mode, setMode] = useLocalStorage<'light' | 'dark'>('theme-mode', 'light');
  
  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return { mode, toggleTheme };
}
```

**Tenant Branding Application**:
- Fetch branding (logo URL, primary color, secondary color) from backend
- Apply primary color to theme dynamically
- Display logo in Header component
- Cache branding with React Query (1 hour stale time)

**Alternatives Considered**:
- **CSS Variables**: Less type-safe, harder to integrate with MUI components
- **Styled-components**: Additional dependency, MUI's built-in styling sufficient
- **Tailwind CSS**: Violates Constitution Principle 1 (Material UI First)

---

## 5. Performance Optimization

### Decision: Multi-Layered Optimization Strategy

**Strategy Components**:

1. **Code Splitting & Lazy Loading**

```typescript
// Route-level code splitting
const DashboardPage = lazy(() => import('@/features/dashboard/components/DashboardPage'));
const StudentList = lazy(() => import('@/features/students/components/StudentList'));

// Component-level splitting for heavy components
const StudentForm = lazy(() => import('@/features/students/components/StudentForm'));
```

2. **Virtual Scrolling for Large Lists**

```typescript
// Using react-window for virtualization
import { FixedSizeList } from 'react-window';

function StudentList({ students }: { students: Student[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={students.length}
      itemSize={72}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <StudentRow student={students[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

3. **React Query Caching Strategy**

```typescript
// src/config/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes for list data
      cacheTime: 10 * 60 * 1000, // 10 minutes cache
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

// Different stale times for different data types
useQuery({
  queryKey: ['students', filters],
  queryFn: () => studentService.getStudents(filters),
  staleTime: 5 * 60 * 1000, // 5 min (list data)
});

useQuery({
  queryKey: ['student', id],
  queryFn: () => studentService.getStudent(id),
  staleTime: 1 * 60 * 1000, // 1 min (detail data)
});

useQuery({
  queryKey: ['tenant', subdomain],
  queryFn: () => tenantService.getTenant(subdomain),
  staleTime: 60 * 60 * 1000, // 1 hour (config data)
});
```

4. **Debounced Search**

```typescript
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage in search
function StudentSearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const { data } = useQuery({
    queryKey: ['students', { search: debouncedSearch }],
    queryFn: () => studentService.search(debouncedSearch),
  });
}
```

5. **Image Optimization**

```typescript
// Lazy load images with placeholder
import { useState } from 'react';

function StudentPhoto({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <Box position="relative">
      {!loaded && <Skeleton variant="circular" width={48} height={48} />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </Box>
  );
}
```

6. **Bundle Optimization**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-tanstack': ['@tanstack/react-query', '@tanstack/react-router'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

**Performance Targets**:
- Initial bundle: <= 500KB gzipped
- Route transition: <= 300ms
- API response (cached): <= 100ms
- API response (network): <= 1s
- Lighthouse Performance: >= 90 (desktop), >= 80 (mobile)

**Monitoring**:
- Lighthouse CI in GitHub Actions
- Bundle analyzer in build process
- Vercel Analytics in production
- React DevTools Profiler for component optimization

---

## 6. Token Storage Strategy

### Decision: Use oidc-client-ts Default Storage with Secure Configuration

**Rationale**:
- oidc-client-ts manages token storage internally
- Uses localStorage by default (can be configured)
- Tokens are never exposed in code, managed by library
- Automatic token refresh handled by library

**Implementation**:

```typescript
// src/services/oidc/oidcClient.ts
import { WebStorageStateStore } from 'oidc-client-ts';

const oidcConfig = {
  // ... other config
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTimeInSeconds: 60,
};

export const userManager = new UserManager(oidcConfig);

// Access token is automatically added to requests
userManager.getUser().then(user => {
  if (user) {
    const accessToken = user.access_token;
    // Used by API interceptor
  }
});
```

**API Interceptor Integration**:

```typescript
// src/services/api/interceptors.ts
import { userManager } from '@/services/oidc/oidcClient';

apiClient.interceptors.request.use(async (config) => {
  const user = await userManager.getUser();
  
  if (user && !user.expired) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try silent refresh
      try {
        const user = await userManager.signinSilent();
        if (user) {
          // Retry original request with new token
          error.config.headers.Authorization = `Bearer ${user.access_token}`;
          return apiClient.request(error.config);
        }
      } catch {
        // Silent refresh failed, logout
        await userManager.signoutRedirect();
      }
    }
    return Promise.reject(error);
  }
);
```

**Security Considerations**:
- ✅ localStorage is acceptable for SPAs (no XSS if inputs sanitized)
- ✅ Tokens managed by library, not exposed in code
- ✅ Automatic token refresh reduces exposure window
- ✅ HTTPS required in production
- ✅ CSP headers prevent script injection

**Alternatives Considered**:
- **httpOnly cookies**: Requires server-side rendering or backend proxy, not suitable for SPA
- **sessionStorage**: Lost on tab close, poor UX
- **In-memory only**: Lost on refresh, poor UX
- **IndexedDB**: Overcomplicated for token storage

**Note**: oidc-client-ts handles token security best practices internally, including state validation, nonce verification, and PKCE.

---

## 7. Form Management

### Decision: React Hook Form + Yup Validation

**Rationale**:
- React Hook Form provides excellent performance (uncontrolled forms)
- Yup provides schema-based validation with TypeScript support
- Integrates well with Material UI via Controller
- Supports multi-step wizards
- Minimal re-renders compared to Formik

**Implementation Pattern**:

```typescript
// src/features/students/components/StudentForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const studentSchema = yup.object({
  firstName: yup.string().required('First name is required').min(2),
  lastName: yup.string().required('Last name is required').min(2),
  dateOfBirth: yup.date().required('Date of birth is required').max(new Date(), 'Cannot be future date'),
  email: yup.string().email('Invalid email').optional(),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Must be 10 digits').required(),
}).required();

type StudentFormData = yup.InferType<typeof studentSchema>;

export function StudentForm({ student, onSubmit }: StudentFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: yupResolver(studentSchema),
    defaultValues: student || {},
  });
  
  const mutation = useCreateStudent();
  
  const onSubmitHandler = async (data: StudentFormData) => {
    await mutation.mutateAsync(data);
    onSubmit?.();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="First Name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
          />
        )}
      />
      {/* Other fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
```

**Multi-Step Wizard Pattern**:

```typescript
// src/features/students/components/StudentFormWizard.tsx
export function StudentFormWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const { control, trigger, getValues } = useForm();
  
  const steps = [
    { label: 'Personal Info', component: PersonalInfoStep },
    { label: 'Academic Info', component: AcademicInfoStep },
    { label: 'Contact Info', component: ContactInfoStep },
  ];
  
  const handleNext = async () => {
    const isValid = await trigger(); // Validate current step
    if (isValid) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  const handleSubmit = async () => {
    const data = getValues();
    // Submit all form data
  };
  
  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Render current step */}
      <Box>{React.createElement(steps[activeStep].component, { control })}</Box>
      
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
}
```

**Alternatives Considered**:
- **Formik**: More re-renders, slower performance
- **Final Form**: Less TypeScript support
- **Controlled forms (useState)**: Performance issues with large forms
- **Material UI forms without library**: Too much boilerplate

---

## 8. State Management Architecture

### Decision: Hybrid Approach - React Query + Zustand + React Context

**Rationale**:
- **React Query**: Server state (API data)
- **Zustand**: Global client state (theme, UI state)
- **React Context**: Scoped component state (rarely needed)
- Avoids Redux complexity while maintaining clear state boundaries

**Architecture**:

```typescript
// 1. Server State (React Query)
// src/features/students/hooks/useStudents.ts
export function useStudents(filters: StudentFilters) {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentService.getStudents(filters),
  });
}

// 2. Global Client State (Zustand)
// src/store/uiStore.ts
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// 3. Persisted State (Zustand + Persist)
// src/store/tenantStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantStore {
  subdomain: string | null;
  tenantId: string | null;
  setTenant: (subdomain: string, tenantId: string) => void;
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      subdomain: null,
      tenantId: null,
      setTenant: (subdomain, tenantId) => set({ subdomain, tenantId }),
    }),
    { name: 'tenant-context' }
  )
);

// 4. Scoped State (React Context) - Use sparingly
// src/features/students/StudentFilterContext.tsx
const StudentFilterContext = createContext<StudentFilters | null>(null);

export function StudentFilterProvider({ children }) {
  const [filters, setFilters] = useState<StudentFilters>({});
  return (
    <StudentFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </StudentFilterContext.Provider>
  );
}
```

**State Type Guidelines**:

| State Type | Storage | Example |
|------------|---------|---------|
| Server data | React Query | Students, teachers, attendance records |
| Authentication | OIDC library + Query | User profile, tokens |
| Global UI state | Zustand | Sidebar open/closed, theme mode |
| Tenant context | Zustand + Persist | Subdomain, tenant ID, branding |
| Form state | React Hook Form | Form inputs, validation |
| Component state | useState | Modal open/closed, local UI |
| Scoped state | React Context | Filter state within a feature |

**Alternatives Considered**:
- **Redux**: Too much boilerplate, unnecessary complexity
- **MobX**: Observable pattern not idiomatic in React
- **Recoil**: Experimental, less community adoption
- **Jotai**: Atomic approach adds complexity
- **Context + useReducer everywhere**: Performance issues, unnecessary re-renders

---

## Summary of Technology Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **OIDC** | oidc-client-ts | Official library, TypeScript support, PKCE built-in |
| **Routing** | TanStack Router | Type-safe, React Query integration, modern |
| **Server State** | TanStack Query | Caching, automatic refetch, optimistic updates |
| **Client State** | Zustand | Simple, performant, TypeScript-friendly |
| **Forms** | React Hook Form + Yup | Performance, validation, MUI integration |
| **UI Library** | Material UI v7.3.4 | Constitution requirement, comprehensive |
| **Build Tool** | Vite | Fast, modern, great DX |
| **Testing** | Vitest + RTL + Playwright | Fast, React-focused, E2E coverage |
| **HTTP Client** | Axios | Interceptors, request cancellation |
| **Virtual Scrolling** | react-window | Performance, simple API |
| **Theme** | MUI Theme + Dynamic colors | Tenant branding, light/dark mode |
| **Token Storage** | oidc-client-ts managed | Secure, automatic, library-managed |

---

## Next Phase

**Phase 1**: Create `data-model.md` and `contracts/` directory with API specifications.

**Status**: ✅ Research Complete  
**Updated**: 2024-11-08

